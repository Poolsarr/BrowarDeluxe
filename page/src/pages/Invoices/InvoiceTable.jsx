import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const InvoiceTable = ({ invoices, handleDownload, handleDelete }) => {
  return (
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
  );
};

export default InvoiceTable;
