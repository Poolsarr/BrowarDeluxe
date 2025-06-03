// src/components/Invoices/InvoiceForm.jsx
import React from 'react';
import { Box, Button, TextField } from '@mui/material';

const InvoiceForm = ({ invoiceName, setInvoiceName, setSelectedFile, handleFileUpload }) => {
  return (
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
      <Button variant="contained" type="submit" sx={{ ml: 2 }}>
        Wyślij dokument
      </Button>
    </Box>
  );
};

export default InvoiceForm;
