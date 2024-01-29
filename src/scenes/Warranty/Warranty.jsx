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
  Tooltip,
  Divider,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import { tokens } from "../../theme";
// import { useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../confirmationModel/Confirmation_Modal";
import Add_Warranty from "./Add_Warranty";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

function Warranty() {
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState(null);
  // const [isAddWarrantyModalOpen, setAddWarrantyModalOpen] = useState(false);
  // const theme = useTheme();
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  // const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState({
    war_length: "",
    exp_date: "",
    notes: "",
  });

  const toggle = () => {
    setEditData({
      war_length: "",
      exp_date: "",
      notes: "",
    });
    setModal(!modal);
  };

  const handleDelete = (warranty_id) => {
    setConfirmationModalOpen(true);
    setSelectedWarrantyId(warranty_id);
  };

  const handleEdit = (data) => {
    // axios
    //   .get(`http://localhost:8081/api/warranty/getWarranty/${id}`)
    //   .then((res) => {
    //     if (res.data.Status === "Success") {
    console.log(data);
    setEditData(data);
    setModal(!modal);
    //   }
    // });
  };

  const confirmDelete = () => {
    if (selectedWarrantyId) {
      axios
        .delete(
          `http://localhost:8081/api/warranty/delete/${selectedWarrantyId}`
        )
        .then((res) => {
          if (res.data.Status === "Success") {
            readWarranty();
            toast("Warranty Delete Successful.", {
              type: "success",
              autoClose: 1500,
              theme: "dark",
            });
          } else {
            toast("Error deleting warranty.", {
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

  const readWarranty = async () => {
    await axios
      .get(`http://localhost:8081/api/warranty/getWarranty/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readWarranty();
  }, []);

  const isWarrantyExpired = (expirationDate) => {
    const currentDate = new Date();
    const warrantyDate = new Date(expirationDate);
    return currentDate > warrantyDate;
  };

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
        <Typography
          style={{
            fontSize: "20px",
            marginBottom: "10px",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Warranty
        </Typography>
        <Button
          onClick={() => setModal(true)}
          style={{ marginBottom: "10px" }}
          variant="contained"
          color="success"
          size="small"
        >
          + Add Warranty
        </Button>
      </div>

      <Add_Warranty
        modal={modal}
        toggle={() => toggle()}
        readData={readWarranty}
        editData={editData}
        // open={isAddWarrantyModalOpen}
        // handleClose={() => setAddWarrantyModalOpen(false)}
      />
      <Divider />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirm={confirmDelete}
      />

      <Grid item xs={3} style={{ marginBottom: "10px" }}>
        {data.length > 0 ? (
          <Table style={{ border: "1px solid #EBEDF3" }} size="small">
            <TableHead className="tableHead" key={"tableHead"}>
              <TableRow style={{ border: "1px solid #EBEDF3" }}>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Active
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Expiration Date
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Length
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Notes
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
                    {isWarrantyExpired(data.exp_date) ? (
                      <CloseIcon
                        style={{
                          color: "#dc3545",
                          width: "90%",
                          fontSize: "25px",
                        }}
                      />
                    ) : (
                      <DoneIcon
                        style={{
                          color: "#198754",
                          width: "90%",
                          fontSize: "25px",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {moment(data.exp_date).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.war_length}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    <Tooltip title={data.notes} placement="top" sx={{}}>
                      <InfoOutlinedIcon />
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    <EditOutlinedIcon
                      variant="outlined"
                      color="success"
                      onClick={() => handleEdit(data)}
                      style={{ marginLeft: "10px" }}
                    />
                    <DeleteOutlinedIcon
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(data.warranty_id)}
                      style={{ marginLeft: "10px" }}
                    />
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
            <b>No warranty has been added.</b>
          </Typography>
        )}
      </Grid>
    </>
  );
}

export default Warranty;
