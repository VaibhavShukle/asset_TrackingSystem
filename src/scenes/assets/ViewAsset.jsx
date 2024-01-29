import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  Backdrop,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import { baseUrl } from "../..";
import Document from "../Document/Document";
import Warranty from "../Warranty/Warranty";
import Maintenance from "../Maintenance/Maintenance";
import Photos from "../Photos/Photos";
import History from "../History/History";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Depreciation from "../Depreciation/depreciation";
// import Barcode from "react-barcode";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ViewAsset() {
  const { id } = useParams();
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [assetBrand, setAssetBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [checkoutData, setCheckoutData] = useState("");
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [data, setData] = useState({
    asset_id: null,
    asset_name: "",
    asset_brand: "",
    asset_model: "",
    asset_location: "",
    asset_department: "",
    asset_category: "",
    asset_purchaseDate: "",
    asset_Cost: "",
    asset_owner: "",
    asset_vendorInfo: "",
    asset_serialNumber: "",
    asset_condition: "",
    asset_subcategory: "",
    asset_image: "",
    depreciation_cost: "",
    asset_life: "",
    depreciation_Type: "",
    salvageValue: "",
    date_acquired: "",
  });

  const readAsset = async () => {
    handleOpen();
    await axios
      .get(`http://localhost:8081/api/asset/get/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result[0]);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => handleClose());
  };

  const readLocation = async () => {
    let Lid = data?.asset_location;
    await axios
      .get(`http://localhost:8081/api/location/getLocation/${Lid}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setLocation(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };

  const readDepartment = async () => {
    let Did = data?.asset_department;
    await axios
      .get(`http://localhost:8081/api/department/getDepartment/${Did}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setDepartment(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
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

  const readCategory = async () => {
    let Cid = data?.asset_category;
    await axios
      .get(`http://localhost:8081/api/category/getCategory/${Cid}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setCategory(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };

  const readSubCategory = async () => {
    let Scid = data?.asset_subcategory;
    await axios
      .get(`http://localhost:8081/api/subcategory/getSubcategory/${Scid}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setSubCategory(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };

  const readCheckoutData = async () => {
    await axios
      .get(`http://localhost:8081/api/checkout/getCheckout/${data.asset_id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.Status === "Success") {
          setCheckoutData(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readAsset();
  }, [id]);

  useEffect(() => {
    readLocation();
    readCategory();
    readAssetBrand();
    readSubCategory();
    readDepartment();
    readCheckoutData();
  }, [data?.asset_id]);

  const renderCell = (status) => {
    const isAvailable = status === 1;
    const statusText = isAvailable ? "Available" : "Checked out";
    const backgroundColor = isAvailable ? "#dff0d8" : "#d9edf7";

    return (
      <div
        style={{
          backgroundColor,
          padding: "5px 10px",
          borderRadius: "4px",
          color: isAvailable ? "#4CAF50" : "#f44336",
        }}
      >
        {statusText}
      </div>
    );
  };
  console.log(baseUrl + "/public/images" + data.asset_image);

  return (
    <>
      {open ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
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
              <ExtensionOutlinedIcon
                style={{
                  marginBottom: "10px",
                  fontSize: "25",
                  color: "brown",
                  marginRight: "10px",
                }}
              />
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  fontSize: 25,
                  marginTop: "20px",
                  marginBottom: "20px",
                  marginRight: "40px",
                }}
              >
                Asset View
              </Typography>
            </div>
            {/* <Button
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "5px",
            marginBottom: "10px",
          }}
          variant="outlined"
        >
          Next
          <KeyboardArrowRightIcon />
        </Button> */}
          </div>
          <Box
            sx={{
              flexGrow: 1,
              marginX: "30px",
              marginTop: "1%",
              marginBottom: 2,
              backgroundColor: "white",
            }}
          >
            <Grid container spacing={3} p={3}>
              {/* Image Section */}
              <Grid item xs lg={3}>
                <Box
                  sx={{
                    height: "250px",
                    border: "1px solid #EBEDF3",
                    marginBottom: 0,
                    marginLeft: "10px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={baseUrl + "/" + data.asset_image}
                    alt="ImgBox"
                    style={{
                      objectFit: "contain",
                    }}
                    height={"100%"}
                  />
                </Box>
                <Typography style={{ marginLeft: "40px", marginTop: "5px" }}>
                  Asset Name : <b>{data.asset_name}</b>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Table style={{ border: "1px solid #EBEDF3" }} size="small">
                  <TableBody>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Asset Tag ID
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>{data.asset_id}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Purchase Date
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>
                          {moment(data.asset_purchaseDate).format("DD/MM/YYYY")}
                        </b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Cost
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>₹ {data.asset_Cost}.00</b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Brand
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>{assetBrand?.brand_name}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Model
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>{data.asset_model}</b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {/* <div style={{ marginTop: "20px", width: "100%" }}>
              <Table>
                <TableRow>
                  <TableCell
                    style={{
                      border: "1px solid #EBEDF3",
                      fontSize: "14px",
                    }}
                  >
                    <Barcode value={data.asset_id} />
                  </TableCell>
                </TableRow>
              </Table>
            </div> */}
              </Grid>
              <Grid item xs>
                <Table style={{ border: "1px solid #EBEDF3" }} size="small">
                  <TableBody>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Location
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>{location?.location_name}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Category
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>{category?.category_name}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Sub Category
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>{subcategory?.subcategory_name}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Department
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>{department?.dept_name}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Assigned to
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        <b>{checkoutData?.u_name?.u_name || "N/A"}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ border: "1px solid #EBEDF3" }}>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #EBEDF3",
                          fontSize: "14px",
                        }}
                      >
                        {renderCell(data?.status)}{" "}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Box>
          {/* Next Box */}
          <Box
            sx={{
              flexGrow: 1,
              marginX: "30px",
              // marginTop: "10px  ",
              backgroundColor: "white",
              p: 2,
              pb: 3,
              mb: 2,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              centered
              indicatorColor="secondary"
              textColor="secondary"
              sx={{ marginBottom: "10px" }}
            >
              <Tab
                label="Details"
                {...a11yProps(0)}
                sx={{ marginRight: "50px" }}
              />
              <Tab
                label="Photos"
                {...a11yProps(1)}
                sx={{ marginRight: "50px" }}
              />
              <Tab
                label="Docs"
                {...a11yProps(2)}
                sx={{ marginRight: "50px" }}
              />
              <Tab
                label="Depreciation"
                {...a11yProps(3)}
                sx={{ marginRight: "50px" }}
              />
              <Tab
                label="Warranty"
                {...a11yProps(4)}
                sx={{ marginRight: "50px" }}
              />
              <Tab
                label="Maintenance"
                {...a11yProps(5)}
                sx={{ marginRight: "50px" }}
              />
              <Tab
                label="History"
                {...a11yProps(6)}
                sx={{ marginRight: "50px" }}
              />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <Divider sx={{ marginY: "15px", marginTop: "10px" }} />
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                Asset Details
              </Typography>
              <Grid
                container
                spacing={3}
                pb={2}
                px={2}
                flex={1}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <label htmlFor="" style={{ marginTop: "20px" }}>
                  Miscellaneous
                </label>
                <Grid item xs={5}>
                  <Table style={{ border: "1px solid #EBEDF3" }} size="small">
                    <TableBody>
                      <TableRow style={{ border: "1px solid #EBEDF3" }}>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          Serial No
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          <b>{data.asset_serialNumber}</b>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={5}>
                  <Table style={{ border: "1px solid #EBEDF3" }} size="small">
                    <TableBody>
                      <TableRow style={{ border: "1px solid #EBEDF3" }}>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          Purchased from
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          <b>{data.asset_vendorInfo}</b>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              {/* Next Grid */}
              <Grid
                container
                spacing={3}
                p={2}
                flex={1}
                justifyContent={"center"}
                alignItems={"start"}
              >
                <label htmlFor="" style={{ marginTop: "20px" }}>
                  Depreciation
                </label>
                <Grid item xs={5}>
                  <Table style={{ border: "1px solid #EBEDF3" }} size="small">
                    <TableBody>
                      <TableRow style={{ border: "1px solid #EBEDF3" }}>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          Depreciable Percentage
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          <b>{data.depreciation_percentage}%</b>
                        </TableCell>
                      </TableRow>
                      <TableRow style={{ border: "1px solid #EBEDF3" }}>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          Date Acquired
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          <b>
                            {moment(data.date_acquired).format("DD/MM/YYYY")}
                          </b>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={5}>
                  <Table style={{ border: "1px solid #EBEDF3" }} size="small">
                    <TableBody>
                      <TableRow style={{ border: "1px solid #EBEDF3" }}>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          Asset Life (Year)
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          <b>{data.asset_life} year</b>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              {/* Next Grid */}
              <Grid
                container
                spacing={3}
                p={2}
                flex={1}
                justifyContent={"center"}
                alignItems={"start"}
              >
                <label htmlFor="" style={{ marginTop: "20px" }}>
                  Assign Asset
                </label>
                <Grid item xs={5}>
                  <Table style={{ border: "1px solid #EBEDF3" }} size="small">
                    <TableBody>
                      <TableRow style={{ border: "1px solid #EBEDF3" }}>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          Assigned to
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          {/* <b>{checkoutData?.[0]?.u_name?.u_name}</b> */}
                          <b>{checkoutData?.u_name?.u_name || "N/A"}</b>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={5}>
                  <Table style={{ border: "1px solid #EBEDF3" }} size="small">
                    <TableBody>
                      <TableRow style={{ border: "1px solid #EBEDF3" }}>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          Assign Date
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #EBEDF3",
                            fontSize: "14px",
                          }}
                        >
                          <b>
                            {checkoutData?.[0]?.assign_date
                              ? moment(checkoutData[0].assign_date).format(
                                  "DD/MM/YYYY"
                                )
                              : "N/A"}
                          </b>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Divider />
              <Photos />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Divider />
              <Document />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <Divider />
              <Depreciation asset_id={data.asset_id} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <Divider />
              <Warranty />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
              <Divider />
              <Maintenance />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={6}>
              <Divider />
              <History />
            </CustomTabPanel>
          </Box>
        </>
      )}
    </>
  );
}

export default ViewAsset;
