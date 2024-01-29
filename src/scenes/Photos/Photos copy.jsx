import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";
import Add_Photos from "./Add_photos";

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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Photos() {
  const [imageUrls, setImageUrls] = useState([]);
  const [modal, setModal] = useState(false);
  const { id } = useParams();
  const [onvalue, setOnValue] = useState(false);
  const [img, setImg] = useState("");
  const [value, setValue] = useState(0);
  const [isAddPhotosModalOpen, setAddPhotosModalOpen] = useState(false);

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImageUrls([...imageUrls, ...urls]);
      setModal(false);
    }
  };

  // Function to handle image deletion
  const handleDeleteImage = (image_id) => {
    // Delete image from the backend
    axios
      .delete(`http://localhost:8081/api/image/delete/${image_id}`)
      .then((res) => {
        console.log(res);
        if (res.data.Status === "Success") {
          setOnValue(!onvalue);
          // Remove the image from the frontend
          setImageUrls(
            imageUrls.filter((imageUrl) => imageUrl.image_id !== image_id)
          );
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // Fetch the asset image
    axios
      .get(`http://localhost:8081/api/asset/get/${id}`)
      .then((res) => {
        const assetImageUrl = `http://localhost:8081/` + res.data.Result[0].asset_image;
        setImg(assetImageUrl);
      })
      .catch((err) => console.log(err));

    // Fetch the image URLs
    axios
      .get(`http://localhost:8081/api/image/get/${id}`)
      .then((res) => {
        const imageArray = res.data.data.map((e) => ({
          path: `http://localhost:8081/` + e.image_path,
          image_id: e.image_id,
        }));
        setImageUrls(imageArray);
      })
      .catch((err) => console.log(err));
  }, [id, onvalue]);

  return (
    <>
    
      <Box sx={{ width: "100%" }}>
        <Header title="Photos" />
        <Button
          onClick={() => setAddPhotosModalOpen(true)}
          variant="contained"
          color="success"
          size="small"
        >
          + Add Photos
        </Button>
        <CustomTabPanel value={value} index={0}>
        <Box style={{ display: "flex", flexDirection: "row"}}>
                <img src={img} alt="Asset Image" className="img1" style={{ width: "230px", height: "230px" }} />

                {imageUrls.map((imageUrl, index) => (
                    <div key={index} className="image-item">
                    <img
                        src={imageUrl.path}
                        alt={`Image ${index}`}
                        className="img1"
                        style={{ width: "230px", height: "230px", marginLeft:"100px" }}
                    />
                    </div>
                ))}
                </Box>


        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Add_Photos
            modal={modal}
            toggle={() => setModal(!modal)}
            handleImageUpload={handleImageUpload}
          />
        </CustomTabPanel>
      <Add_Photos open={isAddPhotosModalOpen} handleClose={() => setAddPhotosModalOpen(false)} />
      </Box>
    </>
  );
}

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

export default Photos;

