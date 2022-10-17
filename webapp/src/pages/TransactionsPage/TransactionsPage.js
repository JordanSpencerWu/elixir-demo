import Box from "@mui/material/Box";
import { Outlet, Link } from "react-router-dom";

function TransactionsPage() {
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

export default TransactionsPage;
