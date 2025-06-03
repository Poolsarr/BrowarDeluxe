import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from './InvoiceForm';
import InvoiceTable from './InvoiceTable';
import {
  fetchInvoices,
  uploadInvoice,
  downloadInvoice,
  deleteInvoice
} from './InvoiceService';
import { motion } from 'framer-motion';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [invoiceName, setInvoiceName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Powrót */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
          >
            Powrót
          </Button>
        </Box>

        {/* Nagłówek */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Dokumenty
          </Typography>
        </motion.div>

        {/* Formularz */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <InvoiceForm
            invoiceName={invoiceName}
            setInvoiceName={setInvoiceName}
            setSelectedFile={setSelectedFile}
            handleFileUpload={handleFileUpload}
          />
        </motion.div>

        {/* Alerty */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          </motion.div>
        )}

        {/* Tabela */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <InvoiceTable
            invoices={invoices}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
          />
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Invoices;
