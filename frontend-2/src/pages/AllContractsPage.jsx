import React, { useState } from "react";
import { fetchTestContract } from "../api";
import { formatDate, formatId } from "../utils/stringHelper";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Container,
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import { API_ROUTE_CONTRACT } from "../utils/constants";
import ExportButton from "../components/ExportButton";
import ImportButton from "../components/ImportButton";

const rowHeaders = ["ID", "Period", "Customer", "Apartment"];

const AllContractsPage = () => {
  const [contracts, setContracts] = useState([]);

  React.useEffect(() => {
    // fetchApartmentsAPI().then((data) => setApartments(data.apartments));
    //  fetchTestApartment().then((data)=> setApartments(data.apartments))
    setContracts(fetchTestContract);
  }, []);

  return (
    <Container>
      <PageHeader>Contracts</PageHeader>
      <Container
        sx={{
          display: "flex",
          justifyContent: "end",
          justifyItems: "flex-end",
        }}
      >
        <ExportButton exportType={API_ROUTE_CONTRACT} />
        <ImportButton importType={API_ROUTE_CONTRACT} />
      </Container>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {rowHeaders.map((item) => (
                <TableCell key={item}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((item) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{formatId(item.id)}</TableCell>
                <TableCell>
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </TableCell>
                <TableCell>
                  {/* <p>{item.customer.id}</p> */}
                  <p>
                    {item.customer.firstName}, {item.customer.lastName}
                  </p>
                  <p>{item.customer.address}</p>
                  <p>{item.customer.status}</p>
                </TableCell>
                <TableCell>
                  {/* <p>{item.apartment.id}</p> */}
                  <p>{item.apartment.address}</p>
                  <p>{item.apartment.retailPrice}</p>
                  <p>{item.apartment.numberOfRoom}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AllContractsPage;
