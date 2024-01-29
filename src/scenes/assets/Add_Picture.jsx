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
import { useParams } from "react-router-dom";

const Add_Picture = ({ open, handleClose, handleSelectedImage }) => {
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

    // Display a preview of the selected image
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = () => {
    // Handle the submit logic, e.g., upload the user-selected image
    // Use data.asset_image for the selected image
    // ...

    // Assuming you want to handle the selected image in the parent component
    setSelectedImage(null);
    handleSelectedImage(data.asset_image);
    handleClose();

    // After handling submit, reset the selected image state.
    // setData({ asset_image: null });
    // setPreviewImage(null);
    // setSelectedImage(null);
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
            {data.asset_image ? (
              <img
                src={URL.createObjectURL(data.asset_image)}
                alt="Preview"
                style={{ width: "150px", height: "150px", marginTop: "10px" }}
              />
            ) : null}{" "}
            <br />
            <Button
              onClick={handleSubmit}
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
          <ImageList cols={4} rowHeight={164}>
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`http://localhost:8081/${item.img}`}
                  alt={item.title}
                  loading="lazy"
                  onClick={() => {
                    setSelectedImage(item.img);
                    handleSelectedImage(item.img);
                    setData({ ...data, asset_image: null });
                    // assuming you want to handle this in the parent component
                    handleClose();
                  }}
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Add_Picture;
