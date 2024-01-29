import axios from "axios";
import React, { useState, useEffect } from "react";
import { Box, Button, Chip, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../confirmationModel/Confirmation_Modal";

const Asset = () => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleEdit = (id) => {
    navigate("/editAsset/" + id);
  };

  const navigate = useNavigate();

  const handleView = (id) => {
    navigate("/viewAsset/" + id);
  };

  const handleDelete = (id) => {
    setSelectedAssetId(id);
    setConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAssetId) {
      axios
        .delete(`http://localhost:8081/api/asset/delete/${selectedAssetId}`)
        .then((res) => {
          if (res.data.Status === "Success") {
            readAsset();
            toast("Asset Delete Successful.", {
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
      setConfirmationModalOpen(false);
    }
  };

  const columns = [
    { field: "asset_id", headerName: "Asset ID" },
    {
      field: "asset_name",
      headerName: "Asset Name",
      flex: 0.6,
      cellClassName: "name-column--cell",
    },
    {
      field: "category_name",
      headerName: "Asset Category",
      flex: 0.6,
    },
    {
      field: "subcategory_name",
      headerName: "Asset Sub Category",
      flex: 0.6,
    },
    {
      field: "condition",
      headerName: "Asset Candition",
      flex: 0.6,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => {
        const statusText = params.value === 1 ? "Available" : "Unavailable";
        return (
          <Chip
            variant="contained"
            label={statusText}
            color={params.value === 1 ? "success" : "error"}
          >
            {statusText}
          </Chip>
        );
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        const rowData = params.row;
        return (
          <Box sx={{ width: "100%", maxWidth: 360 }}>
            <Tooltip title="View">
              <VisibilityIcon onClick={() => handleView(rowData.id)} />
            </Tooltip>
            <Tooltip title="Edit">
              <EditIcon
                style={{ color: "#ff9800", marginLeft: "10px" }}
                onClick={() => handleEdit(rowData.id)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <DeleteIcon
                color="error"
                onClick={() => handleDelete(rowData.id)}
                style={{ marginLeft: "10px" }}
              />
            </Tooltip>
            {rowData.status === 1 ? (
              <Tooltip title="Assign Asset">
                <PersonAddAlt1Icon
                  onClick={() => navigate("/checkout/" + rowData.asset_id)}
                  style={{ color: "green", marginLeft: "10px" }}
                />
              </Tooltip>
            ) : null}
            {rowData.status === 0 ? (
              <Tooltip title="Checkin">
                <PersonRemoveAlt1Icon
                  onClick={() => navigate("/checkin/" + rowData.asset_id)}
                  style={{ color: "red", marginLeft: "10px" }}
                />
              </Tooltip>
            ) : null}
          </Box>
        );
      },
    },
  ];

  const readAsset = () => {
    axios
      .get(
        `http://localhost:8081/api/asset/getAssetCount?page=${paginationModel.page}&limit=${paginationModel.pageSize}`
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
          setTotalPages(res.data.TotalCount);
        } else {
          console.log("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readAsset();
  }, [paginationModel]);
  return (
    <Box m="20px">
      <Header title="Assets List" subtitle="List of Assets for Reference" />
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
          onClick={() => navigate("/addAsset")}
          variant="contained"
          color="success"
          size="small"
        >
          + Add Asset
        </Button>
        <DataGrid
          rows={data}
          columns={columns}
          rowCount={totalPages}
          components={{ Toolbar: GridToolbar }}
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
        />
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
          onConfirm={confirmDelete}
        />
      </Box>
    </Box>
  );
};

export default Asset;
