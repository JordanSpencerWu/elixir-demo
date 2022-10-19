import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useMutation } from "@apollo/client";
import moment from "moment";
import Box from "@mui/material/Box";

import deleteUserMutation from "clients/graphql/mutations/deleteUserMutation";
import createUserMutation from "clients/graphql/mutations/createUserMutation";
import updateUserMutation from "clients/graphql/mutations/updateUserMutation";
import { operationName as UsersOperationName } from "clients/graphql/queries/usersQuery";

import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import { AppStateContext } from "providers/AppStateProvider";

import UserFormModal from "./UserFormModal";

function UsersPage() {
  const {
    state,
    usersActions: { setSelected: setSelectedUser },
    snackbarActions: { openSnackbar },
  } = useContext(AppStateContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUserFormModal, setOpenUserFormModal] = useState(false);
  const selectedUser = state.users.selected;

  const [deleteUser] = useMutation(deleteUserMutation, {
    refetchQueries: [UsersOperationName],
    onCompleted: (data) => {
      const { deleteUser } = data;

      if (selectedUser.id === deleteUser.id) {
        setSelectedUser({});
      }

      openSnackbar("successfully deleted user");
    },
  });

  const [createUser] = useMutation(createUserMutation, {
    refetchQueries: [UsersOperationName],
    onCompleted: () => {
      setOpenUserFormModal(false);
      openSnackbar("successfully created user");
    },
  });

  const [updateUser] = useMutation(updateUserMutation, {
    refetchQueries: [UsersOperationName],
    onCompleted: () => {
      setOpenUserFormModal(false);
      openSnackbar("successfully updated user");
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteUser({ variables: { id: selectedUser.id } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleUserFormModelClose() {
    setOpenUserFormModal(false);
  }

  function handleSubmit(formUser) {
    const dob = moment(formUser.dob);
    const options = {
      variables: {
        ...formUser,
        dob: dob.format("YYYY-MM-DD"),
      },
    };
    if (formUser.id) {
      updateUser(options);
    } else {
      createUser(options);
    }
  }

  return (
    <>
      <UserFormModal
        open={openUserFormModal}
        handleClose={handleUserFormModelClose}
        handleSubmit={handleSubmit}
        user={selectedUser}
      />
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
        <Outlet
          context={{
            selectedUser,
            setSelectedUser,
            setOpenDeleteDialog,
            setOpenUserFormModal,
          }}
        />
      </Box>
    </>
  );
}

export default UsersPage;
