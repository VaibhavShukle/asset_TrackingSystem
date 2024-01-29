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
import Add_Vendor from "./Add_Vendor";

const List_Vendor = () => {
  const [data, setData] = useState([]);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState({
      v_name: "",
      v_phone: "",
      v_address: "",
      v_details: "",
  })



  const handleEdit=(id)=>{
    axios.get(
      `http://localhost:8081/api/vendor/getVendor/${id}`
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
    setSelectedVendorId(id);
    setConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedVendorId) {
      axios
        .delete(`http://localhost:8081/api/vendor/delete/${selectedVendorId}`)
        .then((res) => {
          if (res.data.Status === "Success") {
            readVendor();
            toast("vendor Delete Successfull.", {
              type: "success",
              autoClose: 1500,
              theme: "dark",
            });
          } else {
            console.error("Error deleting vendor");
          }
        })
        .catch((err) => {
          console.error("Error deleting vendor:", err);
        });
    }
    setConfirmationModalOpen(false);
  };

  const columns = [
    { field: "srNo", headerName: "Sr. No", flex: 0.5 },
    { field: "v_id", headerName: "Vendor ID" },
    {
      field: "v_name",
      headerName: "Name Of Vendor",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "v_phone",
      headerName: "Phone No. Of Vendor",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "v_address",
      headerName: "Address Of Vendor",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "v_details",
      headerName: "Details Of Vendor",
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
              handleToggleStatus(params.row.v_id, params.value === 1 ? 0 : 1)
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
              onClick={() => handleEdit(rowData.v_id)}
              style={{ marginLeft: "10px" }}
            />
            </Tooltip>
            <Tooltip title="Delete">
            <DeleteIcon
              color="error"
              onClick={() => handleDelete(rowData.v_id)}
              style={{ marginLeft: "10px" }}
            />
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const readVendor = () => {
    axios
      .get("http://localhost:8081/api/vendor/getvendor")
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(
            res.data.Result.map((vendor, index) => ({
              ...vendor,
              srNo: index + 1,
            }))
          );
        } else {
          console.error("Error fetching vendor data");
        }
      })
      .catch((err) => {
        console.error("Error fetching vendor data:", err);
      });
  };

  const handleToggleStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8081/api/vendor/toggleStatus/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          readVendor();
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    readVendor();
  }, []);

  return (
    <Box m="20px">
      <Header title="Vendor List" subtitle="List of Vendor for Reference" />
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
          + Add Vendor
        </Button>
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.v_id}
        />
      </Box>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirm={confirmDelete}
      />
      <Add_Vendor
        modal={modal}
        toggle={() => setModal(!modal)}
        readData={readVendor}
        editData = {editData}
      />
    </Box>
  );
};

export default List_Vendor;
