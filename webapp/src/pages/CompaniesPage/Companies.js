import { useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/companiesQuery";
import currencyFormatter from "utils/currencyFormatter";
import Table from "components/Table";
import TableToolbar from "components/TableToolbar";

function Companies() {
  const { loading, error, data } = useQuery(query);
  const {
    selectCompany,
    setSelectCompany,
    setOpenDeleteDialog,
    setOpenCompanyFormModal,
  } = useOutletContext();

  if (loading) return null;
  if (error) return <div>Failed to fetch companies</div>;

  const { companies } = data;

  const columns = [
    {
      id: "id",
      label: "id",
    },
    {
      id: "availableCredit",
      label: "available credit",
      align: "right",
    },
    {
      id: "creditLine",
      label: "credit line",
      align: "right",
    },
  ];

  const rows = companies.entries.map((company) => ({
    id: company.id,
    availableCredit: currencyFormatter(company.availableCredit),
    creditLine: currencyFormatter(company.creditLine),
  }));

  function handleRowClick(id) {
    if (id == selectCompany?.id) {
      setSelectCompany({});
    } else {
      const company = companies.entries.find((company) => company.id == id);
      setSelectCompany(company);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleAddOrEditClick = () => {
    setOpenCompanyFormModal(true);
  };

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <TableToolbar
        label="Companies"
        open={!!selectCompany?.id}
        handleDeleteClick={handleDeleteClick}
        handleAddClick={handleAddOrEditClick}
        handleEditClick={handleAddOrEditClick}
      />
      <TableContainer sx={{ height: 650 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectCompany?.id}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
    </Paper>
  );
}

export { Companies };
