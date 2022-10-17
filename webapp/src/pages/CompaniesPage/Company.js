import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

import query from "clients/graphql/queries/companyQuery";
import currencyFormatter from "utils/currencyFormatter";

function Company() {
  const { id } = useParams();
  const naviagte = useNavigate();
  const { loading, error, data } = useQuery(query, { variables: { id: id } });

  if (loading) return null;
  if (error) return <div>Failed to fetch company</div>;

  const { company } = data;

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
            Company
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Id: {company.id}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Name: {company.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Credit line: {currencyFormatter(company.creditLine)}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Available credit: {currencyFormatter(company.availableCredit)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export { Company };
