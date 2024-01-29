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

const Add_Vendor = ({modal,toggle,readData,editData}) => {
  const [data, setData] = useState({
    v_name: "",
    v_phone: "",
    v_address: "",
    v_details: "",
  });

  useEffect(()=>{
    setData({
      v_name: "",
      v_phone: "",
      v_address: "",
      v_details: "",
    })
  },[modal])

  useEffect (()=> {
    setData(editData)
  }, [editData])


  const handleEdit=()=>{
    axios
      .put(`http://localhost:8081/api/vendor/updateVendor/${data.v_id}`, data, {
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle()
          readData()
          toast("Vendor Update Successfully.", {
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
      .post("http://localhost:8081/api/vendor/add_vendor", data)
      .then((res) => {
        toggle()
        readData()
        toast("Vendor Added Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
        setData({
            v_name: "",
            v_phone: "",
            v_address: "",
            v_details: "",
        })
      })
      .catch((err) => {
        console.error(err);
        toast("Error adding vendor.", { type: "error" });
      });
  };

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data.v_id?<DialogTitle>Add Vendor</DialogTitle>:<DialogTitle>Edit Vendor</DialogTitle>}
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new vendor.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Vendor Name"
          type="text"
          fullWidth
          value={data.v_name}
          onChange={(e) =>
            setData({ ...data, v_name: e.target.value })
          }
        />
        <TextField
          autoFocus
          margin="dense"
          label="Vendor Phone No."
          type="text"
          fullWidth
          value={data.v_phone}
          onChange={(e) =>
            setData({ ...data, v_phone: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Vendor Address"
          type="text"
          fullWidth
          value={data.v_address}
          onChange={(e) =>
            setData({ ...data, v_address: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Vendor Details"
          type="text"
          fullWidth
          value={data.v_details}
          onChange={(e) =>
            setData({ ...data, v_details: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant = "contained" color="error">
          Cancel
        </Button>
        {!data.v_id ?<Button onClick={handleSubmit} variant = "contained" color="success">
          Add
        </Button>:<Button onClick={handleEdit} variant = "contained" color="info">
          Edit
        </Button>}
        
      </DialogActions>
    </Dialog>
  );
};

export default Add_Vendor;
