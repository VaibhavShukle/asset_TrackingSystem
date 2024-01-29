import axios from "axios";
import React, { useState, useEffect } from "react";
import Add_Location from "./Add_Location";
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

const List_Location = () => {
  const [data, setData] = useState([]);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState({
    location_name: "",
    location_address: "",
    location_desc: "",
  });

  const handleEdit = (id) => {
    console.log(id);
    axios
      .get(`http://localhost:8081/api/location/getLocation/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setEditData(res.data.Result);
          setModal(!modal);
        }
      });
  };

  const handleDelete = (id) => {
    setSelectedLocationId(id);
    setConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedLocationId) {
      axios
        .delete(
          `http://localhost:8081/api/location/delete/${selectedLocationId}`
        )
        .then((res) => {
          if (res.data.Status === "Success") {
            readLocation();
            toast("Location Delete Successfull.", {
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
    { field: "location_id", headerName: "Location ID" },
    {
      field: "location_name",
      headerName: "Name Of Location",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "location_address",
      headerName: "Address Of Location",
      flex: 1,
    },
    {
      field: "location_desc",
      headerName: "Description Of Location",
      flex: 1,
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
              handleToggleStatus(
                params.row.location_id,
                params.value === 1 ? 0 : 1
              )
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
                onClick={() => handleEdit(rowData.location_id)}
                style={{ marginLeft: "10px" }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <DeleteIcon
                color="error"
                onClick={() => handleDelete(rowData.location_id)}
                style={{ marginLeft: "10px" }}
              />
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const readLocation = () => {
    axios
      .get(`http://localhost:8081/api/location/getLocation`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(
            res.data.Result.map((location, index) => ({
              ...location,
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
      .put(`http://localhost:8081/api/location/toggleStatus/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          readLocation();
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readLocation();
  }, []);
  return (
    <Box m="20px">
      <Header title="Location List" subtitle="List of Location for Reference" />
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
          + Add Location
        </Button>
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.location_id}
        />
      </Box>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirm={confirmDelete}
      />
      <Add_Location
        modal={modal}
        toggle={() => setModal(!modal)}
        readData={readLocation}
        editData={editData}
      />
    </Box>
  );
};

export default List_Location;
