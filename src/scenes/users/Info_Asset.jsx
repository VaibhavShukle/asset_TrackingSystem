import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import moment from "moment";

const Info_Asset = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    // { field: "srNo", headerName: "Sr. No", flex: 0.5 },
    { field: "asset_id", headerName: "Asset ID" },

    {
      field: "asset_name",
      headerName: "Name Of Asset",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => params.row.assetName.asset_name,
    },
    // {
    //   field: "product_condition",
    //   headerName: "Asset Condition",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    //   valueGetter: (params) => params.row.condition.condition,
    // },
    {
      field: "assign_date",
      headerName: "Asset Assign Date",
      flex: 1,
      cellClassName: "name-column--cell",
      valueFormatter: (params) =>
        moment(params.value).format("DD/MM/YYYY - HH:mm a "),
    },
    {
      field: "return_date",
      headerName: "Asset Return Date",
      flex: 1,
      cellClassName: "name-column--cell",
      valueFormatter: (params) =>
        moment(params.value).format("DD/MM/YYYY - HH:mm a"),
    },
  ];

  const getUserAsset = () => {
    axios
      .get(`http://localhost:8081/api/user/getAssets/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(data);

  useEffect(() => {
    getUserAsset();
  }, []);

  return (
    <Box m="20px">
      <Header
        title="Users Assign Asset List"
        subtitle="List of Users for Reference"
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
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.userAssign_id}
        />
      </Box>
    </Box>
  );
};

export default Info_Asset;
