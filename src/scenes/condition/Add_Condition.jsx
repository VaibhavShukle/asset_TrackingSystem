import React, { useState } from "react";
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

const Add_Condition = (props) => {
  const [data, setData] = useState({
    location_name: "",
    location_address: "",
    location_desc: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/api/location/add_location", data)
      .then((res) => {
        props.toggle();
        props.readData();
        toast("Location Added Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
        setData({
          location_name: "",
          location_address: "",
          location_desc: "",
        })
      })
      .catch((err) => {
        console.error(err);
        toast("Error adding location.", { type: "error" });
      });
  };

  return (
    <Dialog open={props.modal} onClose={props.toggle}>
      <DialogTitle>Add Location</DialogTitle>
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
          onChange={(e) =>
            setData({ ...data, location_name: e.target.value })
          }
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
          onChange={(e) =>
            setData({ ...data, location_desc: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.toggle} color="error" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="success" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Add_Condition;
