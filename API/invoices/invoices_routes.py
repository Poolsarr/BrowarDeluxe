from flask import Blueprint, request, jsonify
from API.invoices.invoices_utils import (
    upload_invoice_file, 
    get_invoice_file, 
    get_all_invoices_meta,
    delete_invoice_file
)
from flask_jwt_extended import jwt_required

invoice_bp = Blueprint('invoices', __name__, url_prefix='/invoices')

@invoice_bp.route("", methods=["POST"])
@jwt_required()
def upload_invoice_route():
    return upload_invoice_file(request)

@invoice_bp.route("/<invoice_id>", methods=["GET"])
@jwt_required()
def get_invoice_route(invoice_id):
    return get_invoice_file(invoice_id)

@invoice_bp.route("", methods=["GET"])
@jwt_required()
def get_all_invoices_meta_route():
    return get_all_invoices_meta()

@invoice_bp.route("/<invoice_id>", methods=["DELETE"])
@jwt_required()
def delete_invoice_route(invoice_id):
    return delete_invoice_file(invoice_id)