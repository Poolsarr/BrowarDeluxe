import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Tooltip, Paper } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const RecipesTable = ({ recipes, handleEdit, handleDelete }) => {
  const columns = [
    { field: "_id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Nazwa", width: 180 },
    { field: "style", headerName: "Styl", width: 140 },
    {
      field: "ingredients",
      headerName: "Składniki",
      width: 300,
      renderCell: (p) => {
        const items = Array.isArray(p.value) ? p.value : [];
        return (
          <span style={{ whiteSpace: "normal", fontSize: "0.75rem" }}>
            {items
              .filter((i) => i && typeof i === "object" && i.name)
              .map((i) => `${i.name} (${i.quantity ?? "?"} ${i.type ?? ""})`)
              .join(", ")}
          </span>
        );
      },
    },
    {
      field: "process",
      headerName: "Proces",
      width: 300,
      renderCell: (p) => {
        const obj = p.value && typeof p.value === "object" ? p.value : {};
        return (
          <span style={{ whiteSpace: "normal", fontSize: "0.75rem" }}>
            {Object.entries(obj)
              .map(([key, val]) => `${key}: ${val}`)
              .join(", ")}
          </span>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Ostatnia zmiana",
      width: 180,
      renderCell: (p) =>
        p.value ? p.value.slice(0, 16).replace("T", " ") : "-",
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
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              color="error"
            >
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
        rows={recipes}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
    </Paper>
  );
};

export default RecipesTable;
