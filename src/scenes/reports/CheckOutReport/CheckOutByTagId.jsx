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

function CheckOutByTagId() {
  const [data, setData] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("Current Status");

  const readCheckOutAsset = () => {
    axios
      .get(`http://localhost:8081/api/checkout/getCheckOutAsset`)
      .then((res) => {
        if (res.data.Status === "Success") {
          const assets = res.data.Result;
          setData(assets);
          calculateTotals(assets);
        }
      })
      .catch((err) => console.log(err));
  };

  const calculateTotals = (assets) => {
    const totalAssetCount = assets.length;

    setTotalAssets(totalAssetCount);
  };

  useEffect(() => {
    readCheckOutAsset();
  }, []);

  const handleStatusChange = (event) => {
    const selectedValue = event.target.value;

    const statusParam =
      selectedValue === "All Time" ? "All Time" : "Current Status";

    setSelectedStatus(selectedValue);

    axios
      .get(
        `http://localhost:8081/api/checkout/getCheckOutAsset?status=${statusParam}`
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          const assets = res.data.Result;
          setData(assets);
          calculateTotals(assets);
        }
      })
      .catch((err) => console.log(err));
  };

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
              <Typography>Check-Out by Asset Tag</Typography>
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
          <Typography
            variant="h5"
            gutterBottom
            style={{
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Check-Out Report
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "15px",
            }}
          >
            <Typography style={{ marginTop: "5px" }}>Report Type :</Typography>

            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              displayEmpty
              inputProps={{ "aria-label": "Select Status" }}
              style={{ marginLeft: "20px", height: "30px" }}
            >
              <MenuItem value="Current Status">Current Status</MenuItem>
              <MenuItem value="All Time">All Time</MenuItem>
            </Select>
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
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Check Out Date
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Return Date
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Assign To
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((data) => (
                  <TableRow style={{ border: "1px solid #EBEDF3" }}>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.asset_id}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.assetName && data.assetName.asset_name}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {moment(data.assign_date).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {moment(data.return_date).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.u_name && data.u_name.u_name}
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
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Box>
      </div>
    </>
  );
}

export default CheckOutByTagId;
