import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { toast } from "react-toastify";

const Add_User = ({ modal, toggle, readData, editData }) => {
  const [data, setData] = useState({
    u_name: "",
    u_empid: "",
    u_phone: "",
    u_email: "",
    location_id: "",
    dept_id: "",
    selectedLocationId: "",
    selectedDeptId: "",
  });

  useEffect(() => {
    setData({
      u_name: "",
      u_empid: "",
      u_phone: "",
      u_email: "",
    });
  }, [modal]);

  useEffect(() => {
    setData(editData);
  }, [editData]);

  const [locationOptions, setLocationOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const handleEdit = () => {
    axios
      .put(`http://localhost:8081/api/user/updateUser/${data.u_id}`, data, {})
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("User Update Successfully.", {
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
      .post("http://localhost:8081/api/user/add_user", data)
      .then((res) => {
        toggle();
        readData();
        toast("User Added Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
      })
      .catch((err) => {
        console.error(err);
        toast("Error adding user.", { type: "error" });
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

  const readDepartment = () => {
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

  const handleInputChange = (field, value) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  useEffect(() => {
    getLocation();
    readDepartment();
  }, []);

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data.u_id ? (
        <DialogTitle>Add User</DialogTitle>
      ) : (
        <DialogTitle>Edit User</DialogTitle>
      )}
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new user.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Name Of User"
          type="text"
          fullWidth
          value={data.u_name}
          onChange={(e) => handleInputChange("u_name", e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Emp ID Of User"
          type="text"
          fullWidth
          value={data.u_empid}
          onChange={(e) => handleInputChange("u_empid", e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Phone No. Of User"
          type="text"
          fullWidth
          value={data.u_phone}
          onChange={(e) => handleInputChange("u_phone", e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Email Of User"
          type="text"
          fullWidth
          value={data.u_email}
          onChange={(e) => handleInputChange("u_email", e.target.value)}
        />
        <Autocomplete sx={{marginTop : "10px"}}
          margin="dense"
          id="location-autocomplete"
          options={locationOptions}
          getOptionLabel={(option) => option.label}
          value={
            locationOptions.find(
              (option) => option.value === data.selectedLocationId
            ) || null
          }
          onChange={(event, newValue) => {
            setData({
              ...data,
              location_id: newValue ? newValue.value : "",
              selectedLocationId: newValue ? newValue.value : "",
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Name Of Location" fullWidth />
          )}
        />

        <Autocomplete sx={{marginTop : "10px"}}
          margin="dense"
          id="dept-autocomplete"
          options={departmentOptions}
          getOptionLabel={(option) => option.label}
          value={
            departmentOptions.find(
              (option) => option.value === data.selectedDeptId
            ) || null
          }
          onChange={(event, newValue) => {
            setData({
              ...data,
              dept_id: newValue ? newValue.value : "",
              selectedDeptId: newValue ? newValue.value : "",
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Name Of Department" fullWidth />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant="contained" color="error">
          Cancel
        </Button>
        {!data.u_id ? (
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

export default Add_User;
