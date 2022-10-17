import { useQuery } from "@apollo/client";
import GetTransactions from "../gql/transactions.gql";
import TxTable from "../components/transactions/TxTable";
import Button from "@mui/material/Button";

export function Home() {
  return <Button variant="contained">Hello World</Button>;
}
