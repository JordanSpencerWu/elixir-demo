import { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import AppBar from "components/AppBar";
import Drawer from "components/Drawer";

function AppLayout() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar open={open} toggleDrawer={toggleDrawer} />
      <Drawer open={open} toggleDrawer={toggleDrawer} />
      <main css={{ marginTop: 64 }}>
        <Outlet />
      </main>
    </Box>
  );
}

export default AppLayout;
