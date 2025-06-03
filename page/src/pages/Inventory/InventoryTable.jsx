// src/components/Inventory/InventoryTable.jsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Tooltip, Paper } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const parseField = (value) => {
  if (value && typeof value === "object") {
    if ("$numberInt" in value) return parseInt(value.$numberInt);
    if ("$date" in value) return new Date(value.$date).toLocaleString();
  }
  return value;
};

const InventoryTable = ({ items, handleEdit, handleDelete }) => {
  const columns = [
    { field: "item", headerName: "Nazwa", width: 180 },
    { field: "type", headerName: "Typ", width: 140 },
    {
      field: "quantity",
      headerName: "Ilość",
      width: 100,
      type: "number",
      renderCell: (params) => parseField(params.row.quantity),
    },
    { field: "unit", headerName: "Jednostka", width: 100 },
    { field: "location", headerName: "Lokalizacja", width: 150 },
    {
      field: "updatedAt",
      headerName: "Aktualizacja",
      width: 400,
      renderCell: (params) =>
        params.row?.updatedAt ? parseField(params.row.updatedAt) : "-",
    },
    {
      field: "actions",
      headerName: "Akcje",
      width: 130,
      sortable: false,
      align: "right",
      headerAlign: "right",
      flex: 1,
      renderCell: (params) => (
        <>
          <Tooltip title="Edytuj">
            <IconButton onClick={() => handleEdit(params.row)} color="primary">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń">
            <IconButton onClick={() => handleDelete(params.row._id)} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Paper sx={{ height: 400 }}>
      <DataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
    </Paper>
  );
};

export default InventoryTable;
