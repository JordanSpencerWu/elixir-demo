import { useState } from "react";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/transactionsQuery";
import currencyFormatter from "utils/currencyFormatter";
import Table from "components/Table";
import getTransactionType from "utils/getTransactionType";

function TransactionsPage() {
  const { loading, error, data } = useQuery(query);
  const [selectedTransactionId, setSelectedTransactionId] = useState();

  if (loading) return <div>Loading</div>;
  if (error) return <div>Failed to fetch transactions</div>;

  const columns = [
    {
      id: "id",
      label: "id",
    },
    {
      id: "type",
      label: "type",
    },
    {
      id: "amount",
      label: "Amount",
      align: "right",
    },
  ];

  const rows = data.transactions.entries.map((transaction) => ({
    id: transaction.id,
    amount: currencyFormatter(transaction.amount),
    type: getTransactionType(transaction),
  }));

  function handleRowClick(transactionId) {
    if (transactionId == selectedTransactionId) {
      setSelectedTransactionId(null);
    } else {
      setSelectedTransactionId(transactionId);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TableContainer component={Paper} sx={{ maxWidth: 1200, height: 650 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectedTransactionId}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
    </Box>
  );
}

export default TransactionsPage;
