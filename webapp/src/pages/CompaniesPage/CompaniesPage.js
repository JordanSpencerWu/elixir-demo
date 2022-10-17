import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";

import query from "clients/graphql/queries/companiesQuery";

function CompaniesPage() {
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
      Companies Page
    </Box>
  );
}

export default CompaniesPage;
