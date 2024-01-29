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
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function AssetByCategory() {
  const [data, setData] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [assetBrand, setAssetBrand] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 10,
    rowCount: 10,
  });

  const getAsset = async () => {
    await axios
      .get(
        `http://localhost:8081/api/category/getAssetByCategory?page=${paginationModel.page}&limit=${paginationModel.pageSize}`,
        {
          params: {
            category: selectedCategory,
          },
        }
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
          setTotalPages(res.data.totalPages);
          console.log(assets);
        }
      })
      .catch((err) => console.log(err));
  };

  const getCategory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/category/getcategory/`
      );
      if (response.data.Status === "Success") {
        const options = response.data.Result.map((category) => ({
          value: category.category_id,
          label: category.category_name,
        }));
        setCategoryOptions(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const readAssetBrand = async () => {
    let ABid = data?.asset_brand;
    await axios
      .get(`http://localhost:8081/api/assetBrand/getAssetBrand/${ABid}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setAssetBrand(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };
  console.log(data);

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
    getCategory();
    readAssetBrand();
  }, [selectedCategory, paginationModel.page, paginationModel.pageSize]);

  const generatePDF = () => {
    const element = document.getElementById("pdf-content");
    html2pdf(element);
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
          id="pdf-content"
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
              <Typography>Assets by Category</Typography>
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
              <Typography style={{ marginTop: "5px" }}>Category :</Typography>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Select Category" }}
                style={{ marginLeft: "10px", height: "30px", width: "130px" }}
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categoryOptions.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
              <div
                style={{
                  display: "flex",
                  marginLeft: "73%",
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
                    Brand
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
                      {data?.asset_brand}
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
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
            <Typography style={{ marginLeft: "10px", marginTop: "5px" }}>
              Assets
            </Typography>
          </div>
        </Box>
      </div>
    </>
  );
}

export default AssetByCategory;
