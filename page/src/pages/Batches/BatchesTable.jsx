import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Tooltip, Paper } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const BatchesTable = ({ batches, handleEdit, handleDelete }) => {
  const columns = [
    { field: "_id", headerName: "ID", width: 100 },
    { field: "recipeId", headerName: "Receptura", width: 130 },
    {
      field: "startDate",
      headerName: "Start",
      width: 160,
      renderCell: (p) => p.value?.slice(0, 16).replace("T", " "),
    },
    {
      field: "endDate",
      headerName: "Koniec",
      width: 160,
      renderCell: (p) =>
        p.value ? p.value.slice(0, 16).replace("T", " ") : "-",
    },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "volume",
      headerName: "Objętość (L)",
      width: 120,
      type: "number",
    },
    { field: "notes", headerName: "Notatki", width: 440 },
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
        rows={batches}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
    </Paper>
  );
};

export default BatchesTable;
