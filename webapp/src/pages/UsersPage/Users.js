import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

import query from "clients/graphql/queries/usersQuery";
import Table from "components/Table";
import TableToolbar from "components/TableToolbar";
import TablePaginationActions from "components/TablePaginationActions";

function Users() {
  const [pageResult, setPageResult] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
  ];

  const rows = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    dob: user.dob,
  }));

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

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <Box sx={{ m: 2, display: "flex" }}>
        <FormControl sx={{ width: 300, mr: 2 }}>
          <TextField
            fullWidth
            id="outlined-search"
            label="Search by user first name"
            type="search"
          />
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <TextField
            fullWidth
            id="outlined-search"
            label="Search by user last name"
            type="search"
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
