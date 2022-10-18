import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/merchantsQuery";
import Table from "components/Table";
import TableToolbar from "components/TableToolbar";

function Merchants() {
  const { loading, error, data } = useQuery(query);
  const { merchantId, setMerchantId, setOpenDeleteDialog } = useOutletContext();

  if (loading) return null;
  if (error) return <div>Failed to fetch merchants</div>;

  const { merchants } = data;

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

  const rows = merchants.entries.map((merchant) => ({
    id: merchant.id,
    description: merchant.description,
    name: merchant.name,
  }));

  function handleRowClick(id) {
    if (id == merchantId) {
      setMerchantId(null);
    } else {
      setMerchantId(id);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <TableToolbar
        label="Merchants"
        open={!!merchantId}
        handleDeleteClick={handleDeleteClick}
      />
      <TableContainer sx={{ height: 650 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={merchantId}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
    </Paper>
  );
}

export { Merchants };
