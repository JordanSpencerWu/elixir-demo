import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/usersQuery";
import Table from "components/Table";
import TableToolbar from "components/TableToolbar";

function Users() {
  const { loading, error, data } = useQuery(query);
  const {
    selectedUser,
    setSelectedUser,
    setOpenDeleteDialog,
    setOpenUserFormModal,
  } = useOutletContext();

  if (loading) return null;
  if (error) return <div>Failed to fetch users</div>;

  const { users } = data;

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

  const rows = users.entries.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    dob: user.dob,
  }));

  function handleRowClick(id) {
    if (id == selectedUser?.id) {
      setSelectedUser({});
    } else {
      const user = users.entries.find((user) => user.id == id);
      setSelectedUser(user);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleAddOrEditClick = () => {
    setOpenUserFormModal(true);
  };

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <TableToolbar
        label="Users"
        open={!!selectedUser?.id}
        handleDeleteClick={handleDeleteClick}
        handleAddClick={handleAddOrEditClick}
        handleEditClick={handleAddOrEditClick}
      />
      <TableContainer sx={{ height: 650 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectedUser?.id}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
    </Paper>
  );
}

export { Users };
