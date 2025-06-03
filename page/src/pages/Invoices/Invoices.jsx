// src/components/Invoices/Invoices.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import InvoiceForm from './InvoiceForm';
import InvoiceTable from './InvoiceTable';
import {
  fetchInvoices,
  uploadInvoice,
  downloadInvoice,
  deleteInvoice
} from './InvoiceService';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [invoiceName, setInvoiceName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadInvoices = async () => {
    try {
      const data = await fetchInvoices();
      setInvoices(data);
      setError('');
    } catch (err) {
      setError('Błąd podczas pobierania listy dokumentów');
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile || !invoiceName) {
      setError('Wybierz plik i podaj nazwę dokumentu');
      return;
    }

    try {
      await uploadInvoice(selectedFile, invoiceName);
      setSuccess('Dokument został pomyślnie dodany');
      setInvoiceName('');
      setSelectedFile(null);
      loadInvoices();
    } catch (err) {
      setError('Błąd podczas wysyłania dokumentu');
    }
  };

  const handleDownload = async (id) => {
    try {
      await downloadInvoice(id);
    } catch (err) {
      setError('Błąd podczas pobierania dokumentu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten dokument?')) return;

    try {
      await deleteInvoice(id);
      setSuccess('Dokument został usunięty');
      loadInvoices();
    } catch (err) {
      setError('Błąd podczas usuwania dokumentu');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dokumenty
      </Typography>

      <InvoiceForm
        invoiceName={invoiceName}
        setInvoiceName={setInvoiceName}
        setSelectedFile={setSelectedFile}
        handleFileUpload={handleFileUpload}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <InvoiceTable
        invoices={invoices}
        handleDownload={handleDownload}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default Invoices;
