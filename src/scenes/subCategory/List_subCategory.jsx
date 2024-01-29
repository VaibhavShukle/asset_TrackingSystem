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
import Add_SubCategory from "./Add_subCategory";

const List_subCategory = () => {
  const [data, setData] = useState([]);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedsubCategoryId, setSelectedsubCategoryId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState({
    subcategory_name: "",
    selectedCategory: "",
    selectedCategoryId: "",
  })


  const handleEdit=(id)=>{
    axios.get(
      `http://localhost:8081/api/subcategory/getSubcategory/${id}`
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
    setSelectedsubCategoryId(id);
    setConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedsubCategoryId) {
      axios
        .delete(
          `http://localhost:8081/api/subcategory/delete/${selectedsubCategoryId}`
        )
        .then((res) => {
          if (res.data.Status === "Success") {
            readsubCategory();
            toast("Category Delete Successfull.", {
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
    { field: "subcategory_id", headerName: "Sub Category ID" },
    {
      field: "subcategory_name",
      headerName: "Name Of Sub Category",
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
              handleToggleStatus(
                params.row.subcategory_id,
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
              onClick={() => handleEdit(rowData.subcategory_id)}
              style={{ marginLeft: "10px" }}
            />
            </Tooltip>
            <Tooltip title="Delete">
            <DeleteIcon
              color="error"
              onClick={() => handleDelete(rowData.subcategory_id)}
              style={{ marginLeft: "10px" }}
            />
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const readsubCategory = () => {
    axios
      .get(`http://localhost:8081/api/subcategory/getsubcategory`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(
            res.data.Result.map((subCategory, index) => ({
              ...subCategory,
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
      .put(`http://localhost:8081/api/subcategory/toggleStatus/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          readsubCategory();
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readsubCategory();
  }, []);
  return (
    <Box m="20px">
      <Header
        title="Sub Category List"
        subtitle="List of Sub Category for Reference"
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
          + Add Sub Category
        </Button>
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.subcategory_id}
        />
      </Box>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirm={confirmDelete}
      />
      <Add_SubCategory
        modal={modal}
        toggle={() => setModal(!modal)}
        editData = {editData}
        readData={readsubCategory}
      />
    </Box>
  );
};

export default List_subCategory;
