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
import displayName from "utils/displayName";

function Transaction() {
  const { id } = useParams();
  const {
    setSelectedTransaction,
    setOpenDeleteDialog,
    setOpenTransactionFormModal,
  } = useOutletContext();
  const { loading, error, data } = useQuery(query, { variables: { id: id } });

  if (loading) return null;
  if (error) return <div>Failed to fetch transaction</div>;

  const { transaction } = data;

  const handleDeleteClick = () => {
    setSelectedTransaction(transaction);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = () => {
    setSelectedTransaction(transaction);
    setOpenTransactionFormModal(true);
  };

  const disabled = transaction.deleted;

  return (
    <Box sx={{ width: 500 }}>
      <BackButton />
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 32 }} color="text.secondary" gutterBottom>
            {displayName("Transaction", transaction.deleted)}
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
            {displayName("User", transaction.user.deleted)}:{" "}
            <Link to={`${pathTo.user}${transaction.user.id}`}>
              {transaction.user.firstName + " " + transaction.user.lastName}
            </Link>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {displayName("Company", transaction.company.deleted)}:{" "}
            <Link to={`${pathTo.company}${transaction.company.id}`}>
              {transaction.company.name}
            </Link>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {displayName("Merchant", transaction.merchant.deleted)}:{" "}
            <Link to={`${pathTo.merchant}${transaction.merchant.id}`}>
              {transaction.merchant.name}
            </Link>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Amount: {currencyFormatter(transaction.amount)}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-around" }}>
          <Button size="large" onClick={handleEditClick} disabled={disabled}>
            Edit
          </Button>
          <Button size="large" onClick={handleDeleteClick} disabled={disabled}>
            Delete
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export { Transaction };
