import { useState } from "react";
import { useQuery } from "@apollo/client";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/merchantsQuery";
import Table from "components/Table";

function Merchants() {
  const { loading, error, data } = useQuery(query);
  const [selectedMerchantId, setSelectedMerchantId] = useState();

  if (loading) return null;
  if (error) return <div>Failed to fetch merchants</div>;

  const columns = [
    {
      id: "id",
      label: "id",
    },
    {
      id: "name",
      label: "name",
    },
    {
      id: "description",
      label: "description",
    },
  ];

  const rows = data.merchants.entries.map((merchant) => ({
    id: merchant.id,
    description: merchant.description,
    name: merchant.name,
  }));

  function handleRowClick(merchantId) {
    if (merchantId == selectedMerchantId) {
      setSelectedMerchantId(null);
    } else {
      setSelectedMerchantId(merchantId);
    }
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1200, height: 650 }}>
      <Table
        columns={columns}
        rows={rows}
        selectedId={selectedMerchantId}
        handleRowClick={handleRowClick}
        checkbox
      />
    </TableContainer>
  );
}

export { Merchants };
