import { bool, func, string } from "prop-types";
import MuiSnackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function Snackbar(props) {
  const { message, open, closeSnackbar } = props;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    closeSnackbar();
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <MuiSnackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
}

Snackbar.propTypes = {
  message: string.isRequired,
  open: bool.isRequired,
  closeSnackbar: func.isRequired,
};

export default Snackbar;
