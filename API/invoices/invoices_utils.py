from pymongo import MongoClient
from bson import ObjectId
from flask import jsonify, send_file, current_app
from gridfs import GridFS, NoFile
from config import Config
import io

client = MongoClient(Config.ATLAS_LOGIN)
db = client.Browar1
fs = GridFS(db)
invoices_collection = db.invoices

def upload_invoice_file(request):
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    invoicename = request.form.get('invoicename', file.filename)

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not invoicename:
        return jsonify({"error": "invoicename is required"}), 400

    try:
        file_id = fs.put(file, filename=file.filename, contentType=file.content_type, invoicename=invoicename)
        
        invoice_meta_doc = {
            "invoicename": invoicename,
            "filename": file.filename,
            "gridfs_file_id": file_id, 
            "contentType": file.content_type
        }
        result = invoices_collection.insert_one(invoice_meta_doc)
        
        return jsonify({
            "message": "Invoice uploaded successfully", 
            "invoice_id": str(result.inserted_id),
            "gridfs_file_id": str(file_id)
        }), 201

    except Exception as e:
        current_app.logger.error(f"Error uploading invoice: {e}")
        return jsonify({"error": f"An error occurred during upload: {str(e)}"}), 500

def get_invoice_file(invoice_id):
    try:
        invoice_meta = invoices_collection.find_one({"_id": ObjectId(invoice_id)})
        if not invoice_meta:
            return jsonify({"error": "Invoice metadata not found"}), 404

        gridfs_file_id = invoice_meta.get("gridfs_file_id")
        if not gridfs_file_id:
            return jsonify({"error": "GridFS file reference not found for this invoice"}), 404

        grid_out = fs.get(gridfs_file_id)
        
        file_like_object = io.BytesIO(grid_out.read())
        
        return send_file(
            file_like_object,
            mimetype=grid_out.contentType or 'application/octet-stream',
            as_attachment=True,
            download_name=grid_out.filename
        )
    except NoFile:
        return jsonify({"error": "File not found in GridFS"}), 404
    except Exception as e:
        current_app.logger.error(f"Error retrieving invoice {invoice_id}: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

def get_all_invoices_meta():
    try:
        all_invoices = list(invoices_collection.find({}, {"gridfs_file_id": 0}))
        for invoice in all_invoices:
            invoice["_id"] = str(invoice["_id"])
            if "gridfs_file_id" in invoice and invoice["gridfs_file_id"] is not None:
                 invoice["gridfs_file_id"] = str(invoice["gridfs_file_id"])
        return jsonify(all_invoices)
    except Exception as e:
        current_app.logger.error(f"Error listing invoices: {e}")
        return jsonify({"error": str(e)}), 500

def delete_invoice_file(invoice_id):
    try:
        invoice_meta = invoices_collection.find_one_and_delete({"_id": ObjectId(invoice_id)})
        if not invoice_meta:
            return jsonify({"error": "Invoice metadata not found"}), 404

        gridfs_file_id = invoice_meta.get("gridfs_file_id")
        if gridfs_file_id:
            try:
                fs.delete(gridfs_file_id)
            except NoFile:
                pass 
            except Exception as e_fs:
                current_app.logger.error(f"Error deleting from GridFS ({gridfs_file_id}): {e_fs}")
        
        return jsonify({"message": "Invoice and associated file deleted successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting invoice {invoice_id}: {e}")
        return jsonify({"error": str(e)}), 500