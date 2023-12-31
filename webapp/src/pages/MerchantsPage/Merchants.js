import { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

import query from "clients/graphql/queries/merchantsQuery";
import Table from "components/Table";
import TableToolbar from "components/TableToolbar";
import TablePaginationActions from "components/TablePaginationActions";
import { AppStateContext } from "providers/AppStateProvider";

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

function Merchants() {
  const {
    state,
    merchantsActions: { setPage, setRowsPerPage, setSearchByName },
  } = useContext(AppStateContext);
  const [pageResult, setPageResult] = useState();

  const page = state.merchants.page;
  const rowsPerPage = state.merchants.rowsPerPage;
  const searchByName = state.merchants.searchByName;

  let variables = {
    limit: rowsPerPage,
    skip: page * rowsPerPage,
    search: {
      searchByName,
    },
  };

  if (rowsPerPage === -1) {
    delete variables["limit"];
    delete variables["skip"];
  }

  if (searchByName === "") {
    delete variables["search"];
  }

  const { data } = useQuery(query, {
    variables,
    fetchPolicy: "cache-and-network",
  });
  const {
    selectedMerchant,
    setSelectedMerchant,
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

  const rows = merchants.map((merchant) => ({
    id: merchant.id,
    description: merchant.description,
    name: merchant.name,
  }));

  function handleRowClick(id) {
    if (id == selectedMerchant?.id) {
      setSelectedMerchant({});
    } else {
      const merchant = merchants.find((merchant) => merchant.id == id);
      setSelectedMerchant(merchant);
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
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: 1200, mb: 2 }}>
      <Box sx={{ m: 2, display: "flex" }}>
        <FormControl sx={{ width: 500 }}>
          <TextField
            fullWidth
            id="search-by-merchant-name"
            label="Search by merchant name"
            type="search"
            value={searchByName}
            onChange={(e) => setSearchByName(e.target.value)}
          />
        </FormControl>
      </Box>
      <TableToolbar
        label="Merchants"
        open={!!selectedMerchant?.id}
        handleDeleteClick={handleDeleteClick}
        handleAddClick={handleAddOrEditClick}
        handleEditClick={handleAddOrEditClick}
      />
      <TableContainer sx={{ height: 600 }}>
        <Table
          columns={columns}
          rows={rows}
          selectedId={selectedMerchant?.id}
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
