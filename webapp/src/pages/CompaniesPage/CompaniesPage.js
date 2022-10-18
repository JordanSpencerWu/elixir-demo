import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { useMutation } from "@apollo/client";

import deleteCompanyMutation from "clients/graphql/mutations/deleteCompanyMutation";
import companiesQuery from "clients/graphql/queries/companiesQuery";
import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import pathTo from "utils/pathTo";

function CompaniesPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [companyId, setCompanyId] = useState();
  const [deleteCompany] = useMutation(deleteCompanyMutation, {
    refetchQueries: [{ query: companiesQuery }],
    onCompleted: (data) => {
      const { deleteCompany } = data;

      if (companyId === deleteCompany.id) {
        setCompanyId(null);
      }
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteCompany({ variables: { id: companyId } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
    navigate(pathTo.companies, { replace: true });
  }

  return (
    <>
      <DeleteDialog
        open={openDeleteDialog}
        deleteMessage="Are you sure you want to delete this company?"
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
        <Outlet context={{ companyId, setCompanyId, setOpenDeleteDialog }} />
      </Box>
    </>
  );
}

export default CompaniesPage;
