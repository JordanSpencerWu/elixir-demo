import { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/transactionsQuery";
import currencyFormatter from "utils/currencyFormatter";
import Table from "components/Table";
import getTransactionType from "utils/getTransactionType";
import TableToolbar from "components/TableToolbar";
import TablePaginationActions from "components/TablePaginationActions";
import { AppStateContext } from "providers/AppStateProvider";

function Transactions() {
  const {
    state,
    transactionsActions: { setPage, setRowsPerPage },
  } = useContext(AppStateContext);
  const [pageResult, setPageResult] = useState();

  const page = state.transactions.page;
  const rowsPerPage = state.transactions.rowsPerPage;

  let queryOptions = {
    variables: {
      limit: rowsPerPage,
      skip: page * rowsPerPage,
    },
  };

  if (rowsPerPage === -1) {
    queryOptions = {};
  }

  const { data } = useQuery(query, queryOptions);
  const {
    selectedTransaction,
    setSelectedTransaction,
    setOpenDeleteDialog,
    setOpenTransactionFormModal,
  } = useOutletContext();

  useEffect(() => {
    if (data) {
      setPageResult(data.transactions);
    }
  }, [data]);

  const transactions = pageResult?.entries ?? [];
  const totalRows = pageResult?.totalRows ?? 0;

  const columns = [
    {
      id: "id",
      label: "id",
    },
    {
      id: "userName",
      label: "user name",
    },
    {
      id: "merchantName",
      label: "merchant name",
    },
    {
      id: "companyName",
      label: "company name",
    },
    {
      id: "type",
      label: "type",
    },
    {
      id: "amount",
      label: "amount",
      align: "right",
    },
  ];

  const rows = transactions.map((transaction) => ({
    id: transaction.id,
    amount: currencyFormatter(transaction.amount),
    merchantName: transaction?.merchant ? transaction.merchant.name : "Deleted",
    userName: transaction?.user
      ? transaction.user.firstName + " " + transaction.user.lastName
      : "Deleted",
    companyName: transaction?.company ? transaction.company.name : "Deleted",
    type: getTransactionType(transaction),
  }));

  function handleRowClick(id) {
    if (id == selectedTransaction?.id) {
      setSelectedTransaction({});
    } else {
      const transaction = transactions.find(
        (transaction) => transaction.id == id
      );
      setSelectedTransaction(transaction);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleAddOrEditClick = () => {
    setOpenTransactionFormModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <TableToolbar
        label="Transactions"
        open={!!selectedTransaction?.id}
        handleDeleteClick={handleDeleteClick}
        handleAddClick={handleAddOrEditClick}
        handleEditClick={handleAddOrEditClick}
      />
      <TableContainer sx={{ height: 600 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectedTransaction?.id}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100, { label: "All", value: -1 }]}
        colSpan={3}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page",
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}

export { Transactions };
