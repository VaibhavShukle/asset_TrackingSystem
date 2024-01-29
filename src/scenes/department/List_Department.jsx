import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../confirmationModel/Confirmation_Modal";
import { Box, Button, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Add_Department from "./Add_Department";

const List_Department = () => {
  const [data, setData] = useState([]);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState({
    dept_name: "",
  })


  const handleEdit=(id)=>{
    axios.get(
      `http://localhost:8081/api/department/getDepartment/${id}`
    )
    .then((res) => {
      if (res.data.Status === "Success"){
        setEditData(
         res.data.Result
        );
        setModal(!modal)
      }
    })
  }

  const handleDelete = (id) => {
    setSelectedDepartmentId(id);
    setConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDepartmentId) {
      axios
        .delete(
          `http://localhost:8081/api/department/delete/${selectedDepartmentId}`
        )
        .then((res) => {
          if (res.data.Status === "Success") {
            readDepartment();
            toast("Department Delete Successfull.", {
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
    { field: "srNo", headerName: "Sr. No", flex: 0.5 },
    { field: "dept_id", headerName: "Department ID" },
    {
      field: "dept_name",
      headerName: "Name Of Department",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => {
        const statusText = params.value === 1 ? "Active" : "Inactive";
        return (
          <Button
            variant="contained"
            color={params.value === 1 ? "success" : "error"}
            onClick={() =>
              handleToggleStatus(params.row.dept_id, params.value === 1 ? 0 : 1)
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
          <Box sx={{ width: "100%", maxWidth: 360 }}>
            <Tooltip title="Edit">
            <EditIcon
              color="warning"
              onClick={() => handleEdit(rowData.dept_id)}
              style={{ marginLeft: "10px" }}
            />
            </Tooltip>
            <Tooltip title="Delete">
            <DeleteIcon
              color="error"
              onClick={() => handleDelete(rowData.dept_id)}
              style={{ marginLeft: "10px" }}
            />
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const readDepartment = () => {
    axios
      .get(`http://localhost:8081/api/department/getDepartment`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(
            res.data.Result.map((dept, index) => ({
              ...dept,
              srNo: index + 1,
            }))
          );
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleToggleStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8081/api/department/toggleStatus/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          readDepartment();
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readDepartment();
  }, []);
  return (
    <Box m="20px">
      <Header
        title="Department List"
        subtitle="List of Department for Reference"
      />
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
          onClick={() => setModal(true)}
          variant="contained"
          color="success"
          size="small"
        >
          + Add Department
        </Button>
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.dept_id}
        />
      </Box>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirm={confirmDelete}
      />
      <Add_Department
        modal={modal}
        toggle={() => setModal(!modal)}
        readData={readDepartment}
        editData = {editData}
      />
    </Box>
  );
};

export default List_Department;
