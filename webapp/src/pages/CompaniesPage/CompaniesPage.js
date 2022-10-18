import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { useMutation } from "@apollo/client";

import deleteCompanyMutation from "clients/graphql/mutations/deleteCompanyMutation";
import createCompanyMutation from "clients/graphql/mutations/createCompanyMutation";
import updateCompanyMutation from "clients/graphql/mutations/updateCompanyMutation";
import companiesQuery from "clients/graphql/queries/companiesQuery";

import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import pathTo from "utils/pathTo";

import CompanyFormModal from "./CompanyFormModal";

function CompaniesPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCompanyFormModal, setOpenCompanyFormModal] = useState(false);
  const [selectCompany, setSelectCompany] = useState();

  const [deleteCompany] = useMutation(deleteCompanyMutation, {
    refetchQueries: [{ query: companiesQuery }],
    onCompleted: (data) => {
      const { deleteCompany } = data;

      if (selectCompany.id === deleteCompany.id) {
        setSelectCompany({});
      }
    },
  });

  const [createCompany] = useMutation(createCompanyMutation, {
    refetchQueries: [{ query: companiesQuery }],
    onCompleted: () => {
      setOpenCompanyFormModal(false);
    },
  });

  const [updateCompany] = useMutation(updateCompanyMutation, {
    refetchQueries: [{ query: companiesQuery }],
    onCompleted: () => {
      setOpenCompanyFormModal(false);
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteCompany({ variables: { id: selectCompany.id } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
    navigate(pathTo.companies, { replace: true });
  }

  function handleCompanyFormModelClose() {
    setOpenCompanyFormModal(false);
  }

  function handleSubmit(formCompany) {
    if (formCompany.id) {
      const options = {
        variables: {
          ...formCompany,
        },
      };
      updateCompany(options);
    } else {
      const options = {
        variables: {
          ...formCompany,
        },
      };
      createCompany(options);
    }
  }

  return (
    <>
      <CompanyFormModal
        open={openCompanyFormModal}
        handleClose={handleCompanyFormModelClose}
        handleSubmit={handleSubmit}
        company={selectCompany}
      />
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
        <Outlet
          context={{
            selectCompany,
            setSelectCompany,
            setOpenDeleteDialog,
            setOpenCompanyFormModal,
          }}
        />
      </Box>
    </>
  );
}

export default CompaniesPage;
