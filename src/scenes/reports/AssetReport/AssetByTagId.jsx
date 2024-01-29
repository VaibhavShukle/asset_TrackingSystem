import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  InputLabel,
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
import * as XLSX from "xlsx";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function AssetByTagId() {
  const [data, setData] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 10,
    rowCount: 10,
  });

  const readAsset = () => {
    axios
      .get(
        `http://localhost:8081/api/asset/getAsset?page=${paginationModel.page}&limit=${paginationModel.pageSize}`
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          const assets = res.data.Result;
          setData(assets);
          calculateTotals(assets);
          setPaginationModel((prevModel) => ({
            ...prevModel,
            rowCount: res.data.TotalCount,
          }));
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
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
    readAsset();
  }, [paginationModel.page, paginationModel.pageSize]);

  const generatePDF = () => {
    const element = document.getElementById("pdf-content");
    html2pdf(element);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Asset Tag ID",
        "Description",
        "Purchase Date",
        "Purchased from",
        "Cost",
      ],
      ...data.map((asset) => [
        asset.asset_id,
        asset.asset_name,
        moment(asset.asset_purchaseDate).format("DD/MM/YYYY"),
        asset.asset_vendorInfo,
        asset.asset_Cost,
      ]),
      ["Total Assets", "", "", "", totalAssets],
      ["Total Cost", "", "", "", `₹ ${totalCost}.00`],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asset Report");

    // Save the file
    XLSX.writeFile(wb, "asset_report.xlsx");
  };

  const handleNextPage = () => {
    setPaginationModel((prevModel) => ({
      ...prevModel,
      page: prevModel.page + 1,
    }));
  };

  const handlePrevPage = () => {
    setPaginationModel((prevModel) => ({
      ...prevModel,
      page: prevModel.page - 1,
    }));
  };

  const handleChangeRowsPerPage = (event) => {
    const pageSize = parseInt(event.target.value, 10);
    setPaginationModel({
      page: 1,
      pageSize,
      rowCount: paginationModel.rowCount,
    });
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
              <Typography>Assets by Asset Tag</Typography>
            </div>
            <div
              style={{ display: "flex", position: "fixed", marginLeft: "65%" }}
            >
              <InputLabel htmlFor="export-options">Export : </InputLabel>
              <Select
                style={{ height: "30px", width: "120px", marginLeft: "10px" }}
                onChange={(event) => {
                  const selectedOption = event.target.value;
                  if (selectedOption === "pdf") {
                    generatePDF();
                  } else if (selectedOption === "excel") {
                    exportToExcel();
                  }
                }}
              >
                <MenuItem value="">Export Options</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </div>
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
            Asset Report
          </Typography>
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Select
              style={{ height: "30px", width: "80px" }}
              value={paginationModel.pageSize}
              onChange={handleChangeRowsPerPage}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={50}>100</MenuItem>
              <MenuItem value={50}>250</MenuItem>
            </Select>
            <Typography style={{ marginLeft: "10px" }}>Assets</Typography>
            <div
              style={{
                display: "flex",
                marginLeft: "79%",
                height: "28px",
                width: "28px",
              }}
            >
              <div>
                <button
                  style={{ height: "30px", width: "30px" }}
                  onClick={handlePrevPage}
                  disabled={paginationModel.page === 1}
                >
                  <KeyboardArrowLeftIcon />
                </button>
              </div>
              <div style={{ marginLeft: "10px" }}>
                <button
                  style={{
                    height: "30px",
                    width: "30px",
                    backgroundColor: "#ffbe07",
                    border: "none",
                    borderRadius: "3px",
                  }}
                >
                  {paginationModel.page}
                </button>
              </div>
              <div>
                <button
                  onClick={handleNextPage}
                  disabled={
                    paginationModel.page * paginationModel.pageSize >=
                    paginationModel.rowCount
                  }
                  style={{
                    marginLeft: "10px",
                    height: "30px",
                    width: "30px",
                  }}
                >
                  <KeyboardArrowRightIcon />
                </button>
              </div>
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
                    Cost
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
                    colSpan={4}
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

export default AssetByTagId;
