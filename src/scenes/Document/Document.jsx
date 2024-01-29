import axios from "axios";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  Divider,
} from "@mui/material";
import React, { useState, useEffect } from "react";
// import { tokens } from "../../theme";
// import { useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Add_Document from "./Add_Document";
import ConfirmationModal from "../confirmationModel/Confirmation_Modal";

function Document() {
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [isAddDocumentModalOpen, setAddDocumentModalOpen] = useState(false);
  // const theme = useTheme();
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  // const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  const handleDelete = (doc_id) => {
    setConfirmationModalOpen(true);
    setSelectedDocumentId(doc_id);
  };

  const confirmDelete = () => {
    if (selectedDocumentId) {
      axios
        .delete(
          `http://localhost:8081/api/document/delete/${selectedDocumentId}`
        )
        .then((res) => {
          if (res.data.Status === "Success") {
            readDocument();
            toast("Document Delete Successful.", {
              type: "success",
              autoClose: 1500,
              theme: "dark",
            });
          } else {
            toast("Error deleting document.", {
              type: "error",
              autoClose: 1500,
              theme: "dark",
            });
          }
        })
        .catch((err) => console.log(err));
    }
    setConfirmationModalOpen(false);
  };

  const handleDownload = (pdfUrl, fileName) => {
    const link = document.createElement("a");
    link.href = pdfUrl || "http://example.com/default.pdf"; // Replace with your actual PDF URL
    link.download = fileName || "document.pdf"; // Default file name if not provided
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const readDocument = async () => {
    await axios
      .get(`http://localhost:8081/api/document/get/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readDocument();
  }, [id]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          marginTop: "25px",
        }}
      >
        <Typography style={{ fontSize: "20px", marginTop: "10px" }}>
          Documents
        </Typography>
        <Button
          onClick={() => setModal(true)}
          style={{ marginBottom: "10px" }}
          variant="contained"
          color="success"
          size="small"
        >
          + Add Document
        </Button>
      </div>

      <Add_Document
        modal={modal}
        toggle={() => setModal(!modal)}
        readData={readDocument}
        open={isAddDocumentModalOpen}
        handleClose={() => setAddDocumentModalOpen(false)}
      />

      <Divider />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirm={confirmDelete}
      />

      <Grid item xs={3} style={{ marginBottom: "30px" }}>
        {data.length > 0 ? (
          <Table style={{ border: "1px solid #EBEDF3" }} size="small">
            <TableHead className="tableHead" key={"tableHead"}>
              <TableRow style={{ border: "1px solid #EBEDF3" }}>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  File Title
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  File Name
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Upload Date
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((data) => (
                <TableRow style={{ border: "1px solid #EBEDF3" }}>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.doc_title}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.document}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.doc_date}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    <Button
                      onClick={() =>
                        handleDownload(
                          `http://localhost:8081/${data.doc_name}`,
                          "my-document.pdf"
                        )
                      }
                      variant="outlined"
                      color="success"
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => handleDelete(data.doc_id)}
                      variant="outlined"
                      color="error"
                      style={{ marginLeft: "5px" }}
                    >
                      Detach
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "15px",
              color: "#198754",
            }}
          >
            <b>No document has been added.</b>
          </Typography>
        )}
      </Grid>
    </>
  );
}

export default Document;
