import { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";

import query from "clients/graphql/queries/transactionsQuery";
import companiesQuery from "clients/graphql/queries/companiesQuery";
import merchantsQuery from "clients/graphql/queries/merchantsQuery";
import usersQuery from "clients/graphql/queries/usersQuery";

import currencyFormatter from "utils/currencyFormatter";
import Table from "components/Table";
import getTransactionType from "utils/getTransactionType";
import TableToolbar from "components/TableToolbar";
import TablePaginationActions from "components/TablePaginationActions";

import { AppStateContext } from "providers/AppStateProvider";
import displayName from "utils/displayName";

import { getUserName } from "./TransactionFormModal";

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
    id: "companyName",
    label: "company name",
  },
  {
    id: "merchantName",
    label: "merchant name",
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

function Transactions() {
  const {
    state,
    transactionsActions: {
      setPage,
      setRowsPerPage,
      setFilterByCompanyId,
      setFilterByMerchantId,
      setFilterByUserId,
    },
  } = useContext(AppStateContext);
  const [pageResult, setPageResult] = useState();

  const page = state.transactions.page;
  const rowsPerPage = state.transactions.rowsPerPage;
  const filterByCompanyId = state.transactions.filterByCompanyId;
  const filterByMerchantId = state.transactions.filterByMerchantId;
  const filterByUserId = state.transactions.filterByUserId;

  const filter = {
    companyId: filterByCompanyId,
    merchantId: filterByMerchantId,
    userId: filterByUserId,
  };

  if (!filterByCompanyId) {
    delete filter["companyId"];
  }

  if (!filterByMerchantId) {
    delete filter["merchantId"];
  }

  if (!filterByUserId) {
    delete filter["userId"];
  }

  let variables = {
    limit: rowsPerPage,
    skip: page * rowsPerPage,
    filter,
  };

  if (rowsPerPage === -1) {
    delete variables["limit"];
    delete variables["skip"];
  }

  if (rowsPerPage === -1) {
    queryOptions = {};
  }

  const { data } = useQuery(query, {
    variables,
    fetchPolicy: "cache-and-network",
  });
  const { data: companiesData } = useQuery(companiesQuery);
  const companies = companiesData?.companies.entries ?? [];
  const { data: merchantsData } = useQuery(merchantsQuery);
  const merchants = merchantsData?.merchants.entries ?? [];
  const { data: usersData } = useQuery(usersQuery);
  const users = usersData?.users.entries ?? [];

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

  const rows = transactions.map((transaction) => ({
    id: transaction.id,
    amount: currencyFormatter(transaction.amount),
    companyName: displayName(
      transaction.company.name,
      transaction.company.deleted
    ),
    merchantName: displayName(
      transaction.merchant.name,
      transaction.merchant.deleted
    ),
    userName: displayName(
      transaction.user.firstName + " " + transaction.user.lastName,
      transaction.user.deleted
    ),
    type: getTransactionType(transaction),
  }));

  const companyOptions = companies.map((company) => company.name);
  const merchantOptions = merchants.map((merchant) => merchant.name);
  const userOptions = users.map((user) => getUserName(user));

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

  const companyValue = filterByCompanyId
    ? companies.find((c) => c.id == filterByCompanyId)?.name
    : null;

  function handleCompanyOnChange(companyName) {
    const companyId = companies.find((c) => c.name == companyName)?.id;
    setFilterByCompanyId(companyId);
  }

  const merchantValue = filterByMerchantId
    ? merchants.find((m) => m.id == filterByMerchantId)?.name
    : null;

  function handleMerchantOnChange(merchantName) {
    const merchantId = merchants.find((m) => m.name == merchantName)?.id;
    setFilterByMerchantId(merchantId);
  }

  const userValue = filterByUserId
    ? getUserName(users.find((u) => u.id == filterByUserId))
    : null;

  function handleUserOnChange(userName) {
    const userId = users.find((u) => getUserName(u) == userName)?.id;
    setFilterByUserId(userId);
  }

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <Box sx={{ m: 2, display: "flex" }}>
        <FormControl sx={{ width: 300, mr: 2 }}>
          <Autocomplete
            freeSolo
            id="filter-by-company"
            options={companyOptions}
            fullWidth
            onChange={(e, companyName) => handleCompanyOnChange(companyName)}
            value={companyValue}
            renderInput={(params) => (
              <TextField {...params} label="Filter by company" />
            )}
          />
        </FormControl>
        <FormControl sx={{ width: 300, mr: 2 }}>
          <Autocomplete
            freeSolo
            id="filter-by-merchant"
            options={merchantOptions}
            fullWidth
            onChange={(e, companyName) => handleMerchantOnChange(companyName)}
            value={merchantValue}
            renderInput={(params) => (
              <TextField {...params} label="Filter by merchant" />
            )}
          />
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <Autocomplete
            freeSolo
            id="filter-by-user"
            options={userOptions}
            fullWidth
            onChange={(e, companyName) => handleUserOnChange(companyName)}
            value={userValue}
            renderInput={(params) => (
              <TextField {...params} label="Filter by user" />
            )}
          />
        </FormControl>
      </Box>
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
