import React, { useState, useEffect } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import Add_Photos from "./Add_photos";

function Photos() {
  const [imageUrls, setImageUrls] = useState([]);
  const [modal, setModal] = useState(false);
  const { id } = useParams();
  const [onvalue, setOnValue] = useState(false);
  const [img, setImg] = useState("");
  const [isAddPhotosModalOpen, setAddPhotosModalOpen] = useState(false);
  const [selectedStockImage, setSelectedStockImage] = useState(null);

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...urls]);
      setModal(false);
    }
  };

  const handleSelected = (image) => {
    setSelectedStockImage(image);
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

  const readPhotos = async () => {
    try {
      // Fetch the asset image
      const assetRes = await axios.get(
        `http://localhost:8081/api/asset/get/${id}`
      );
      const assetImageUrl =
        `http://localhost:8081/` + assetRes.data.Result[0].asset_image;
      setImg(assetImageUrl);

      // Fetch the image URLs
      const imageRes = await axios.get(
        `http://localhost:8081/api/image/get/${id}`
      );
      const imageArray = imageRes.data.data.map((e) => ({
        path: `http://localhost:8081/` + e.image_path,
        image_id: e.image_id,
      }));
      setImageUrls(imageArray);
    } catch (error) {
      console.error("Error fetching asset and image URLs:", error);
    }
  };

  useEffect(() => {
    readPhotos();
  }, [id, onvalue]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          marginTop: "25px",
        }}
      >
        <Typography style={{ fontSize: "20px", marginTop: "10px" }}>
          Photos
        </Typography>
        <Button
          onClick={() => setAddPhotosModalOpen(true)}
          variant="contained"
          color="success"
          size="small"
          readata={readPhotos}
        >
          Add Photos
        </Button>
      </div>
      {/* <Divider /> */}
      <div>
        <Grid container>
          <Grid item>
            <div>
              <Box
                style={{ display: "flex", flexDirection: "row" }}
                sx={{
                  height: "230px",
                  border: "1px solid #EBEDF3",
                  marginBottom: "15px",
                  // marginTop: "15px",
                  marginLeft: "10px",
                  overflow: "hidden",
                  width: "230px",
                }}
              >
                <img
                  src={img}
                  alt="Asset Image"
                  className="img1"
                  style={{ width: "230px", height: "230px" }}
                />
              </Box>
            </div>{" "}
          </Grid>
          <Grid item>
            <div>
              <Box style={{ display: "flex", flexDirection: "row" }}>
                {imageUrls.map((imageUrl, index) => (
                  <div key={index}>
                    <img
                      src={imageUrl.path}
                      alt={`Image ${index}`}
                      className="img1"
                      style={{
                        width: "230px",
                        height: "230px",
                        // marginLeft: "100px",
                      }}
                    />
                  </div>
                ))}
              </Box>
            </div>
          </Grid>
        </Grid>
      </div>

      <Box sx={{ width: "100%" }}>
        <Add_Photos
          open={isAddPhotosModalOpen}
          handleClose={() => setAddPhotosModalOpen(false)}
          toggle={() => setModal(!modal)}
          handleSelectedImage={handleSelected}
        />
      </Box>
    </>
  );
}

export default Photos;
