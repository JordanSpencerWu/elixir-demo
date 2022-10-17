import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";

import query from "clients/graphql/queries/merchantsQuery";

function MerchantsPage() {
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
      Merchants Page
    </Box>
  );
}

export default MerchantsPage;
