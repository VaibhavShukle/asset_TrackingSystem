import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Button,
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

function MaintenanceByAssetTag() {
  const [data, setData] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);

  const readAsset = () => {
    axios
      .get(`http://localhost:8081/api/maintenance/getMaintenanceAsset`)
      .then((res) => {
        if (res.data.Status === "Success") {
          const assets = res.data.Result;
          setData(assets);
          calculateTotals(assets);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const calculateTotals = (assets) => {
    const totalAssetCount = assets.length;

    setTotalAssets(totalAssetCount);
  };

  useEffect(() => {
    readAsset();
  }, []);

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
              <Typography>Maintenance Schedule by Asset Tag</Typography>
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
            Maintenance Report
          </Typography>
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
                    Schedule Date
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Maintenance By
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Maintenance Status
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      backgroundColor: "#fcf8e3",
                      fontSize: "14px",
                    }}
                  >
                    Completion Date
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
                      {data.asset_name}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {moment(data.main_date).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.main_title}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.main_by}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {data.mainStatus_name}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                    >
                      {moment(data.main_complete).format("DD/MM/YYYY")}
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

export default MaintenanceByAssetTag;
