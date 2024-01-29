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

const Add_AssetBrand = ({modal,toggle,readData,editData}) => {
  const [data, setData] = useState({
    brand_name: "",
  });

  useEffect(()=>{
    setData({
        brand_name: "",
    })
  },[modal])

  useEffect (()=> {
    setData(editData)
  }, [editData])

  const handleEdit=()=>{
    axios
      .put(`http://localhost:8081/api/assetBrand/updateAssetBrand/${data.brand_id}`, data, {
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle()
          readData()
          toast("Asset Brand Update Successfully.", {
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
      .post("http://localhost:8081/api/assetBrand/add_assetBrand", data)
      .then((res) => {
        toggle()
        readData()
        toast("New Asset Brand Added Successfully.", {
          type: "success",
          autoClose: 1500,
          theme: "dark",
        });
        setData({
            brand_name: "",
        })
      })
      .catch((err) => {
        console.error(err);
        toast("Error adding asse Brand.", { type: "error" });
      });
  };

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data.brand_id?<DialogTitle>Add Asset Brand</DialogTitle>:<DialogTitle>Edit Asset Brand</DialogTitle>}
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new asset brand.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Asset Brand Name"
          type="text"
          fullWidth
          value={data.brand_name}
          onChange={(e) =>
            setData({ ...data, brand_name: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant="contained" color="error">
          Cancel
        </Button>
        {!data.brand_id ?<Button onClick={handleSubmit} variant="contained" color="success">
          Add
        </Button>:<Button onClick={handleEdit} variant = "contained" color="info">
          Edit
        </Button>}
      </DialogActions>
    </Dialog>
  );
};

export default Add_AssetBrand;
