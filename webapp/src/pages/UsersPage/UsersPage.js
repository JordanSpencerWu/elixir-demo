import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

function UsersPage() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Outlet />
    </Box>
  );
}

export default UsersPage;
