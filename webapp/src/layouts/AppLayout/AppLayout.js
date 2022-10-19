import { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import { useContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import AppBar from "components/AppBar";
import Drawer from "components/Drawer";
import Snackbar from "components/Snackbar";

import { AppStateContext } from "providers/AppStateProvider";

function AppLayout() {
  const [open, setOpen] = useState(true);
  const {
    state,
    snackbarActions: { closeSnackbar },
  } = useContext(AppStateContext);
  const openSnackbar = state.snackbar.open;
  const snackbarMessage = state.snackbar.message;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar open={open} toggleDrawer={toggleDrawer} />
      <Drawer open={open} toggleDrawer={toggleDrawer} />
      <Box
        css={{
          position: "relative",
          marginTop: 64,
          height: "calc(100% - 64px)",
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
      <Snackbar
        open={openSnackbar}
        closeSnackbar={closeSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default AppLayout;
