import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";

import query from "clients/graphql/queries/usersQuery";

function UsersPage() {
  const { loading, error, data } = useQuery(query);
  console.log(data);

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
      Users Page
    </Box>
  );
}

export default UsersPage;
