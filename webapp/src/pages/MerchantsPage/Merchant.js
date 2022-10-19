import { useParams, useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import query from "clients/graphql/queries/merchantQuery";
import BackButton from "components/BackButton";
import displayName from "utils/displayName";

function Merchant() {
  const { id } = useParams();
  const { setSelectedMerchant, setOpenDeleteDialog, setOpenMerchantFormModal } =
    useOutletContext();
  const { loading, error, data } = useQuery(query, { variables: { id: id } });

  if (loading) return null;
  if (error) return <div>Failed to fetch merchant</div>;

  const { merchant } = data;

  const handleDeleteClick = () => {
    setSelectedMerchant(merchant);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = () => {
    setSelectedMerchant(merchant);
    setOpenMerchantFormModal(true);
  };

  const disabled = merchant.deleted;

  return (
    <Box sx={{ width: 500 }}>
      <BackButton />
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 32 }} color="text.secondary" gutterBottom>
            {displayName("Merchant", merchant.deleted)}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Id: {merchant.id}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Name: {merchant.name}
          </Typography>
          <Typography
            sx={{ mb: 1.5, wordWrap: "break-word" }}
            color="text.secondary"
          >
            Description: {merchant.description}
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

export { Merchant };
