import {
  Box,
  Breadcrumbs,
  Link,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../..";
import { useParams, useNavigate } from "react-router-dom";

const EditAsset = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    asset_id: "",
    asset_name: "",
    asset_brand: "",
    asset_model: "",
    asset_location: "",
    asset_category: "",
    asset_purchaseDate: "",
    asset_Cost: "",
    asset_owner: "",
    asset_vendorInfo: "",
    asset_serialNumber: "",
    asset_condition: "",
    asset_image: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("asset_id", data.asset_id);
    formData.append("asset_name", data.asset_name);
    formData.append("asset_brand", data.asset_brand);
    formData.append("asset_model", data.asset_model);
    formData.append("asset_location", data.asset_location);
    formData.append("asset_purchaseDate", data.asset_purchaseDate);
    formData.append("asset_Cost", data.asset_Cost);
    formData.append("asset_owner", data.asset_owner);
    formData.append("asset_vendorInfo", data.asset_vendorInfo);
    formData.append("asset_serialNumber", data.asset_serialNumber);
    formData.append("asset_Condition", data.asset_physicalCondition);
    formData.append("asset_image", data.asset_image);

    axios
      .put(`http://localhost:8081/api/asset/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/assets");
        }
      })
      .catch((err) => console.log(err));
  };

  function handleClick(event) {
    event.preventDefault();
  }

  const readAsset = async () => {
    const response = await axios.get(
      "http://localhost:8081/api/asset/get/" + id
    );
    setData(response.data.Result[0]);
  };

  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    readAsset();
  }, [id]);

  return (
    <>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="#6870fa"
            fontSize={"16px"}
            marginLeft={"19px"}
            onClick={() => navigate("/assets")}
          >
            List Assets
          </Link>
          <Typography color="text.primary" fontSize={"16px"}>
            Edit Asset
          </Typography>
        </Breadcrumbs>
      </div>
      <Box m="20px">
        <Header title="Asset View" />

        {data.asset_name && (
          <Formik onSubmit={handleSubmit} initialValues={data}>
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_name}
                    name="asset_name"
                    error={!!touched.Asset_Name && !!errors.Asset_Name}
                    helperText={touched.Asset_Name && errors.Asset_Name}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset ID"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_id}
                    name="asset_id"
                    error={!!touched.Asset_ID && !!errors.Asset_ID}
                    helperText={touched.Asset_ID && errors.Asset_ID}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Brand"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_brand}
                    name="asset_brand"
                    error={!!touched.asset_brand && !!errors.asset_brand}
                    helperText={touched.asset_brand && errors.asset_brand}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Modal"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_model}
                    name="asset_model"
                    error={!!touched.asset_model && !!errors.asset_model}
                    helperText={touched.asset_model && errors.asset_model}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_location}
                    name="asset location"
                    error={!!touched.asset_location && !!errors.asset_location}
                    helperText={touched.asset_location && errors.asset_location}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Category"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_category}
                    name="category"
                    error={!!touched.asset_category && !!errors.asset_category}
                    helperText={touched.asset_category && errors.asset_category}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Purchase Date"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={formatDate(values.asset_purchaseDate)}
                    name="asset purchaseDate"
                    error={
                      !!touched.asset_purchaseDate &&
                      !!errors.asset_purchaseDate
                    }
                    helperText={
                      touched.asset_purchaseDate && errors.asset_purchaseDate
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Cost"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_Cost}
                    name="asset_Cost"
                    error={!!touched.asset_Cost && !!errors.asset_Cost}
                    helperText={touched.asset_Cost && errors.asset_Cost}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Owner"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_owner}
                    name="asset_owner"
                    error={!!touched.asset_owner && !!errors.asset_owner}
                    helperText={touched.asset_owner && errors.asset_owner}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Vendor Information"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_vendorInfo}
                    name="asset_vendorInfo"
                    error={
                      !!touched.asset_vendorInfo && !!errors.asset_vendorInfo
                    }
                    helperText={
                      touched.asset_vendorInfo && errors.asset_vendorInfo
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Serial Number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_serialNumber}
                    name="asset_serialNumber"
                    error={
                      !!touched.asset_serialNumber &&
                      !!errors.asset_serialNumber
                    }
                    helperText={
                      touched.asset_serialNumber && errors.asset_serialNumber
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Asset Condition"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.asset_condition}
                    name="asset_condition"
                    error={
                      !!touched.asset_condition && !!errors.asset_condition
                    }
                    helperText={
                      touched.asset_condition && errors.asset_condition
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <img
                    src={baseUrl + "/" + data.asset_image}
                    alt="ImgBox"
                    style={{
                      objectFit: "contain",
                    }}
                    height={"100%"}
                  />
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                  <Button type="submit" color="warning" variant="contained">
                    Submit
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        )}
      </Box>
    </>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

export default EditAsset;
