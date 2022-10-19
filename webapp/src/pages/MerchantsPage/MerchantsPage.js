import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";

import deleteMerchantMutation from "clients/graphql/mutations/deleteMerchantMutation";
import { operationName as merchantsOperationName } from "clients/graphql/queries/merchantsQuery";
import createMerchantMutation from "clients/graphql/mutations/createMerchantMutation";
import updateMerchantMutation from "clients/graphql/mutations/updateMerchantMutation";

import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import { AppStateContext } from "providers/AppStateProvider";

import MerchantFormModal from "./MerchantFormModal";

function MerchantsPage() {
  const {
    state,
    merchantsActions: { setSelected: setSelectedMerchant },
    snackbarActions: { openSnackbar },
  } = useContext(AppStateContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMerchantFormModal, setOpenMerchantFormModal] = useState(false);
  const selectedMerchant = state.merchants.selected;

  const [deleteMerchant] = useMutation(deleteMerchantMutation, {
    refetchQueries: [merchantsOperationName],
    onCompleted: (data) => {
      const { deleteMerchant } = data;

      if (selectedMerchant.id === deleteMerchant.id) {
        setSelectedMerchant({});
      }

      openSnackbar("successfully deleted merchant");
    },
  });

  const [createMerchant] = useMutation(createMerchantMutation, {
    refetchQueries: [merchantsOperationName],
    onCompleted: () => {
      setOpenMerchantFormModal(false);
      openSnackbar("successfully created merchant");
    },
  });

  const [updateMerchant] = useMutation(updateMerchantMutation, {
    refetchQueries: [merchantsOperationName],
    onCompleted: () => {
      setOpenMerchantFormModal(false);
      openSnackbar("successfully updated merchant");
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteMerchant({ variables: { id: selectedMerchant.id } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleMerchantFormModelClose() {
    setOpenMerchantFormModal(false);
  }

  function handleSubmit(formMerchant) {
    const options = {
      variables: {
        ...formMerchant,
      },
    };
    if (formMerchant.id) {
      updateMerchant(options);
    } else {
      createMerchant(options);
    }
  }

  return (
    <>
      <MerchantFormModal
        open={openMerchantFormModal}
        handleClose={handleMerchantFormModelClose}
        handleSubmit={handleSubmit}
        merchant={selectedMerchant}
      />
      <DeleteDialog
        open={openDeleteDialog}
        deleteMessage="Are you sure you want to delete this merchant?"
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
            selectedMerchant,
            setSelectedMerchant,
            setOpenDeleteDialog,
            setOpenMerchantFormModal,
          }}
        />
      </Box>
    </>
  );
}

export default MerchantsPage;
