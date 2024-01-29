import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../confirmationModel/Confirmation_Modal";
import {
  Box,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Add_Condition from "./Add_Condition";

const List_Condition = () => {
  const [data, setData] = useState([]);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [isAddDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false); // Added state here
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const handleDelete = (id) => {
    setSelectedDepartmentId(id);
    setConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDepartmentId) {
      axios
        .delete(
          `http://localhost:8081/api/condition/delete/${selectedDepartmentId}`
        )
        .then((res) => {
          if (res.data.Status === "Success") {
            readCondition();
            toast("Condition Delete Successfull.", {
              type: "success",
              autoClose: 1500,
              theme: "dark",
            });
          } else {
            alert("Error");
          }
        })
        .catch((err) => console.log(err));
    }
    setConfirmationModalOpen(false);
  };

  const columns = [
    { field: "serialNumber", headerName: "Sr.No.", flex: 0.2, renderCell: (params) => params.row.serialNumber },
    { field: "id", headerName: "ID" },
    {
      field: "condition",
      headerName: "Condition",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const statusText = params.value === 1 ? "Active" : "Inactive";
        return (
          <Button
            variant="contained"
            color={params.value === 1 ? "success" : "error"}
            onClick={() =>
              handleToggleStatus(params.row.id, params.value === 1 ? 0 : 1)
            }
          >
            {statusText}
          </Button>
        );
      },
    },
    {
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        const rowData = params.row;
        return (
          <Box sx={{ width: '100%', maxWidth: 360 }}>
            {/* <EditIcon style={{ color: '#ff9800', marginLeft: "10px" }} onClick={() => handleEdit(rowData.id)} /> */}
            <DeleteIcon color="error" onClick={() => handleDelete(rowData.id)} style={{ marginLeft: "10px" }} />
          </Box>
        );
      },
    },
  ];

  const readCondition = () => {
    axios
      .get(`http://localhost:8081/api/condition/getCondition`)
      .then((res) => {
        if (res.data.Status === "Success") {
          // Adding a serial number to each row
          const newData = res.data.Result.map((row, index) => ({
            ...row,
            serialNumber: index + 1,
          }));
          setData(newData);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleToggleStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8081/api/condition/toggleStatus/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          readCondition();
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    readCondition();
  }, []);

  return (
    <Box m="20px">
      <Header title="Department List" subtitle="List of Department for Reference" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <Button
          onClick={() => setAddDepartmentModalOpen(true)}
          variant="contained"
          color="success"
          size="small"
        >
          + Add Condition
        </Button>
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirm={confirmDelete}
      />
      <Add_Condition open={isAddDepartmentModalOpen} handleClose={() => setAddDepartmentModalOpen(false)} />
    </Box>
  );
};

export default List_Condition;
