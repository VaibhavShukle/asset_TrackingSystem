import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../confirmationModel/Confirmation_Modal";
import {Box,Button,Tooltip} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Add_User from "./Add_User";

const List_User = () => {
  const [data, setData] = useState([]);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  // const [location, setLocation] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState({
      u_name: "",
      u_empid: "",
      u_phone: "",
      u_email: "",
})


  const handleView=(id)=>{
    navigate("/assetInfo/"+id)
  }

  const handleEdit=(id)=>{
    axios.get(
      `http://localhost:8081/api/user/getUSer/${id}`
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

  const navigate = useNavigate();


  const handleDelete = (id) => {
    setSelectedUserId(id);
    setConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId) {
      axios
        .delete(`http://localhost:8081/api/user/delete/${selectedUserId}`)
        .then((res) => {
          if (res.data.Status === "Success") {
            readUser();
            toast("User Delete Successfull.", {
              type: "success",
              autoClose: 1500,
              theme: "dark",
            });
          } else {
            console.error("Error deleting user");
          }
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
        });
    }
    setConfirmationModalOpen(false);
  };

  const columns = [
    { field: "srNo", headerName: "Sr. No", flex: 0.5 },
    { field: "u_id", headerName: "User ID" },
    {
      field: "u_name",
      headerName: "Name Of User",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "u_empid",
      headerName: "Emp ID Of User",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "u_phone",
      headerName: "Phone No. Of User",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "u_email",
      headerName: "Email Of User",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "locationName",
      headerName: "Name Of Location",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "departmentName",
      headerName: "Name Of Department",
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
              handleToggleStatus(params.row.u_id, params.value === 1 ? 0 : 1)
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
            <Tooltip title="Assign Asset Info">
            <InfoIcon
            style={{color: "#1769aa", marginLeft: "10px"}}
            onClick={() => handleView(rowData.u_id)}
            />
            </Tooltip>
            <Tooltip title="Edit">
            <EditIcon
              style={{ color: "#ff9800", marginLeft: "10px" }}
              onClick={() => handleEdit(rowData.u_id)}
            />
            </Tooltip>
            <Tooltip title="Delete">
            <DeleteIcon
              color="error"
              onClick={() => handleDelete(rowData.u_id)}
              style={{ marginLeft: "10px" }}
            />
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const readUser = () => {
    axios
      .get("http://localhost:8081/api/user/getuser")
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(
            res.data.Result.map((user, index) => ({
              ...user,
              srNo: index + 1,
            }))
          );
        } else {
          console.error("Error fetching user data");
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  };
  const handleToggleStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8081/api/user/toggleStatus/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          readUser();
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readUser();
  }, []);

  return (
    <Box m="20px">
      <Header title="Users List" subtitle="List of Users for Reference" />
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
          + Add User
        </Button>
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.u_id}
        />
      </Box>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirm={confirmDelete}
      />
      <Add_User
        modal={modal}
        toggle={() => setModal(!modal)}
        readData={readUser}
        editData = {editData}
      />
    </Box>
  );
};

export default List_User;
