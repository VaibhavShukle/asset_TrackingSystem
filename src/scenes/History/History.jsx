import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
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

function History() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const readHistory = async () => {
    await axios
      .get(`http://localhost:8081/api/history/getHistory/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    readHistory();
  }, []);

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

            fontWeight: 600,
          }}
        >
          History
        </Typography>
      </div>
      <Divider />

      <Grid item xs={3} style={{ marginBottom: "10px" }}>
        {data.length > 0 ? (
          <Table
            stickyHeader
            aria-label="sticky table"
            style={{ border: "1px solid #EBEDF3" }}
            size="small"
          >
            <TableHead className="tableHead" key={"tableHead"}>
              <TableRow style={{ border: "1px solid #EBEDF3" }}>
                <TableCell
                  style={{
                    border: "1px solid #EBEDF3",
                    backgroundColor: "#fcf8e3",
                    fontSize: "14px",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #EBEDF3",
                    backgroundColor: "#fcf8e3",
                    fontSize: "14px",
                  }}
                >
                  Event
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #EBEDF3",
                    backgroundColor: "#fcf8e3",
                    fontSize: "14px",
                  }}
                >
                  Field
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #EBEDF3",
                    backgroundColor: "#fcf8e3",
                    fontSize: "14px",
                  }}
                >
                  Changed From
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #EBEDF3",
                    backgroundColor: "#fcf8e3",
                    fontSize: "14px",
                  }}
                >
                  Changed To
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((data) => (
                <TableRow style={{ border: "1px solid #EBEDF3" }}>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {moment(data.date).format("DD/MM/YYYY HH:MM A")}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.event}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.field}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.changedFrom}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #EBEDF3", fontSize: "14px" }}
                  >
                    {data.changedTo}
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
            <b>No History Available.</b>
          </Typography>
        )}
      </Grid>
    </>
  );
}

export default History;
