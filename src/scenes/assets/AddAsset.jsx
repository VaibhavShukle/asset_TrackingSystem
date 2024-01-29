import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Label } from "reactstrap";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import usePagination from "@mui/material/usePagination/usePagination";
import Add_Picture from "./Add_Picture";
import PropTypes from "prop-types";
import Add_Location from "../location/Add_Location";
import Add_Department from "../department/Add_Department";
import Add_Category from "../category/Add_Category";
import Add_subCategory from "../subCategory/Add_subCategory";
import Add_Condition from "../condition/Add_Condition";

const AddAsset = () => {
  const { id } = useParams();
  const initialValues = {
    asset_id: id,
    asset_name: "",
    asset_brand: "",
    asset_model: "",
    asset_Cost: "",
    asset_purchaseDate: "",
    asset_vendorInfo: "",
    asset_serialNumber: "",
    asset_owner: "",
    asset_location: "",
    asset_department: "",
    asset_category: "",
    asset_subCategory: "",
    asset_condition: "",
    asset_image: null,
    depreciation_cost: "",
    asset_life: "",
    salvage_value: "",
    depreciation_method: "",
    date_acquired: "",
    depreciableAsset: "select", // Add default value
  };

  const [isDepreciable, setIsDepreciable] = useState(false);
  const [selectedCondition, setConditionCategory] = useState("");
  const [assetImage, setAssetImage] = useState(null);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [value, setValue] = useState(0);
  const [modal, setModal] = useState(false);

  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]); // Add state
  const [conditionOptions, setConditionOptions] = useState([]); // Add state for conditions
  const [subcategoryOptions, setSelectedsubCategoryId] = useState(null);
  const [assetBrandOptions, setAssetBrandOptions] = useState([]);
  const [isAddPhotosModalOpen, setAddPhotosModalOpen] = useState(false);

  const [selectedStockImage, setSelectedStockImage] = useState(null);

  const handleDepreciableChange = (e) => {
    console.log(e.target.value);
    setIsDepreciable(e.target.value);
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...urls]);
      setModal(false);
    }
  };

  const [data, setData] = useState({
    asset_id: "",
    asset_name: "",
    asset_brand: "",
    asset_model: "",
    asset_Cost: "",
    asset_purchaseDate: "",
    asset_vendorInfo: "",
    asset_serialNumber: "",
    asset_owner: "",
    asset_location: "",
    asset_department: "",
    asset_category: "",
    asset_subCategory: "",
    asset_condition: "",
    asset_image: "",
    depreciation_percentage: "",
    asset_life: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    // event.preventDefault();
    const assetFormData = new FormData();
    assetFormData.append("asset_id", data.asset_id);
    assetFormData.append("asset_name", data.asset_name);
    assetFormData.append("asset_brand", data.asset_brand);
    assetFormData.append("asset_model", data.asset_model);
    assetFormData.append("asset_Cost", data.asset_Cost);
    assetFormData.append("asset_purchaseDate", data.asset_purchaseDate);
    assetFormData.append("asset_vendorInfo", data.asset_vendorInfo);
    assetFormData.append("asset_serialNumber", data.asset_serialNumber);
    assetFormData.append("asset_owner", data.asset_owner);
    assetFormData.append("asset_location", data.asset_location);
    assetFormData.append("asset_department", data.asset_department);
    assetFormData.append("asset_category", selectedCategory);
    assetFormData.append("asset_subCategory", data.asset_subCategory);
    assetFormData.append("asset_condition", data.asset_condition);
    assetFormData.append(
      "depreciation_percentage",
      data.depreciation_percentage
    );
    assetFormData.append("asset_life", data.asset_life);

    if (selectedStockImage) {
      assetFormData.append("asset_image", selectedStockImage);
    }

    // let depreciationId = null;
    // if (isDepreciable) {
    //   const res = await axios.post(
    //     "http://localhost:8081/api/depreciation/add_depreciation",
    //     {
    //       depreciation_percentage: data.depreciation_percentage,
    //       asset_life: data.asset_life,
    //     }
    //   );

    //   depreciationId = res.data.data.depreciation_id;
    // }

    // assetFormData.append("depreciation_id", String(depreciationId));

    const res1 = await axios
      .post("http://localhost:8081/api/asset/add_asset", assetFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        navigate("/assets");
      })
      .catch((assetError) => {
        console.error(assetError);
      });
  };

  const getLocation = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/location/getLocation"
      );
      if (response.data.Status === "Success") {
        const options = response.data.Result.map((location) => ({
          value: location.location_id,
          label: location.location_name,
        }));
        setLocationOptions(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDepartment = () => {
    axios
      .get(`http://localhost:8081/api/department/getDepartment`)
      .then((res) => {
        if (res.data.Status === "Success") {
          const options = res.data.Result.map((department) => ({
            value: department.dept_id,
            label: department.dept_name,
          }));
          setDepartmentOptions(options);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const getCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/category/getcategory"
      );
      if ((response.data.Status = "Success")) {
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

  const getCondition = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/condition/getCondition"
      );
      if ((response.data.Status = "Success")) {
        const options = response.data.Result.map((condition) => ({
          value: condition.id,
          label: condition.condition,
        }));
        setConditionOptions(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getsubCategory = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/subcategory/getSubcategoryName/${id}`
      );
      if ((response.data.Status = "Success")) {
        console.log(response.data.Result);
        const options = response.data.Result.map((item) => ({
          value: item.subcategory_id,
          label: item.subcategory_name,
        }));
        setSelectedsubCategoryId(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAssetBrand = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/assetBrand/getassetBrand"
      );
      if (response.data.Status === "Success") {
        const options = response.data.Result.map((item) => ({
          value: item.brand_id,
          label: item.brand_name,
        }));
        setAssetBrandOptions(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const autoIncrement = () => {
    setData((prevData) => ({
      ...prevData,
      asset_id: parseInt(id) + 1,
    }));
  };

  // const validationSchema = Yup.object().shape({
  //   asset_name: Yup.string().required("Asset Name is required"),
  //   asset_brand: Yup.string().required("Asset Brand is required"),
  //   asset_model: Yup.string().required("Asset Modal is required"),
  //   asset_location: Yup.string().required("Asset Location is required"),
  //   asset_category: Yup.string().required("Asset Category is required"),
  //   asset_subcategory: Yup.string().required("Asset Subcategory is required"),
  //   asset_purchaseDate: Yup.date().required("Asset Purchase date is required"),
  //   asset_Cost: Yup.number().required("Asset Cost is required"),
  //   asset_owner: Yup.string().required("Asset Owner is required"),
  //   asset_currentValue: Yup.number().required("Asset Value is required"),
  //   asset_vendorInfo: Yup.string().required("Asset Vendor info is required"),
  //   asset_serialNumber: Yup.string().required(
  //     "Asset Serial Number is required"
  //   ),
  //   asset_condition: Yup.string().required("Asset Condition is required"),
  //   asset_image: Yup.string().required("Asset Image is required"),
  // });

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

  const handleSelected = (image) => {
    setSelectedStockImage(image);
  };

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  useEffect(() => {
    getLocation();
    getDepartment();
    getCategory();
    getCondition();
    getsubCategory();
    getAssetBrand();
  }, []);

  useEffect(() => {
    autoIncrement();
  }, [id]);

  return (
    <Box m="50px">
      <Header title="Add Asset" subtitle="Asset Details" />
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(3, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
              }}
            >
              {/* <TextField
                fullWidth
                type="text"
                label="Asset ID"
                value={data.asset_id}
                name="asset_id"
                disabled={true}
                sx={{ gridColumn: "span 1" }}
              /> */}
              <TextField
                fullWidth
                type="text"
                label="Asset Name"
                onBlur={handleBlur}
                onChange={(e) =>
                  setData({ ...data, asset_name: e.target.value })
                }
                value={data.asset_name}
                name="asset_name"
                error={!!touched.asset_name && !!errors.asset_name}
                helperText={touched.asset_name && errors.asset_name}
                sx={{ gridColumn: "span 1" }}
              />

              {/* <TextField
                fullWidth
                type="text"
                label="Asset Brand"
                onBlur={handleBlur}
                onChange={(e) =>
                  setData({ ...data, asset_brand: e.target.value })
                }
                value={data.asset_brand}
                name="asset_brand"
                error={!!touched.asset_brand && !!errors.asset_brand}
                helperText={touched.asset_brand && errors.asset_brand}
                sx={{ gridColumn: "span 1" }}
              /> */}

              <TextField
                fullWidth
                type="text"
                label="Asset Model"
                onBlur={handleBlur}
                onChange={(e) =>
                  setData({ ...data, asset_model: e.target.value })
                }
                value={data.asset_model}
                name="asset_model"
                error={!!touched.asset_model && !!errors.asset_model}
                helperText={touched.asset_model && errors.asset_model}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Asset Cost"
                onBlur={handleBlur}
                onChange={(e) =>
                  setData({ ...data, asset_Cost: e.target.value })
                }
                value={data.asset_Cost}
                name="asset_Cost"
                error={!!touched.asset_Cost && !!errors.asset_Cost}
                helperText={touched.asset_Cost && errors.asset_Cost}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                type="date"
                label="Purchase Date"
                onBlur={handleBlur}
                onChange={(e) =>
                  setData({ ...data, asset_purchaseDate: e.target.value })
                }
                value={data.asset_purchaseDate}
                name="asset_purchaseDate"
                error={
                  !!touched.asset_purchaseDate && !!errors.asset_purchaseDate
                }
                helperText={
                  touched.asset_purchaseDate && errors.asset_purchaseDate
                }
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Vendor Info"
                onBlur={handleBlur}
                onChange={(e) =>
                  setData({ ...data, asset_vendorInfo: e.target.value })
                }
                value={data.asset_vendorInfo}
                name="asset_vendorInfo"
                error={!!touched.asset_vendorInfo && !!errors.asset_vendorInfo}
                helperText={touched.asset_vendorInfo && errors.asset_vendorInfo}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Serial Number"
                onBlur={handleBlur}
                onChange={(e) =>
                  setData({ ...data, asset_serialNumber: e.target.value })
                }
                value={data.asset_serialNumber}
                name="asset_serialNumber"
                error={
                  !!touched.asset_serialNumber && !!errors.asset_serialNumber
                }
                helperText={
                  touched.asset_serialNumber && errors.asset_serialNumber
                }
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Asset Owner"
                onBlur={handleBlur}
                onChange={(e) =>
                  setData({ ...data, asset_owner: e.target.value })
                }
                value={data.asset_owner}
                name="asset_owner"
                error={!!touched.asset_owner && !!errors.asset_owner}
                helperText={touched.asset_owner && errors.asset_owner}
                sx={{ gridColumn: "span 1" }}
              />
              <FormControl fullWidth>
                <InputLabel id="asset-brand-dropdown-label">
                  Asset Brand
                </InputLabel>
                <Select
                  labelId="asset-brand-dropdown-label"
                  id="asset-brand-dropdown"
                  value={data.asset_brand}
                  label="Select an Asset Brand"
                  onChange={(e) =>
                    setData({ ...data, asset_brand: e.target.value })
                  }
                >
                  {assetBrandOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box gridColumn={"span 3"}>
                <Divider />
                <Header subtitle="Location , Category, Department And Condition" />
              </Box>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%" }}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel id="location-dropdown-label">
                      Location
                    </InputLabel>
                    <Select
                      labelId="location-dropdown-label"
                      id="location-dropdown"
                      value={data.selectedLocationId}
                      label="Select a Location"
                      onChange={(e) =>
                        setData({ ...data, asset_location: e.target.value })
                      }
                    >
                      {locationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Button variant="outlined">
                    <AddLoaction getLocation={getLocation} />
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%" }}>
                  <FormControl fullWidth>
                    <InputLabel id="dept-dropdown-label">Department</InputLabel>
                    <Select
                      labelId="dept-dropdown-label"
                      id="dept-dropdown"
                      value={data.selectedDeptId}
                      label="Select a Department"
                      onChange={(e) =>
                        setData({ ...data, asset_department: e.target.value })
                      }
                    >
                      {departmentOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Button variant="outlined">
                    <AddDepartment getDepartment={getDepartment} />
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%" }}>
                  <FormControl fullWidth sx={{ gridColumn: "span 1" }}>
                    <InputLabel id="category-dropdown-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="category-dropdown-label"
                      id="category-dropdown"
                      value={selectedCategory} // Update this line
                      label="Select a Category"
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        getsubCategory(e.target.value);
                      }} // Update this line
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Button variant="outlined">
                    <AddCategory getCategory={getCategory} />
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%" }}>
                  <FormControl fullWidth sx={{ gridColumn: "span 1" }}>
                    <InputLabel id="category-dropdown-label">
                      Sub Category
                    </InputLabel>
                    <Select
                      labelId="category-dropdown-label"
                      id="category-dropdown"
                      value={data.selectedsubCategoryId}
                      label="Select a SubCategory"
                      onChange={(e) =>
                        setData({ ...data, asset_subCategory: e.target.value })
                      }
                    >
                      {subcategoryOptions &&
                        subcategoryOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Button variant="outlined">
                    <AddSubCategory getSubCategory={getsubCategory} />
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%" }}>
                  <FormControl fullWidth sx={{ gridColumn: "span 1" }}>
                    <InputLabel id="category-dropdown-label">
                      Condition
                    </InputLabel>
                    <Select
                      labelId="category-dropdown-label"
                      id="category-dropdown"
                      value={data.asset_condition}
                      label="Select a Conditon"
                      onChange={(e) =>
                        setData({ ...data, asset_condition: e.target.value })
                      }
                    >
                      {conditionOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Button variant="outlined">
                    <AddCondition getCondition={getCondition} />
                  </Button>
                </div>
              </div>
              <Box gridColumn={"span 3"}>
                <Divider />
                <Header subtitle="Asset Photo" />
              </Box>
              <Box gridColumn={"span 2"}>
                {selectedStockImage && (
                  <img
                    src={
                      typeof selectedStockImage == "string"
                        ? `http://localhost:8081/${selectedStockImage}`
                        : URL.createObjectURL(selectedStockImage)
                    }
                    style={{ height: "200px", width: "200px" }}
                  ></img>
                )}
              </Box>
              <br />
              <Button
                onClick={() => setAddPhotosModalOpen(true)}
                variant="contained"
                color="success"
                size="sm"
                style={{ height: "30px", width: "100px" }}
              >
                Choose File
              </Button>
              <Box gridColumn={"span 3"}>
                <Divider />
                <Header subtitle="Depreciation" />
              </Box>
              <Select
                fullWidth
                label="Depreciable Asset"
                value={isDepreciable}
                onChange={(e) => {
                  handleDepreciableChange(e);
                  setFieldValue("depreciation_percentage", "");
                  setFieldValue("asset_life", "");
                }}
                name="depreciableAsset"
                error={!!touched.depreciableAsset && !!errors.depreciableAsset}
                helperText={touched.depreciableAsset && errors.depreciableAsset}
                sx={{ gridColumn: "span 1" }}
              >
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
              {isDepreciable === "yes" && (
                <>
                  <TextField
                    fullWidth
                    type="text"
                    label="Depreciation Percentage"
                    onBlur={handleBlur}
                    onChange={(e) =>
                      setData({
                        ...data,
                        depreciation_percentage: e.target.value,
                      })
                    }
                    value={data.depreciation_percentage}
                    error={
                      !!touched.depreciation_percentage &&
                      !!errors.depreciation_percentage
                    }
                    helperText={
                      touched.depreciation_percentage &&
                      errors.depreciation_percentage
                    }
                    sx={{ gridColumn: "span 1" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <b>%</b>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Asset Life (Year)"
                    onBlur={handleBlur}
                    onChange={(e) =>
                      setData({ ...data, asset_life: e.target.value })
                    }
                    value={data.asset_life}
                    name="asset_life"
                    error={!!touched.asset_life && !!errors.asset_life}
                    helperText={touched.asset_life && errors.asset_life}
                    sx={{ gridColumn: "span 1" }}
                  />
                </>
              )}

              <CustomTabPanel value={value} index={1}></CustomTabPanel>
              <Add_Picture
                open={isAddPhotosModalOpen}
                handleClose={() => setAddPhotosModalOpen(false)}
                handleSelectedImage={handleSelected}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="info" variant="contained">
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

const AddLoaction = ({ getLocation }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button onClick={() => setToggle(true)}>Add New</Button>
      <Add_Location
        modal={toggle}
        toggle={() => setToggle((prev) => !prev)}
        readData={getLocation}
      />
    </>
  );
};

const AddDepartment = ({ getDepartment }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button onClick={() => setToggle(true)}>Add New</Button>
      <Add_Department
        modal={toggle}
        toggle={() => setToggle((prev) => !prev)}
        readData={getDepartment}
      />
    </>
  );
};

const AddCategory = ({ getCategory }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button onClick={() => setToggle(true)}>Add New</Button>
      <Add_Category
        modal={toggle}
        toggle={() => setToggle((prev) => !prev)}
        readData={getCategory}
      />
    </>
  );
};

const AddSubCategory = ({ getSubCategory }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button onClick={() => setToggle(true)}>Add New</Button>
      <Add_subCategory
        modal={toggle}
        toggle={() => setToggle((prev) => !prev)}
        readData={getSubCategory}
      />
    </>
  );
};

const AddCondition = ({ getCondition }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button onClick={() => setToggle(true)}>Add New</Button>
      <Add_Condition
        modal={toggle}
        toggle={() => setToggle((prev) => !prev)}
        readData={getCondition}
      />
    </>
  );
};

export default AddAsset;
