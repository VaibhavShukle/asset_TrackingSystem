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
import { useParams } from "react-router-dom";

const Add_Document = ({ modal, toggle, readData }) => {
  const [data, setData] = useState({
    doc_title: "",
    document: null,
  });

  const { id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("doc_title", data.doc_title);
    formData.append("document", data.document);

    try {
      const res = await axios.post(
        `http://localhost:8081/api/document/add_document/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.Status === "Success") {
        toggle();
        readData();
        toast.success("Document Added Successfully.", { autoClose: 1500 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding document.", { autoClose: 1500, theme: "dark" });
    }
  };

  const handleDocumentChange = (event) => {
    setData({ ...data, document: event.target.files[0] });
  };

  return (
    <Dialog open={modal} onClose={toggle}>
      <DialogTitle>Add Document</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new document.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={data.doc_title}
          onChange={(e) => setData({ ...data, doc_title: e.target.value })}
        />
        <TextField
          autoFocus
          margin="dense"
          type="file"
          fullWidth
          onChange={handleDocumentChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} color="error" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="success" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Add_Document;
