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
import Add_Maintenance from "./Add_Maintenance";

function Maintenance() {
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null);
  // const [isAddWarrantyModalOpen, setAddWarrantyModalOpen] = useState(false);
  // const theme = useTheme();
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  // const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState({
    main_title: "",
    main_details: "",
    main_date: "",
    main_by: "",
    mainStatus_id: "",
    main_complete: "",
    main_cost: "",
  });

  const toggle = () => {
    setEditData({
      main_title: "",
      main_details: "",
      main_date: "",
      main_by: "",
      mainStatus_id: "",
      main_complete: "",
      main_cost: "",
    });
    setModal(!modal);
  };

  const handleDelete = (main_id) => {
    setConfirmationModalOpen(true);
    setSelectedMaintenanceId(main_id);
  };

  const handleEdit = (data) => {
    // axios
    //   .get(`http://localhost:8081/api/maintenance/getMaintenance/${id}`)
    //   .then((res) => {
    //     if (res.data.Status === "Success") {

    setEditData(data);
    setModal(!modal);
    //   }
    // });
  };

  const confirmDelete = () => {
    if (selectedMaintenanceId) {
      axios
        .delete(
          `http://localhost:8081/api/maintenance/delete/${selectedMaintenanceId}`
        )
        .then((res) => {
          if (res.data.Status === "Success") {
            readMaintenance();
            toast("Maintenance Delete Successful.", {
              type: "success",
              autoClose: 1500,
              theme: "dark",
            });
          } else {
            toast("Error deleting Maintenance.", {
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

  // const readMainStatus = async () => {
  //   let Msid = data?.mainStatus_id;
  //   console.log(Msid)
  //   await axios
  //     .get(`http://localhost:8081/api/main_status/getMain_Status/${Msid}`)
  //     .then((res) => {
  //       if (res.data.Status === "Success") {
  //         setMainStatus(res.data.Result);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const readMaintenance = async () => {
    await axios
      .get(`http://localhost:8081/api/maintenance/getMaintenance/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readMaintenance();
  }, []);

  // useEffect(() => {
  //   readMainStatus();
  // }, [data]);

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
          Maintenance
        </Typography>
        <Button
          onClick={() => setModal(true)}
          style={{ marginBottom: "10px" }}
          variant="contained"
          color="success"
          size="small"
        >
          + Add Maintenance
        </Button>
      </div>
      <Divider />
      <Add_Maintenance
        modal={modal}
        toggle={() => toggle()}
        readData={readMaintenance}
        editData={editData}
        // open={isAddWarrantyModalOpen}
        // handleClose={() => setAddWarrantyModalOpen(false)}
      />

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
                  Schedule Date
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Title
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Maintenance By
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Status
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Completion Date
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Maintenance Cost
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  Details
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
                    {data.main_date}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.main_title}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.main_by}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.status.mainStatus_name}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.main_complete}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.main_cost}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    <Tooltip title={data.main_details} placement="top">
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
                      onClick={() => handleDelete(data.main_id)}
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
            <b>No maintenance has been added.</b>
          </Typography>
        )}
      </Grid>
    </>
  );
}

export default Maintenance;
