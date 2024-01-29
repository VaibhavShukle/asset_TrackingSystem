import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Label, Toast } from "reactstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Edit_Depreciation = ({ modal, asset_id, toggle, assetData, readata }) => {
  const [data, setData] = useState({
    depreciation_percentage: assetData?.depreciation_percentage || "",
    asset_life: assetData?.asset_life || "",
  });

  const handleEdit = () => {
    axios
      .put(`http://localhost:8081/api/asset/updateAsset/${asset_id}`, data)
      .then((res) => {
        if (res.data.Status === "Success") {
          toggle();
          // assetData();
          readata();
          toast("Asset Update Successfully.", {
            type: "success",
            autoClose: 1500,
            theme: "dark",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!assetData) return;
    setData({
      depreciation_percentage: assetData.depreciation_percentage,
      asset_life: assetData.asset_life,
    });
  }, [assetData]);

  return (
    <Dialog open={modal} onClose={toggle}>
      {data?.asset_id ? (
        <DialogTitle>Edit Asset Depreciation</DialogTitle>
      ) : (
        <>
          <DialogContent>
            <>
              <Label>Depreciation Percentage</Label>
              <TextField
                fullWidth
                type="text"
                value={data?.depreciation_percentage}
                onChange={(e) =>
                  setData({
                    ...data,
                    depreciation_percentage: e.target.value,
                  })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <b>%</b>
                    </InputAdornment>
                  ),
                }}
              />
              <Label>Asset Life (Year)</Label>
              <TextField
                fullWidth
                type="text"
                value={data.asset_life}
                onChange={(e) =>
                  setData({
                    ...data,
                    asset_life: e.target.value,
                  })
                }
              />
            </>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Button onClick={toggle} color="error" variant="contained">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleEdit(data.asset_id);
            readata();
          }}
          variant="contained"
          color="warning"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Edit_Depreciation;
