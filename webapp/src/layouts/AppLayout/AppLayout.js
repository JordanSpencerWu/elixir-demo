import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import AppBar from "components/AppBar";
import Drawer from "components/Drawer";
import { PATHNAME_TO_NAME } from "components/AppBar";

function AppLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;

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
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ position: "absolute", top: 16, left: 24, fontSize: 24 }}
        >
          <p css={{ margin: 0 }}>{PATHNAME_TO_NAME[pathname]}</p>
        </Breadcrumbs>
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;
