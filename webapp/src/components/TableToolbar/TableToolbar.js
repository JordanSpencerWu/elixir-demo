import { bool, func, string } from "prop-types";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { lightBlue } from "@mui/material/colors";

function TableToolbar(props) {
  const { label, open, handleDeleteClick, handleAddClick, handleEditClick } =
    props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: lightBlue[800],
        color: "white",
        ...(open && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
          color: "black",
        }),
      }}
    >
      {open ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {label}
        </Typography>
      )}
      {open ? (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Add">
          <IconButton onClick={handleAddClick}>
            <AddIcon sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

TableToolbar.propTypes = {
  handleAddClick: func.isRequired,
  handleDeleteClick: func.isRequired,
  handleEditClick: func.isRequired,
  label: string.isRequired,
  open: bool.isRequired,
};

export default TableToolbar;
