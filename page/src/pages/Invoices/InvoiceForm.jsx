import React, { useCallback, useState } from 'react';
import { Box, Button, TextField, Paper, Typography, Alert } from '@mui/material';
import { CloudUpload, CheckCircleOutline } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const DropzoneArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const InvoiceForm = ({ invoiceName, setInvoiceName, setSelectedFile, handleFileUpload }) => {
  const [fileName, setFileName] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] || event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setIsFileSelected(true);
    }
  }, [setSelectedFile]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Box component="form" onSubmit={handleFileUpload} sx={{ mb: 4 }}>
      <TextField
        label="Nazwa dokumentu"
        value={invoiceName}
        onChange={(e) => setInvoiceName(e.target.value)}
        fullWidth
        margin="normal"
      />
      
      <input
        type="file"
        id="file-input"
        onChange={onDrop}
        style={{ display: 'none' }}
      />
      
      <DropzoneArea
        onDrop={onDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input').click()}
        sx={{
          backgroundColor: isFileSelected ? 'rgba(76, 175, 80, 0.1)' : 'inherit'
        }}
      >
        {isFileSelected ? (
          <>
            <CheckCircleOutline sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Plik został wybrany
            </Typography>
            <Typography variant="body1" color="text.primary">
              {fileName}
            </Typography>
          </>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Przeciągnij i upuść plik tutaj
            </Typography>
            <Typography variant="body2" color="text.secondary">
              lub kliknij, aby wybrać plik
            </Typography>
          </>
        )}
      </DropzoneArea>

      {isFileSelected && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          Plik "{fileName}" został pomyślnie załączony
        </Alert>
      )}

      <Button 
        variant="contained" 
        type="submit" 
        fullWidth
        size="large"
        disabled={!isFileSelected || !invoiceName}
      >
        Wyślij dokument
      </Button>
    </Box>
  );
};

export default InvoiceForm;
