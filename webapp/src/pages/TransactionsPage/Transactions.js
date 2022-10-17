import { useState } from "react";
import { useQuery } from "@apollo/client";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/transactionsQuery";
import currencyFormatter from "utils/currencyFormatter";
import Table from "components/Table";
import getTransactionType from "utils/getTransactionType";

function Transactions() {
  const { loading, error, data } = useQuery(query);
  const [selectedTransactionId, setSelectedTransactionId] = useState();

  if (loading) return null;
  if (error) return <div>Failed to fetch transactions</div>;

  const { transactions } = data;

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

  const rows = transactions.entries.map((transaction) => ({
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
    <TableContainer component={Paper} sx={{ maxWidth: 1200, height: 650 }}>
      <Table
        columns={columns}
        rows={rows}
        selectedId={selectedTransactionId}
        handleRowClick={handleRowClick}
        checkbox
      />
    </TableContainer>
  );
}

export { Transactions };
