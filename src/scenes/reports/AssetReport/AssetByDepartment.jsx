import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import moment from "moment";
import html2pdf from "html2pdf.js";

function AssetByDepartment() {
  const [data, setData] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);

  const getAsset = async () => {
    await axios
      .get(`http://localhost:8081/api/department/getAssetByDept`, {
        params: {
          department: selectedDepartment,
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          const assets = res.data.Result;
          setData(assets);
          calculateTotals(assets);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDepartment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/department/getdepartment/`
      );
      if (response.data.Status === "Success") {
        const options = response.data.Result.map((department) => ({
          value: department.dept_id,
          label: department.dept_name,
        }));
        setDepartmentOptions(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const calculateTotals = (assets) => {
    const totalAssetCount = assets.length;
    const totalAssetCost = assets.reduce(
      (total, asset) => total + parseFloat(asset.asset_Cost),
      0
    );

    setTotalAssets(totalAssetCount);
    setTotalCost(totalAssetCost);
  };

  useEffect(() => {
    getAsset();
    getDepartment();
  }, [selectedDepartment]);

  const generatePDF = () => {
    const element = document.getElementById("pdf-content");
    html2pdf(element);
  };

  return (
    <>
      <div id="pdf-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginX: "50px",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <DescriptionOutlinedIcon
              style={{
                fontSize: "25",
                color: "brown",
                marginRight: "5px",
              }}
            />
            <Typography
              variant="h5"
              gutterBottom
              style={{
                fontSize: 25,
                marginTop: "20px",
                marginBottom: "20px",
                marginRight: "5px",
              }}
            >
              Report
            </Typography>
            <div style={{ marginRight: "300px", marginTop: "10px" }}>
              <Typography>Assets by Department</Typography>
            </div>
            <Button
              variant="contained"
              color="success"
              onClick={generatePDF}
              style={{ position: "fixed", marginLeft: "70%" }}
            >
              Export PDF
            </Button>
          </div>
        </div>
        {/* Next Box */}
        <Box
          sx={{
            flexGrow: 1,
            marginX: "30px",
            backgroundColor: "white",
            p: 2,
            pb: 3,
            mb: 2,
          }}
        >
          <div>
            <Typography
              variant="h5"
              gutterBottom
              style={{
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Asset Report
            </Typography>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "15px",
              }}
            >
              <Typography style={{ marginTop: "5px" }}>Department :</Typography>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Select Department" }}
                style={{ marginLeft: "10px", height: "30px", width: "130px" }}
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>
                {departmentOptions.map((department) => (
                  <MenuItem key={department.value} value={department.value}>
                    {department.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <Grid item xs={3} style={{ marginBottom: "10px" }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              style={{ border: "1px solid #EBEDF3" }}
              size="small"
            >
              <TableHead className="tableHead" key={"tableHead"}>
                <TableRow style={{ border: "1px solid #EBEDF3" }}>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Asset Tag ID
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Description
                  </TableCell>
                  {/* Add more headers as needed */}
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Serial No.
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Purchase Date
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Purchased from
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Model
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((data) => (
                  <TableRow
                    style={{ border: "1px solid #EBEDF3" }}
                    key={data.asset_id}
                  >
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.asset_id}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.asset_name}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.asset_serialNumber}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {moment(data.asset_purchaseDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.asset_vendorInfo}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.asset_model}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.asset_Cost}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total row */}
                <TableRow style={{ border: "1px solid #EBEDF3" }}>
                  <TableCell
                    colSpan={1}
                    style={{
                      border: "1px solid #EBEDF3",
                      borderRight: "none",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Total Assets : {totalAssets}
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    style={{
                      border: "1px solid #EBEDF3",
                      textAlign: "right",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Total Cost : ₹ {totalCost}.00
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Box>
      </div>
    </>
  );
}

export default AssetByDepartment;
