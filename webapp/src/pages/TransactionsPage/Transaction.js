import { Link, useParams, useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import query from "clients/graphql/queries/transactionQuery";
import getTransactionType from "utils/getTransactionType";
import currencyFormatter from "utils/currencyFormatter";
import BackButton from "components/BackButton";
import pathTo from "utils/pathTo";

function Transaction() {
  const { id } = useParams();
  const {
    setSelectTransaction,
    setOpenDeleteDialog,
    setOpenTransactionFormModal,
  } = useOutletContext();
  const { loading, error, data } = useQuery(query, { variables: { id: id } });

  if (loading) return null;
  if (error) return <div>Failed to fetch transaction</div>;

  const { transaction } = data;

  const handleDeleteClick = () => {
    setSelectTransaction(transaction);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = () => {
    setSelectTransaction(transaction);
    setOpenTransactionFormModal(true);
  };

  return (
    <Box sx={{ width: 500 }}>
      <BackButton />
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 32 }} color="text.secondary" gutterBottom>
            Transction
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Id: {transaction.id}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Type: {getTransactionType(transaction)}
          </Typography>
          <Typography
            sx={{ mb: 1.5, wordWrap: "break-word" }}
            color="text.secondary"
          >
            Description: {transaction.description}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            User:{" "}
            {transaction.user && (
              <Link to={`${pathTo.users}/${transaction.user.id}`}>
                {transaction.user.firstName + " " + transaction.user.lastName}
              </Link>
            )}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Company:{" "}
            {transaction.company && (
              <Link to={`${pathTo.companies}/${transaction.company.id}`}>
                {transaction.company.name}
              </Link>
            )}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Merchant:{" "}
            {transaction.merchant && (
              <Link to={`${pathTo.merchants}/${transaction.merchant.id}`}>
                {transaction.merchant.name}
              </Link>
            )}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Amount: {currencyFormatter(transaction.amount)}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-around" }}>
          <Button size="large" onClick={handleEditClick}>
            Edit
          </Button>
          <Button size="large" onClick={handleDeleteClick}>
            Delete
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export { Transaction };
