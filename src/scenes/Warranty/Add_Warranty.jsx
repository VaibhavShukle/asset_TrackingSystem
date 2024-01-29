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
import { useParams } from "react-router-dom";
import { Label } from "reactstrap";

const Add_Warranty = ({ modal, toggle, readData, editData }) => {
  const [data, setData] = useState({
    war_length: "",
    exp_date: "",
    notes: "",
  });

  const [updatedFields, setUpdatedFields] = useState("");

  useEffect(() => {
    setData({
      war_length: "",
      exp_date: "",
      notes: "",
    });
  }, [modal]);

  useEffect(() => {
    setData(editData);
  }, [editData]);

  const { id } = useParams();

  const handleEdit = () => {
    const previousData = { ...data };

    const updatedData = {
      ...data,
      updatedFields: updatedFields.trim(),
    };

    axios
      .put(
        `http://localhost:8081/api/warranty/updateWarranty/${data.warranty_id}`,
        updatedData,
        {}
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("Warranty Update Successfully.", {
            type: "success",
            autoClose: 1500,
            theme: "dark",
          });

          const changes = [];
          for (const key in data) {
            if (data[key] !== previousData[key]) {
              changes.push({
                field: key,
                changedFrom: previousData[key],
                changedTo: data[key],
              });
            }
          }
          console.log(changes);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`http://localhost:8081/api/warranty/add_warranty/${id}`, data)
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("Warranty Added Successfully.", {
            type: "success",
            autoClose: 1500,
            theme: "dark",
          });
          setData({
            war_length: "",
            exp_date: "",
            notes: "",
          });
        } else {
          console.error("Error adding warranty:", res.data.Error);
          toast("Error adding warranty.", { type: "error" });
        }
      })
      .catch((err) => {
        console.error("Error during API call:", err);
        toast("Error adding warranty.", { type: "error" });
      });
  };

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data?.warranty_id ? (
        <DialogTitle>Add Warranty</DialogTitle>
      ) : (
        <DialogTitle>Edit Warranty</DialogTitle>
      )}
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new warranty.
        </DialogContentText>
        <Label>Length</Label>
        <TextField
          margin="dense"
          type="text"
          fullWidth
          value={data?.war_length}
          onChange={(e) => {
            setData({ ...data, war_length: e.target.value });
            if (!updatedFields.includes("Warranty Length")) {
              setUpdatedFields((prev) => prev + "Warranty Length ");
            }
          }}
        />
        <Label>Expiration Date</Label>
        <TextField
          autoFocus
          margin="dense"
          type="date"
          fullWidth
          value={data?.exp_date}
          onChange={(e) => {
            {
              setData({ ...data, exp_date: e.target.value });
              if (!updatedFields.includes("Expiry Date")) {
                setUpdatedFields((prev) => prev + "Expiry Date ");
              }
            }
          }}
        />
        <Label>Notes</Label>
        <TextField
          margin="dense"
          type="text"
          fullWidth
          value={data?.notes}
          onChange={(e) => {
            {
              setData({ ...data, notes: e.target.value });
              if (!updatedFields.includes("Notes")) {
                setUpdatedFields((prev) => prev + "Notes ");
              }
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} color="error" variant="contained">
          Cancel
        </Button>
        {!data?.warranty_id ? (
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

export default Add_Warranty;
