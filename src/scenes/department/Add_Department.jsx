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

const Add_Department = ({ modal, toggle, readData, editData = "" }) => {
  const [data, setData] = useState({
    dept_name: "",
  });

  useEffect(() => {
    setData({
      dept_name: "",
    });
  }, [modal]);

  useEffect(() => {
    setData(editData);
  }, [editData]);

  const handleEdit = () => {
    axios
      .put(
        `http://localhost:8081/api/department/updateDepartment/${data.dept_id}`,
        data,
        {}
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("Department Update Successfully.", {
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
      .post("http://localhost:8081/api/department/add_department", data)
      .then((res) => {
        toggle();
        readData();
        toast("Department Added Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
        setData({
          dept_name: "",
        });
      })
      .catch((err) => {
        console.error(err);
        toast("Error adding department.", { type: "error" });
      });
  };

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data.dept_id ? (
        <DialogTitle>Add Department</DialogTitle>
      ) : (
        <DialogTitle>Edit Department</DialogTitle>
      )}
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new department.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Department Name"
          type="text"
          fullWidth
          value={data.dept_name}
          onChange={(e) => setData({ ...data, dept_name: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant="contained" color="error">
          Cancel
        </Button>
        {!data.dept_id ? (
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

export default Add_Department;
