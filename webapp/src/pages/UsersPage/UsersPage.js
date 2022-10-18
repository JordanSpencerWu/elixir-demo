import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";

import deleteUserMutation from "clients/graphql/mutations/deleteUserMutation";
import usersQuery from "clients/graphql/queries/usersQuery";
import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import pathTo from "utils/pathTo";

function UsersPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userId, setUserId] = useState();
  const [deleteUser] = useMutation(deleteUserMutation, {
    refetchQueries: [{ query: usersQuery }],
    onCompleted: (data) => {
      const { deleteUser } = data;

      if (userId === deleteUser.id) {
        setUserId(null);
      }
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteUser({ variables: { id: userId } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
    navigate(pathTo.users, { replace: true });
  }

  return (
    <>
      <DeleteDialog
        open={openDeleteDialog}
        deleteMessage="Are you sure you want to delete this user?"
        handleClose={handleClose}
        handleAgree={handleAgree}
      />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Outlet context={{ userId, setUserId, setOpenDeleteDialog }} />
      </Box>
    </>
  );
}

export default UsersPage;
