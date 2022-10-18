import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import moment from "moment";

import deleteUserMutation from "clients/graphql/mutations/deleteUserMutation";
import createUserMutation from "clients/graphql/mutations/createUserMutation";
import updateUserMutation from "clients/graphql/mutations/updateUserMutation";
import usersQuery from "clients/graphql/queries/usersQuery";

import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import pathTo from "utils/pathTo";

import UserFormModal from "./UserFormModal";
import { IosShare } from "@mui/icons-material";

function UsersPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUserFormModal, setOpenUserFormModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  const [deleteUser] = useMutation(deleteUserMutation, {
    refetchQueries: [{ query: usersQuery }],
    onCompleted: (data) => {
      const { deleteUser } = data;

      if (selectedUser?.id === deleteUser.id) {
        setSelectedUser({});
      }
    },
  });

  const [createUser] = useMutation(createUserMutation, {
    refetchQueries: [{ query: usersQuery }],
    onCompleted: () => {
      setOpenUserFormModal(false);
    },
  });

  const [updateUser] = useMutation(updateUserMutation, {
    refetchQueries: [{ query: usersQuery }],
    onCompleted: () => {
      setOpenUserFormModal(false);
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteUser({ variables: { id: selectedUser?.id } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
    navigate(pathTo.users, { replace: true });
  }

  function handleUserFormModelClose() {
    setOpenUserFormModal(false);
  }

  function handleSubmit(formUser) {
    const dob = moment(formUser.dob);
    if (formUser.id) {
      const options = {
        variables: {
          ...formUser,
          dob: dob.format("YYYY-MM-DD"),
        },
      };
      updateUser(options);
    } else {
      const options = {
        variables: {
          ...formUser,
          dob: dob.format("YYYY-MM-DD"),
        },
      };
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
