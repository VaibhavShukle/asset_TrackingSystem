import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const Add_SubCategory = ({ modal, toggle, readData, editData = "" }) => {
  const [data, setData] = useState({
    subcategory_name: "",
    selectedCategory: "",
    selectedCategoryId: "",
  });

  useEffect(() => {
    setData({
      subcategory_name: "",
      selectedCategory: "",
      selectedCategoryId: "",
    });
  }, [modal]);

  useEffect(() => {
    setData(editData);
  }, [editData]);

  console.log(editData);

  const handleEdit = () => {
    axios
      .put(
        `http://localhost:8081/api/subcategory/updateSubcategory/${data.subcategory_id}`,
        data,
        {}
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("Subcategory Update Successfully.", {
            type: "success",
            autoClose: 1500,
            theme: "dark",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const [categoryOptions, setCategoryOptions] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/api/subcategory/add_subcategory", data)
      .then((res) => {
        toggle();
        readData();
        toast("SubCategory Added Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
      })
      .catch((err) => {
        console.error(err);
        // Handle error, show error message to the user
        toast("Error adding subcategory.", { type: "error" });
      });
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

  const handleInputChange = (field, value) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data.subcategory_id ? (
        <DialogTitle>Add Sub Category</DialogTitle>
      ) : (
        <DialogTitle>Edit Sub Category</DialogTitle>
      )}
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new subcategory.
        </DialogContentText>
        <FormControl fullWidth sx={{ marginTop: "10px" }}>
          <InputLabel id="dropdown-label">Select a Category</InputLabel>
          <Select
            labelId="dropdown-label"
            id="dropdown"
            value={data.selectedCategoryId}
            label="Select a Category"
            onChange={(e) => {
              const selectedCategoryId = e.target.value;
              const selectedCategory = categoryOptions.find(
                (option) => option.value === selectedCategoryId
              ).label;

              setData({
                ...data,
                selectedCategory,
                selectedCategoryId,
              });
            }}
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label="SubCategory Name"
          type="text"
          fullWidth
          value={data.subcategory_name}
          onChange={(e) =>
            setData({ ...data, subcategory_name: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant="contained" color="error">
          Cancel
        </Button>
        {!data.subcategory_id ? (
          <Button onClick={handleSubmit} variant="contained" color="success">
            Add
          </Button>
        ) : (
          <Button onClick={handleEdit} variant="contained" color="info">
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Add_SubCategory;
