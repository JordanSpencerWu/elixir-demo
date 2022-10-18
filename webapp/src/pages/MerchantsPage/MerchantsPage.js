import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";

import deleteMerchantMutation from "clients/graphql/mutations/deleteMerchantMutation";
import merchantsQuery from "clients/graphql/queries/merchantsQuery";
import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import pathTo from "utils/pathTo";

function MerchantsPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [merchantId, setMerchantId] = useState();
  const [deleteMerchant] = useMutation(deleteMerchantMutation, {
    refetchQueries: [{ query: merchantsQuery }],
    onCompleted: (data) => {
      const { deleteMerchant } = data;

      if (merchantId === deleteMerchant.id) {
        setMerchantId(null);
      }
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteMerchant({ variables: { id: merchantId } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
    navigate(pathTo.merchants, { replace: true });
  }

  return (
    <>
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
        <Outlet context={{ merchantId, setMerchantId, setOpenDeleteDialog }} />
      </Box>
    </>
  );
}

export default MerchantsPage;
