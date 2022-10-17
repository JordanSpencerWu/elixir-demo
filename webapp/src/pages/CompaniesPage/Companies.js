import { useState } from "react";
import { useQuery } from "@apollo/client";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/companiesQuery";
import currencyFormatter from "utils/currencyFormatter";
import Table from "components/Table";

function Companies() {
  const { loading, error, data } = useQuery(query);
  const [selectedCompanyId, setSelectedCompanyId] = useState();

  if (loading) return null;
  if (error) return <div>Failed to fetch companies</div>;

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

  const rows = data.companies.entries.map((company) => ({
    id: company.id,
    availableCredit: currencyFormatter(company.availableCredit),
    creditLine: currencyFormatter(company.creditLine),
  }));

  function handleRowClick(companyId) {
    if (companyId == selectedCompanyId) {
      setSelectedCompanyId(null);
    } else {
      setSelectedCompanyId(companyId);
    }
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1200, height: 650 }}>
      <Table
        columns={columns}
        rows={rows}
        selectedId={selectedCompanyId}
        handleRowClick={handleRowClick}
        checkbox
      />
    </TableContainer>
  );
}

export { Companies };
