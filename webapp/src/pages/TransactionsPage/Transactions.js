import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/transactionsQuery";
import currencyFormatter from "utils/currencyFormatter";
import Table from "components/Table";
import getTransactionType from "utils/getTransactionType";
import TableToolbar from "components/TableToolbar";

function Transactions() {
  const { loading, error, data } = useQuery(query);
  const {
    selectTransaction,
    setSelectTransaction,
    setOpenDeleteDialog,
    setOpenTransactionFormModal,
  } = useOutletContext();

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

  function handleRowClick(id) {
    if (id == selectTransaction?.id) {
      setSelectTransaction({});
    } else {
      const transaction = transactions.entries.find(
        (transaction) => transaction.id == id
      );
      setSelectTransaction(transaction);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleAddOrEditClick = () => {
    setOpenTransactionFormModal(true);
  };

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <TableToolbar
        label="Transactions"
        open={!!selectTransaction?.id}
        handleDeleteClick={handleDeleteClick}
        handleAddClick={handleAddOrEditClick}
        handleEditClick={handleAddOrEditClick}
      />
      <TableContainer sx={{ height: 650 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectTransaction?.id}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
    </Paper>
  );
}

export { Transactions };
