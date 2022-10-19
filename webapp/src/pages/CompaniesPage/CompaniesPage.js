import { useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { useMutation } from "@apollo/client";

import deleteCompanyMutation from "clients/graphql/mutations/deleteCompanyMutation";
import createCompanyMutation from "clients/graphql/mutations/createCompanyMutation";
import updateCompanyMutation from "clients/graphql/mutations/updateCompanyMutation";
import { operationName as companiesOperationName } from "clients/graphql/queries/companiesQuery";

import DeleteDialog from "components/DeleteDialog/DeleteDialog";
import pathTo from "utils/pathTo";
import { AppStateContext } from "providers/AppStateProvider";

import CompanyFormModal from "./CompanyFormModal";

function CompaniesPage() {
  const {
    state,
    companiesActions: { setSelected: setSelectedCompany },
  } = useContext(AppStateContext);
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCompanyFormModal, setOpenCompanyFormModal] = useState(false);

  const selectedCompany = state.companies.selected;

  const [deleteCompany] = useMutation(deleteCompanyMutation, {
    refetchQueries: [companiesOperationName],
    onCompleted: (data) => {
      const { deleteCompany } = data;

      if (selectedCompany.id === deleteCompany.id) {
        setSelectedCompany({});
      }
    },
  });

  const [createCompany] = useMutation(createCompanyMutation, {
    refetchQueries: [companiesOperationName],
    onCompleted: () => {
      setOpenCompanyFormModal(false);
    },
  });

  const [updateCompany] = useMutation(updateCompanyMutation, {
    refetchQueries: [companiesOperationName],
    onCompleted: () => {
      setOpenCompanyFormModal(false);
    },
  });

  function handleClose() {
    setOpenDeleteDialog((previousOpen) => !previousOpen);
  }

  function handleAgree() {
    deleteCompany({ variables: { id: selectedCompany.id } });
    setOpenDeleteDialog((previousOpen) => !previousOpen);
    navigate(pathTo.companies, { replace: true });
  }

  function handleCompanyFormModelClose() {
    setOpenCompanyFormModal(false);
  }

  function handleSubmit(formCompany) {
    const options = {
      variables: {
        ...formCompany,
      },
    };
    if (formCompany.id) {
      updateCompany(options);
    } else {
      createCompany(options);
    }
  }

  return (
    <>
      <CompanyFormModal
        open={openCompanyFormModal}
        handleClose={handleCompanyFormModelClose}
        handleSubmit={handleSubmit}
        company={selectedCompany}
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
            selectedCompany,
            setSelectedCompany,
            setOpenDeleteDialog,
            setOpenCompanyFormModal,
          }}
        />
      </Box>
    </>
  );
}

export default CompaniesPage;
