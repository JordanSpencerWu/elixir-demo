import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

import query from "clients/graphql/queries/merchantsQuery";
import Table from "components/Table";
import TableToolbar from "components/TableToolbar";
import TablePaginationActions from "components/TablePaginationActions";

function Merchants() {
  const [pageResult, setPageResult] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let queryOptions = {
    variables: {
      limit: rowsPerPage,
      skip: page * rowsPerPage,
    },
  };

  if (rowsPerPage === -1) {
    queryOptions = {};
  }

  const { data } = useQuery(query, queryOptions);
  const {
    selectMerchant,
    setSelectMerchant,
    setOpenDeleteDialog,
    setOpenMerchantFormModal,
  } = useOutletContext();

  useEffect(() => {
    if (data) {
      setPageResult(data.merchants);
    }
  }, [data]);

  const merchants = pageResult?.entries ?? [];
  const totalRows = pageResult?.totalRows ?? 0;

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

  const rows = merchants.map((merchant) => ({
    id: merchant.id,
    description: merchant.description,
    name: merchant.name,
  }));

  function handleRowClick(id) {
    if (id == selectMerchant?.id) {
      setSelectMerchant({});
    } else {
      const merchant = merchants.find((merchant) => merchant.id == id);
      setSelectMerchant(merchant);
    }
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleAddOrEditClick = () => {
    setOpenMerchantFormModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <TableToolbar
        label="Merchants"
        open={!!selectMerchant?.id}
        handleDeleteClick={handleDeleteClick}
        handleAddClick={handleAddOrEditClick}
        handleEditClick={handleAddOrEditClick}
      />
      <TableContainer sx={{ height: 600 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectMerchant?.id}
          handleRowClick={handleRowClick}
          checkbox
        />
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100, { label: "All", value: -1 }]}
        colSpan={3}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page",
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}

export { Merchants };
