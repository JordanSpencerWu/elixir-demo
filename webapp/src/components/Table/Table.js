import { array, arrayOf, bool, func, shape, string } from "prop-types";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { lightBlue } from "@mui/material/colors";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: lightBlue[800],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    cursor: "pointer",
  },

  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: lightBlue[100],
  },
}));

function Table(props) {
  const { checkbox, columns, rows, selectedId, handleRowClick } = props;

  return (
    <MUITable stickyHeader aria-label="table">
      <TableHead sx={{ textTransform: "uppercase" }}>
        <TableRow>
          {checkbox && <StyledTableCell></StyledTableCell>}
          {columns.map((column) => (
            <StyledTableCell key={column.id} align={column.align}>
              {column.label}
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => {
          const selected = selectedId == row.id;

          return (
            <StyledTableRow
              hover
              key={row.id}
              selected={selected}
              onClick={() => handleRowClick(row.id)}
            >
              {checkbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selected}
                    inputProps={{
                      "aria-labelledby": row.id,
                    }}
                  />
                </TableCell>
              )}
              {columns.map((column) => {
                const value = row[column.id];
                const isId = column.id === "id";

                return (
                  <TableCell key={column.id} align={column.align}>
                    {isId ? <Link to={row.id}>{value}</Link> : value}
                  </TableCell>
                );
              })}
            </StyledTableRow>
          );
        })}
      </TableBody>
    </MUITable>
  );
}

Table.propTypes = {
  columns: arrayOf(
    shape({
      align: string,
      format: func,
      id: string,
      label: string,
    })
  ).isRequired,
  rows: array.isRequired,
  selectedId: string,
  handleRowClick: func,
  checkbox: bool,
};

Table.defaultProps = {
  checkbox: false,
  selectedId: null,
  handleRowClick: () => {},
};

export default Table;
