import axios from "axios";
import React, { useState, useEffect } from "react";
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
import moment from "moment";
import { useParams } from "react-router-dom";
import Edit_Depreciation from "./edit_depreciation";

const baseApiUrl = "http://localhost:8081/api";

function Depreciation({ asset_id }) {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  const [currentYear] = useState(moment().format("YYYY"));

  const readAsset = async () => {
    try {
      const response = await axios.get(`${baseApiUrl}/asset/get/${id}`);
      setData(response.data.Result);
    } catch (error) {
      console.error(error);
    }
  };

  const editData = () => {};

  // const getDepreciations = (year, amount, percentage, asset_purchaseDate) => {
  //   let depreciation = [];
  //   let currentAmount = amount;
  //   depreciation.push({
  //     year: moment(asset_purchaseDate).format("YYYY"),
  //     depreciationCost: 0,
  //     amount: amount,
  //   });
  //   for (let i = 0; i < year; i++) {
  //     let newAmount = currentAmount - (currentAmount * percentage) / 100;
  //     const data = {
  //       year: moment(asset_purchaseDate)
  //         .add(i + 1, "y")
  //         .format("YYYY"),
  //       amount: newAmount,
  //       depreciationCost: currentAmount - newAmount,
  //     };
  //     depreciation.push(data);
  //     currentAmount = newAmount;
  //   }
  //   return depreciation;
  // };

  // const yearlyDepreciationData = data.map((item) => {
  //   const depreciatedCost = getDepreciations(
  //     item.asset_life,
  //     item.asset_Cost,
  //     item.depreciation_percentage,
  //     item.asset_purchaseDate
  //   );

  //   return {
  //     year: item.asset_life,
  //     asset_Cost: item.asset_Cost,
  //     depreciation_percentage: item.depreciation_percentage,
  //     depreciatedCost: depreciatedCost,
  //   };
  // });

  const getDepreciations = (year, amount, percentage, asset_purchaseDate) => {
    let depreciation = [];
    let currentAmount = amount;
    depreciation.push({
      year: moment(asset_purchaseDate).format("YYYY"),
      depreciationCost: 0,
      amount: amount,
    });
    for (let i = 0; i < year; i++) {
      let newAmount = currentAmount - (currentAmount * percentage) / 100;
      const data = {
        year: moment(asset_purchaseDate)
          .add(i + 1, "y")
          .format("YYYY"),
        amount: newAmount,
        depreciationCost: currentAmount - newAmount,
      };
      depreciation.push(data);

      if (data.year === moment().format("YYYY")) {
        break;
      }

      currentAmount = newAmount;
    }
    return depreciation;
  };

  const yearlyDepreciationData = data.map((item) => {
    const depreciatedCost = getDepreciations(
      item.asset_life,
      item.asset_Cost,
      item.depreciation_percentage,
      item.asset_purchaseDate
    );

    return {
      year: item.asset_life,
      asset_Cost: item.asset_Cost,
      depreciation_percentage: item.depreciation_percentage,
      depreciatedCost: depreciatedCost,
    };
  });

  useEffect(() => {
    readAsset();
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
        <Typography
          style={{
            fontSize: "20px",
            marginBottom: "10px",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Depreciation
        </Typography>
        <Button
          onClick={() => setModal(true)}
          style={{ marginBottom: "10px" }}
          variant="contained"
          color="warning"
          size="small"
        >
          Manage
        </Button>
      </div>

      <Edit_Depreciation
        modal={modal}
        asset_id={asset_id}
        toggle={() => setModal(false)}
        assetData={data[0]}
        readata={readAsset}
      />

      <Grid item xs={3} style={{ marginBottom: "10px" }}>
        <Table size="small">
          <TableHead className="tableHead" key={"tableHead"}>
            <TableRow>
              <TableCell
                style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
              >
                Acquired Date
              </TableCell>
              <TableCell
                style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
              >
                Depreciation Percentage (%)
              </TableCell>
              <TableCell
                style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
              >
                Asset Life (Year)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  {moment(item.asset_purchaseDate).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  {item.depreciation_percentage}
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  {item.asset_life}
                </TableCell>
                {/* <TableCell>
                  <EditOutlinedIcon
                    variant="outlined"
                    color="success"
                    onClick={() => handleEdit(item)}
                    style={{ marginLeft: "10px" }}
                  />
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      <Divider />
      <Typography
        style={{
          fontSize: "20px",
          marginBottom: "10px",
          marginTop: "10px",
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        Depreciation (yearly)
      </Typography>
      <Table size="small">
        <TableHead className="tableHead" key={"tableHead"}>
          <TableRow>
            <TableCell
              style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
            >
              Year
            </TableCell>
            <TableCell
              style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
            >
              Asset Cost
            </TableCell>
            <TableCell
              style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
            >
              Depreciation Percentage (%)
            </TableCell>
            <TableCell
              style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
            >
              Depreciation Cost
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {yearlyDepreciationData.map((item, index) =>
            item.depreciatedCost.map((depreciation) => (
              <TableRow
                key={index}
                style={{
                  background:
                    depreciation.year === currentYear
                      ? "#ffcccb"
                      : "transparent",
                }}
              >
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  {depreciation.year}
                </TableCell>{" "}
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  {" "}
                  {depreciation.amount.toFixed()}
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  {/* {depreciation.depreciation_percentage}{" "} */}
                  {item.depreciation_percentage}
                </TableCell>
                <TableCell
                  style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                >
                  {depreciation.depreciationCost.toFixed()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default Depreciation;
