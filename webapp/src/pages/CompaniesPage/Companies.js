import { useEffect, useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

import query from "clients/graphql/queries/companiesQuery";
import currencyFormatter from "utils/currencyFormatter";
import Table from "components/Table";
import TableToolbar from "components/TableToolbar";
import TablePaginationActions from "components/TablePaginationActions";
import { AppStateContext } from "providers/AppStateProvider";

function Companies() {
  const {
    state,
    companiesActions: { setPage, setRowsPerPage, setSearchByName },
  } = useContext(AppStateContext);
  const [pageResult, setPageResult] = useState();

  const page = state.companies.page;
  const rowsPerPage = state.companies.rowsPerPage;
  const searchByName = state.companies.searchByName;

  let variables = {
    limit: rowsPerPage,
    skip: page * rowsPerPage,
    search: {
      searchByName,
    },
  };

  if (rowsPerPage === -1) {
    delete variables["limit"];
    delete variables["skip"];
  }

  if (searchByName === "") {
    delete variables["search"];
  }

  const { data } = useQuery(query, { variables });
  const {
    selectedCompany,
    setSelectedCompany,
    setOpenDeleteDialog,
    setOpenCompanyFormModal,
  } = useOutletContext();

  useEffect(() => {
    if (data) {
      setPageResult(data.companies);
    }
  }, [data]);

  const companies = pageResult?.entries ?? [];
  const totalRows = pageResult?.totalRows ?? 0;

  const columns = [
    {
      id: "id",
      label: "id",
    },
    {
      id: "companyName",
      label: "company name",
    },
    {
      id: "availableCredit",
      label: "available credit",
      align: "right",
    },
    {
      id: "creditLine",
      label: "credit line",
      align: "right",
    },
  ];

  const rows = companies.map((company) => ({
    id: company.id,
    companyName: company.name,
    availableCredit: currencyFormatter(company.availableCredit),
    creditLine: currencyFormatter(company.creditLine),
  }));

  function handleRowClick(id) {
    if (id == selectedCompany?.id) {
      setSelectedCompany({});
    } else {
      const company = companies.find((company) => company.id == id);
      setSelectedCompany(company);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleAddOrEditClick = () => {
    setOpenCompanyFormModal(true);
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
      <Box sx={{ m: 2, display: "flex" }}>
        <FormControl sx={{ width: 500 }}>
          <TextField
            fullWidth
            id="outlined-search"
            label="Search by company name"
            type="search"
            value={searchByName}
            onChange={(e) => setSearchByName(e.target.value)}
          />
        </FormControl>
      </Box>
      <TableToolbar
        label="Companies"
        open={!!selectedCompany?.id}
        handleDeleteClick={handleDeleteClick}
        handleAddClick={handleAddOrEditClick}
        handleEditClick={handleAddOrEditClick}
      />
      <TableContainer sx={{ height: 600 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectedCompany?.id}
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

export { Companies };
