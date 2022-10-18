import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";

import deleteTransactionMutation from "clients/graphql/mutations/deleteTransactionMutation";
import transactionsQuery from "clients/graphql/queries/transactionsQuery";
import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import pathTo from "utils/pathTo";

function TransactionsPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [transactionId, setTransactionId] = useState();
  const [deleteTransaction] = useMutation(deleteTransactionMutation, {
    refetchQueries: [{ query: transactionsQuery }],
    onCompleted: (data) => {
      const { deleteTransaction } = data;

      if (transactionId === deleteTransaction.id) {
        setTransactionId(null);
      }
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteTransaction({ variables: { id: transactionId } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
    navigate(pathTo.transactions, { replace: true });
  }

  return (
    <>
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
          context={{ transactionId, setTransactionId, setOpenDeleteDialog }}
        />
      </Box>
    </>
  );
}

export default TransactionsPage;
