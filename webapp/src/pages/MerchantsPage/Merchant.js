import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

import query from "clients/graphql/queries/merchantQuery";

function Merchant() {
  const { id } = useParams();
  const naviagte = useNavigate();
  const { loading, error, data } = useQuery(query, { variables: { id: id } });

  if (loading) return null;
  if (error) return <div>Failed to fetch merchant</div>;

  const { merchant } = data;

  const handleBackClick = () => {
    naviagte(-1);
  };

  return (
    <Box sx={{ width: 500 }}>
      <MuiLink component="button" onClick={handleBackClick}>
        Back
      </MuiLink>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 32 }} color="text.secondary" gutterBottom>
            Merchant
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
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export { Merchant };
