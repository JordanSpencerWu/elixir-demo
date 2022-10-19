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

import query from "clients/graphql/queries/usersQuery";
import companiesQuery from "clients/graphql/queries/companiesQuery";

import Table from "components/Table";
import TableToolbar from "components/TableToolbar";
import TablePaginationActions from "components/TablePaginationActions";
import { AppStateContext } from "providers/AppStateProvider";
import displayName from "utils/displayName";

const columns = [
  {
    id: "id",
    label: "id",
  },
  {
    id: "firstName",
    label: "first name",
  },
  {
    id: "lastName",
    label: "last name",
  },
  {
    id: "dob",
    label: "date of birth",
  },
  {
    id: "companyName",
    label: "company",
  },
];

function Users() {
  const {
    state,
    usersActions: {
      setPage,
      setRowsPerPage,
      setSearchByFirstName,
      setSearchByLastName,
      setFilterByCompanyId,
    },
  } = useContext(AppStateContext);
  const [pageResult, setPageResult] = useState();

  const page = state.users.page;
  const rowsPerPage = state.users.rowsPerPage;
  const searchByFirstName = state.users.searchByFirstName;
  const searchByLastName = state.users.searchByLastName;
  const filterByCompanyId = state.users.filterByCompanyId;

  const filter = {
    companyId: filterByCompanyId,
  };

  if (!filterByCompanyId) {
    delete filter["companyId"];
  }

  const search = {
    searchByFirstName,
    searchByLastName,
  };

  if (searchByFirstName === "") {
    delete search["searchByFirstName"];
  }

  if (searchByLastName === "") {
    delete search["searchByLastName"];
  }

  const variables = {
    limit: rowsPerPage,
    skip: page * rowsPerPage,
    search,
    filter,
  };

  if (rowsPerPage === -1) {
    delete variables["limit"];
    delete variables["skip"];
  }

  const { data } = useQuery(query, {
    variables,
    fetchPolicy: "cache-and-network",
  });
  const { data: companiesData } = useQuery(companiesQuery);
  const companies = companiesData?.companies.entries ?? [];
  const {
    selectedUser,
    setSelectedUser,
    setOpenDeleteDialog,
    setOpenUserFormModal,
  } = useOutletContext();

  useEffect(() => {
    if (data) {
      setPageResult(data.users);
    }
  }, [data]);

  const users = pageResult?.entries ?? [];
  const totalRows = pageResult?.totalRows ?? 0;

  const rows = users.map((user) => ({
    id: user.id,
    companyName: displayName(user.company.name, user.company.deleted),
    firstName: user.firstName,
    lastName: user.lastName,
    dob: user.dob,
  }));

  const companyOptions = companies.map((company) => company.name);

  function handleRowClick(id) {
    if (id == selectedUser?.id) {
      setSelectedUser({});
    } else {
      const user = users.find((user) => user.id == id);
      setSelectedUser(user);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleAddOrEditClick = () => {
    setOpenUserFormModal(true);
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

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <Box sx={{ m: 2, display: "flex" }}>
        <FormControl sx={{ width: 300, mr: 2 }}>
          <TextField
            fullWidth
            id="search-by-first-name"
            label="Search by user first name"
            type="search"
            value={searchByFirstName}
            onChange={(e) => setSearchByFirstName(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: 300, mr: 2 }}>
          <TextField
            fullWidth
            id="search-by-last-name"
            label="Search by user last name"
            type="search"
            value={searchByLastName}
            onChange={(e) => setSearchByLastName(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: 300 }}>
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
      </Box>
      <TableToolbar
        label="Users"
        open={!!selectedUser?.id}
        handleDeleteClick={handleDeleteClick}
        handleAddClick={handleAddOrEditClick}
        handleEditClick={handleAddOrEditClick}
      />
      <TableContainer sx={{ height: 600 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectedUser?.id}
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

export { Users };
