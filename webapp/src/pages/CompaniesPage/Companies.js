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
  const { companyId, setCompanyId, setOpenDeleteDialog } = useOutletContext();

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
    if (id == companyId) {
      setCompanyId(null);
    } else {
      setCompanyId(id);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <TableToolbar
        label="Companies"
        open={!!companyId}
        handleDeleteClick={handleDeleteClick}
      />
      <TableContainer sx={{ height: 650 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={companyId}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
    </Paper>
  );
}

export { Companies };
