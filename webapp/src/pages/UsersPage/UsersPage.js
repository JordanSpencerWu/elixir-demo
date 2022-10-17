import { useState } from "react";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/usersQuery";
import Table from "components/Table";

function UsersPage() {
  const { loading, error, data } = useQuery(query);
  const [selectedUserId, setSelectedUserId] = useState();

  if (loading) return <div>Loading</div>;
  if (error) return <div>Failed to fetch users</div>;

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

  const rows = data.users.entries.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    dob: user.dob,
  }));

  function handleRowClick(userId) {
    if (userId == selectedUserId) {
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
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
          selectedId={selectedUserId}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
    </Box>
  );
}

export default UsersPage;
