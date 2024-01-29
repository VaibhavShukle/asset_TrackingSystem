import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const Add_Category = ({ modal, toggle, readData, editData = "" }) => {
  const [data, setData] = useState({
    category_name: "",
  });

  useEffect(() => {
    setData({
      category_name: "",
    });
  }, [modal]);

  useEffect(() => {
    setData(editData);
  }, [editData]);

  const handleEdit = () => {
    axios
      .put(
        `http://localhost:8081/api/category/updateCategory/${data.category_id}`,
        data,
        {}
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("Category Update Successfully.", {
            type: "success",
            autoClose: 1500,
            theme: "dark",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/api/category/add_category", data)
      .then((res) => {
        toggle();
        readData();
        toast("Category Added Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
        setData({
          category_name: "",
        });
      })
      .catch((err) => {
        console.error(err);
        toast("Error adding category.", { type: "error" });
      });
  };

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data.category_id ? (
        <DialogTitle>Add Category</DialogTitle>
      ) : (
        <DialogTitle>Edit Category</DialogTitle>
      )}
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new category.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          type="text"
          fullWidth
          value={data.category_name}
          onChange={(e) => setData({ ...data, category_name: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant="contained" color="error">
          Cancel
        </Button>
        {!data.category_id ? (
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

export default Add_Category;
