import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Label } from "reactstrap";

const Add_Maintenance = ({ modal, toggle, readData, editData }) => {
  const [updatedFields, setUpdatedFields] = useState([]);
  const [data, setData] = useState({
    main_id: "",
    main_title: "",
    main_details: "",
    main_date: "",
    main_by: "",
    mainStatus_id: "",
    main_complete: "",
    main_cost: "",
    main_warranty: "",
  });
  const [data1, setData1] = useState({
    main_id: "",
    main_title: "",
    main_details: "",
    main_date: "",
    main_by: "",
    mainStatus_id: "",
    main_complete: "",
    main_cost: "",
    main_warranty: "",
  });

  useEffect(() => {
    setData({
      main_id: "",
      main_title: "",
      main_details: "",
      main_date: "",
      main_by: "",
      mainStatus_id: "",
      main_complete: "",
      main_cost: "",
      main_warranty: "",
    });
  }, [modal]);

  useEffect(() => {
    setData(editData);
    setData1(editData);
  }, [editData]);

  const { id } = useParams();

  // const handleEdit = () => {
  //   axios
  //     .put(
  //       `http://localhost:8081/api/maintenance/updateMaintenance/${data.main_id}`,
  //       data,
  //       {}
  //     )
  //     .then((res) => {
  //       if (res.data.Status === "Success") {
  //         toggle();
  //         readData();
  //         toast("Maintenance Update Successfully.", {
  //           type: "success",
  //           autoClose: 1500,
  //           theme: "dark",
  //         });
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const handleEdit = () => {
    const previousData = { ...data };

    const updatedData = {
      ...data,
      updatedFields: updatedFields,
    };

    console.log(updatedData);

    axios
      .put(
        `http://localhost:8081/api/maintenance/updateMaintenance/${data.main_id}`,
        updatedData,
        {}
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("Maintenance Update Successfully.", {
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
      .post(`http://localhost:8081/api/maintenance/add_maintenance/${id}`, data)
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          readData();
          toast("Maintenance Added Successfully.", {
            type: "success",
            autoClose: 1500,
            theme: "dark",
          });
          setData({
            main_title: "",
            main_details: "",
            main_date: "",
            main_by: "",
            mainStatus_name: "",
            main_complete: "",
            main_cost: "",
            main_warranty: "",
          });
        }
      })
      .catch((err) => {
        console.error("Error during API call:", err);
        toast("Error adding maintenance.", { type: "error" });
      });
  };

  const [mainStatusOptions, setMainStatusOptions] = useState([]);
  //   const [vendorOptions, setVendorOptions] = useState([]);

  const getMainStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/main_status/getMain_Status`
      );

      if (response.data.Status) {
        const options = response.data.Result.map((main_status) => ({
          value: main_status.mainStatus_id,
          label: main_status.mainStatus_name,
        }));

        setMainStatusOptions(options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //   const getVendor = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8081/api/vendor/getvendor/active"
  //       );

  //       if (response.data.Status) {
  //         const options = response.data.Result.map((vendor) => ({
  //           value: vendor.v_id,
  //           label: vendor.v_name,
  //         }));

  //         setVendorOptions(options);
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };

  const handleUpdatedFields = (attribute, value, title) => {
    const updatedFieldsCopy = [...updatedFields];
    const index = updatedFieldsCopy.findIndex((x) => x.attribute == attribute);
    if (index != -1) {
      console.log(data1[attribute], value);
      if (data1[attribute] != value) {
        updatedFieldsCopy[index]["attribute"] = attribute;
        updatedFieldsCopy[index]["title"] = title;
        updatedFieldsCopy[index]["changedFrom"] = data1[attribute];
        updatedFieldsCopy[index]["changedTo"] = value;
      } else {
        updatedFieldsCopy.splice(index, 1);
      }
    } else {
      if (data1[attribute] != value) {
        let obj = {};
        obj["attribute"] = attribute;
        obj["title"] = title;
        obj["changedFrom"] = data1[attribute];
        obj["changedTo"] = value;
        updatedFieldsCopy.push(obj);
      }
    }

    setUpdatedFields(updatedFieldsCopy);
  };

  console.log(updatedFields);

  useEffect(() => {
    getMainStatus();
    // getVendor();
  }, []);

  return (
    <Dialog open={modal} onClose={toggle}>
      {!data?.main_id ? (
        <DialogTitle>Add Maintenance</DialogTitle>
      ) : (
        <DialogTitle>Edit Maintenance</DialogTitle>
      )}
      <DialogContent>
        <DialogContentText>
          Please fill in the information for the new Maintenance.
        </DialogContentText>
        <Label>Title</Label>
        <TextField
          autoFocus
          margin="dense"
          type="text"
          fullWidth
          value={data.main_title}
          onChange={(e) => {
            setData({ ...data, main_title: e.target.value });
            handleUpdatedFields("main_title", e.target.value, "Main Title");
          }}
        />
        <Label>Details</Label>
        <TextField
          margin="dense"
          type="text"
          fullWidth
          value={data.main_details}
          onChange={(e) => {
            setData({ ...data, main_details: e.target.value });
            handleUpdatedFields(
              "main_details",
              e.target.value,
              "Maitenance Details"
            );
          }}
        />
        <Label>Due Date</Label>
        <TextField
          margin="dense"
          type="date"
          fullWidth
          value={data.main_date}
          onChange={(e) => {
            setData({ ...data, main_date: e.target.value });
            handleUpdatedFields("main_date", e.target.value, "Maitenance Date");
          }}
        />
        <Label>Maintenance By</Label>
        <TextField
          margin="dense"
          type="text"
          fullWidth
          value={data.main_by}
          onChange={(e) => {
            setData({ ...data, main_by: e.target.value });
            handleUpdatedFields("main_by", e.target.value, "Maitenance By");
          }}
        />

        <Label>Maintenance Status</Label>
        <FormControl fullWidth>
          <InputLabel id="location-dropdown-label"></InputLabel>
          <Select
            labelId="location-dropdown-label"
            id="location-dropdown"
            value={data.selectedMaintenanceId}
            onChange={(e) => {
              const selectedMaintenanceId = e.target.value;

              {
                setData({
                  ...data,
                  mainStatus_id: selectedMaintenanceId,
                  selectedMaintenanceId,
                });
                handleUpdatedFields(
                  "mainStatus_id",
                  e.target.value,
                  "Maitenance Status"
                );
              }
            }}
          >
            {mainStatusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Label>Date completed</Label>
        <TextField
          margin="dense"
          type="date"
          fullWidth
          value={data.main_complete}
          onChange={(e) => {
            setData({ ...data, main_complete: e.target.value });
            handleUpdatedFields(
              "main_complete",
              e.target.value,
              "Maitenance Complete Date"
            );
          }}
        />
        <Label>Maintenance Cost</Label>
        <TextField
          margin="dense"
          type="number"
          fullWidth
          value={data.main_cost}
          onChange={(e) => {
            setData({ ...data, main_cost: e.target.value });
            handleUpdatedFields("main_cost", e.target.value, "Maitenance Cost");
          }}
        />
        <Label>Maintenance Warranty</Label>
        <TextField
          margin="dense"
          type="date"
          fullWidth
          value={data.main_warranty}
          onChange={(e) => {
            setData({ ...data, main_warranty: e.target.value });
            handleUpdatedFields(
              "main_warranty",
              e.target.value,
              "Maitenance Warranty"
            );
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} color="error" variant="contained">
          Cancel
        </Button>
        {!data?.main_id ? (
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

export default Add_Maintenance;
