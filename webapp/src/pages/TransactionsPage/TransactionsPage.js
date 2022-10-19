import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";

import deleteTransactionMutation from "clients/graphql/mutations/deleteTransactionMutation";
import { operationName as transactionsOperationName } from "clients/graphql/queries/transactionsQuery";
import createTransactionMutation from "clients/graphql/mutations/createTransactionMutation";
import updateTransactionMutation from "clients/graphql/mutations/updateTransactionMutation";

import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import pathTo from "utils/pathTo";

import TransactionFormModal from "./TransactionFormModal";

function TransactionsPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openTransactionFormModal, setOpenTransactionFormModal] =
    useState(false);
  const [selectTransaction, setSelectTransaction] = useState();

  const [deleteTransaction] = useMutation(deleteTransactionMutation, {
    refetchQueries: [transactionsOperationName],
    onCompleted: (data) => {
      const { deleteTransaction } = data;

      if (selectTransaction.id === deleteTransaction.id) {
        setSelectTransaction({});
      }
    },
  });

  const [createTransaction] = useMutation(createTransactionMutation, {
    refetchQueries: [transactionsOperationName],
    onCompleted: () => {
      setOpenTransactionFormModal(false);
    },
  });

  const [updateTransaction] = useMutation(updateTransactionMutation, {
    refetchQueries: [transactionsOperationName],
    onCompleted: () => {
      setOpenTransactionFormModal(false);
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteTransaction({ variables: { id: selectTransaction.id } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
    navigate(pathTo.transactions, { replace: true });
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
        transaction={selectTransaction}
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
            selectTransaction,
            setSelectTransaction,
            setOpenDeleteDialog,
            setOpenTransactionFormModal,
          }}
        />
      </Box>
    </>
  );
}

export default TransactionsPage;
