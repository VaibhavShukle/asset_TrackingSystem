import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Label } from "reactstrap";

const Checkout = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [userOptions, setUserOptions] = useState([]);
  const [checkoutDate, setCheckoutDate] = useState("");
  const [user, setUser] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
    { field: "asset_id", headerName: "Asset ID" },
    {
      field: "asset_name",
      headerName: "Asset Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "u_name",
      headerName: "Assign to",
      flex: 1,
    },
    {
      field: "condition",
      headerName: "Asset Condition",
      flex: 1,
      valueGetter: (params) => params.row.condition.condition,
    },
    {
      field: "location_name",
      headerName: "Location",
      flex: 1,
      valueGetter: (params) => params.row.location_name.location_name,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => {
        const statusText = params.value === 1 ? "Available" : "Unavailable";
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
  ];

  const getAsset = () => {
    axios
      .get(`http://localhost:8081/api/asset/getAsset/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData([res.data.Result]);
        }
      })
      .catch((err) => console.log(err));
  };

  const getUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/user/getuser"
      );
      if (response.data.Result) {
        const options = response.data.Result.map((asset) => ({
          value: asset.u_id,
          label: asset.u_name,
        }));

        setUserOptions(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleToggleStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8081/api/asset/toggleStatus/${id}`, {
        status: newStatus, // Change "Status" to "status"
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          readAsset();
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assetId = data[0]?.asset_id;

    const selectedUserId = user;

    const assignDate = new Date(checkoutDate).toISOString();

    try {
      const response = await axios.post(
        "http://localhost:8081/api/checkout/add_checkout",
        {
          user_id: selectedUserId,
          asset_id: assetId,
          assign_date: assignDate,
        }
      );

      if (response.data === "AssetAssign added successfully.") {
        navigate("/assets");
        toast("Asset CheckOut Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
      } else {
        setError(res.data.Error);
        toast("Something Went Wrong.", {
          type: "error",
          autoClose: 1500,
          theme: "dark",
        });
        console.error("Submission failed:", response.data);
      }
    } catch (error) {
      toast("An error occurred. Please try again.", {
        type: "error",
        autoClose: 1500,
        theme: "dark",
      });
      console.error("Error submitting form:", error.message);
    }
  };

  useEffect(() => {
    getAsset();
    getUser();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().slice(0, 5);
    setCheckoutDate(`${formattedDate}T${formattedTime}`);
  }, []);

  return (
    <>
      <Box m="20px">
        <Header title="Assign Asset" subtitle="List of Assets for Reference" />
        <Box
          m="40px 0 0 0"
          height="26vh"
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
            getRowId={(row) => row.asset_id}
            columns={columns}
            components={{ Toolbar: GridToolbar, Pagination: false }}
          />
        </Box>
      </Box>
      <Box m="20px">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Label>Checkout Date</Label>
              <TextField
                fullWidth
                type="datetime-local"
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Label>User Name</Label>
              <FormControl fullWidth>
                <Select
                  id="user-dropdown"
                  value={user}
                  label="Select a User"
                  onChange={(e) => {
                    setUser(e.target.value);
                  }}
                >
                  {userOptions.map((option, index) => {
                    return (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            sx={{ margin: "10px" }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
};

export default Checkout;
