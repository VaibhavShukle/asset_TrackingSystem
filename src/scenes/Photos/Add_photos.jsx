import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import axios from "axios";
import { useParams } from "react-router-dom";

const Add_Photos = ({ open, handleClose, handleSelectedImage, readata }) => {
  const [data, setData] = useState({
    asset_image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { id } = useParams();
  const [value, setValue] = React.useState(0);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setData({ ...data, asset_image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async () => {
    try {
      // Check if an image is selected
      const imagePath = value === 0 ? data.asset_image : selectedImage;

      if (!imagePath) {
        // Handle case where no image is selected
        return;
      }

      // Perform the upload logic (replace with your actual API endpoint)
      const res = await axios.post(
        `http://localhost:8081/api/image/add_image/${id}`,
        {
          imagePath: imagePath,
        },

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Assuming your API returns success
      if (res.data.status === "success") {
        handleSelectedImage(imagePath);
        handleClose();
        if (value === 0) {
          // Reset the state for "Your Upload" case
          setData({ ...data, asset_image: null });
          setPreviewImage(null);
        } else {
          // Reset the state for "Stock Image" case
          setSelectedImage(null);
        }
      } else {
        // Handle error if the upload fails
        console.error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      // Handle other errors, e.g., network issues
    }
  };

  const itemData = [
    {
      img: "public/stockimages/103489991_256.jpg",
      title: "Table",
    },
    {
      img: "public/stockimages/113089432_256.jpg",
      title: "Chair",
    },
    {
      img: "public/stockimages/217423540_c_256.jpg",
      title: "Computer",
    },
    {
      img: "public/stockimages/134860556_256.jpg",
      title: "Keyboard",
    },
    {
      img: "public/stockimages/336521489_c_256.jpg",
      title: "CCTV",
    },
    {
      img: "public/stockimages/123970411_c_256.jpg",
      title: "Computer",
    },
    {
      img: "public/stockimages/233072941_256.jpg",
      title: "Mouse",
    },
    {
      img: "public/stockimages/356501300_256.jpg",
      title: "Laptop",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
        setData({ ...data, asset_image: null });
        setPreviewImage(null);
        setSelectedImage(null);
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add Photos</DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Your Upload" />
          <Tab label="Stock Image" />
        </Tabs>
      </Box>
      <DialogContent>
        {value === 0 && (
          <div>
            <DialogContentText>
              Please fill in the information for the new photos.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              type="file"
              fullWidth
              onChange={handleImageChange}
            />
            {data.asset_image && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: "150px", height: "150px", marginTop: "10px" }}
              />
            )}
            <br />
            <Button
              onClick={() => {
                handleSubmit();
                handleClose();
              }}
              color="success"
              variant="contained"
              style={{ marginTop: "10px" }}
            >
              Upload
            </Button>
            <Button
              onClick={() => {
                handleClose();
                setData({ ...data, asset_image: null });
                setPreviewImage(null);
              }}
              color="error"
              variant="contained"
              style={{ marginLeft: "10px", marginTop: "10px" }}
            >
              Close
            </Button>
          </div>
        )}
        {value === 1 && (
          <>
            <ImageList cols={4} rowHeight={164}>
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    src={`http://localhost:8081/${item.img}`}
                    alt={item.title}
                    loading="lazy"
                    onClick={() => handleImageClick(item.img)}
                    style={{
                      height: "50px",
                      width: "150px",
                      marginLeft: "30px",
                      border:
                        selectedImage === item.img ? "2px solid red" : "none",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
            <Button
              onClick={() => {
                handleSubmit();
                handleClose();
              }}
              color="success"
              variant="contained"
              style={{ marginTop: "10px" }}
            >
              Upload
            </Button>

            <Button
              onClick={handleClose}
              color="error"
              variant="contained"
              style={{ marginLeft: "10px", marginTop: "10px" }}
            >
              Close
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Add_Photos;
