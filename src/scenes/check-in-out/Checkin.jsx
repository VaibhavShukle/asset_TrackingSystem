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

const Checkin = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [condition, setCondition] = useState([]);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [remark, setRemark] = useState([]);
  const [checkinDate, setCheckinDate] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    // { field: "id", headerName: "ID", flex: 0.5 },
    { field: "asset_id", headerName: "Asset ID" },
    {
      field: "asset_name",
      headerName: "Asset Name",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => params.row.assetName.asset_name,
    },
    {
      field: "u_name",
      headerName: "Assign to",
      flex: 1,
      valueGetter: (params) => params.row.u_name.u_name,
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
      .get(`http://localhost:8081/api/checkout/getAsset/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData([res.data.Result]);
        }
      })
      .catch((err) => console.log(err));
  };

  const getCondition = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/condition/getCondition"
      );

      if (response.data.Result) {
        const options = response.data.Result.map((asset) => ({
          value: asset.id,
          label: asset.condition,
        }));

        setConditionOptions(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleToggleStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8081/api/asset/toggleStatus/${id}`, {
        status: newStatus,
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

    const returnDate = new Date(checkinDate).toISOString();
    const selectedConditionId = condition;
    const assetRemark = remark;

    try {
      const response = await axios.post(
        "http://localhost:8081/api/checkout/add_checkin",
        {
          return_date: returnDate,
          condition_id: selectedConditionId,
          remark: assetRemark,
          asset_id: id,
          userAssign_id: data[0].userAssign_id,
        }
      );

      if (response.data.message === "Check-in records updated successfully.") {
        navigate("/assets");
        toast("Asset CheckIn Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
        console.log("Form submitted successfully!");
      } else {
        setError(res.data.Error);
        toast("Something Went Wrong.", {
          type: "error",
          autoClose: 1500,
          theme: "dark",
        });
        console.log("Submission failed:", response.data);
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
    getCondition();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().slice(0, 5);
    setCheckinDate(`${formattedDate}T${formattedTime}`);
  }, []);

  return (
    <>
      <Box m="20px">
        <Header
          title="Check In Asset"
          subtitle="List of Assets for Reference"
        />
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
              <Label>Return Date</Label>
              <TextField
                fullWidth
                type="datetime-local"
                value={checkinDate}
                onChange={(e) => setCheckinDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Label>Asset Condition</Label>
              <FormControl fullWidth>
                <Select
                  id="condition-dropdown"
                  value={condition}
                  label="Select a User"
                  onChange={(e) => {
                    setCondition(e.target.value);
                  }}
                >
                  {conditionOptions.map((option, index) => {
                    return (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Label>Remark</Label>
              <TextField
                fullWidth
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
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

export default Checkin;
