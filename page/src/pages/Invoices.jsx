import React, { useState, useEffect } from 'react';
import { 
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Alert
} from '@mui/material';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [invoiceName, setInvoiceName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError('Błąd podczas pobierania listy dokumentów');
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile || !invoiceName) {
      setError('Wybierz plik i podaj nazwę dokumentu');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('invoicename', invoiceName);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setSuccess('Dokument został pomyślnie dodany');
      setSelectedFile(null);
      setInvoiceName('');
      fetchInvoices();
    } catch (err) {
      setError('Błąd podczas wysyłania dokumentu');
      console.error('Upload error:', err);
    }
  };

  const handleDownload = async (invoiceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
        : 'downloaded-file';

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Błąd podczas pobierania dokumentu');
      console.error('Download error:', err);
    }
  };

  const handleDelete = async (invoiceId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten dokument?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setSuccess('Dokument został usunięty');
      fetchInvoices();
    } catch (err) {
      setError('Błąd podczas usuwania dokumentu');
      console.error('Delete error:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dokumenty
      </Typography>

      {/* Formularz wysyłania */}
      <Box component="form" onSubmit={handleFileUpload} sx={{ mb: 4 }}>
        <TextField
          label="Nazwa dokumentu"
          value={invoiceName}
          onChange={(e) => setInvoiceName(e.target.value)}
          sx={{ mr: 2 }}
        />
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          style={{ margin: '10px 0' }}
        />
        <Button 
          variant="contained" 
          type="submit"
          sx={{ ml: 2 }}
        >
          Wyślij dokument
        </Button>
      </Box>

      {/* Komunikaty */}
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

      {/* Lista dokumentów */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa dokumentu</TableCell>
              <TableCell>Nazwa pliku</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.invoicename}</TableCell>
                <TableCell>{invoice.filename}</TableCell>
                <TableCell>
                  <Button 
                    onClick={() => handleDownload(invoice._id)}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    Pobierz
                  </Button>
                  <Button 
                    onClick={() => handleDelete(invoice._id)}
                    variant="outlined"
                    color="error"
                  >
                    Usuń
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Invoices;