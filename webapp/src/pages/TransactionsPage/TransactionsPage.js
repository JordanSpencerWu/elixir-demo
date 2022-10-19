import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";

import deleteTransactionMutation from "clients/graphql/mutations/deleteTransactionMutation";
import { operationName as transactionsOperationName } from "clients/graphql/queries/transactionsQuery";
import createTransactionMutation from "clients/graphql/mutations/createTransactionMutation";
import updateTransactionMutation from "clients/graphql/mutations/updateTransactionMutation";

import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import { AppStateContext } from "providers/AppStateProvider";

import TransactionFormModal from "./TransactionFormModal";

function TransactionsPage() {
  const {
    state,
    transactionsActions: { setSelected: setSelectedTransaction },
    snackbarActions: { openSnackbar },
  } = useContext(AppStateContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openTransactionFormModal, setOpenTransactionFormModal] =
    useState(false);
  const selectedTransaction = state.transactions.selected;

  const [deleteTransaction] = useMutation(deleteTransactionMutation, {
    refetchQueries: [transactionsOperationName],
    onCompleted: (data) => {
      const { deleteTransaction } = data;

      if (selectedTransaction.id === deleteTransaction.id) {
        setSelectedTransaction({});
      }

      openSnackbar("successfully deleted transaction");
    },
  });

  const [createTransaction] = useMutation(createTransactionMutation, {
    refetchQueries: [transactionsOperationName],
    onCompleted: () => {
      setOpenTransactionFormModal(false);
      openSnackbar("successfully created transaction");
    },
  });

  const [updateTransaction] = useMutation(updateTransactionMutation, {
    refetchQueries: [transactionsOperationName],
    onCompleted: () => {
      setOpenTransactionFormModal(false);
      openSnackbar("successfully updated transaction");
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteTransaction({ variables: { id: selectedTransaction.id } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleTransactionFormModelClose() {
    setOpenTransactionFormModal(false);
  }

  function handleSubmit(formTransaction) {
    const options = {
      variables: {
        ...formTransaction,
        debit: formTransaction?.debit ?? false,
        credit: formTransaction?.credit ?? false,
      },
    };
    if (formTransaction.id) {
      updateTransaction(options);
    } else {
      createTransaction(options);
    }
  }

  return (
    <>
      <TransactionFormModal
        open={openTransactionFormModal}
        handleClose={handleTransactionFormModelClose}
        handleSubmit={handleSubmit}
        transaction={selectedTransaction}
      />
      <DeleteDialog
        open={openDeleteDialog}
        deleteMessage="Are you sure you want to delete this transaction?"
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
            selectedTransaction,
            setSelectedTransaction,
            setOpenDeleteDialog,
            setOpenTransactionFormModal,
          }}
        />
      </Box>
    </>
  );
}

export default TransactionsPage;
