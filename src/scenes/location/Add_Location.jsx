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

const Add_Location = ({ modal, toggle, readData, editData = "" }) => {
  const [data, setData] = useState({
    location_name: "",
    location_address: "",
    location_desc: "",
  });

  useEffect(() => {
    setData({
      location_name: "",
      location_address: "",
      location_desc: "",
    });
  }, [modal]);

  useEffect(() => {
    setData(editData);
  }, [editData]);

  const handleEdit = () => {
    axios
      .put(
        `http://localhost:8081/api/location/updateLocation/${data.location_id}`,
        data,
        {}
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("Location Update Successfully.", {
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
      .post("http://localhost:8081/api/location/add_location", data)
      .then((res) => {
        toggle();
        readData();
        toast("Location Added Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
        setData({
          location_name: "",
          location_address: "",
          location_desc: "",
        });
      })
      .catch((err) => {
        console.error(err);
        toast("Error adding location.", { type: "error" });
      });
  };

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data.location_id ? (
        <DialogTitle>Add Location</DialogTitle>
      ) : (
        <DialogTitle>Edit Location</DialogTitle>
      )}

      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new location.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Location Name"
          type="text"
          fullWidth
          value={data.location_name}
          onChange={(e) => setData({ ...data, location_name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Location Address"
          type="text"
          fullWidth
          value={data.location_address}
          onChange={(e) =>
            setData({ ...data, location_address: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Location Description"
          type="text"
          fullWidth
          value={data.location_desc}
          onChange={(e) => setData({ ...data, location_desc: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant="contained" color="error">
          Cancel
        </Button>
        {!data.location_id ? (
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

export default Add_Location;
