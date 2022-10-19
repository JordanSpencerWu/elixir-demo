import { useParams, useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import query from "clients/graphql/queries/companyQuery";
import BackButton from "components/BackButton";
import currencyFormatter from "utils/currencyFormatter";
import displayName from "utils/displayName";

function Company() {
  const { id } = useParams();
  const { setSelectedCompany, setOpenDeleteDialog, setOpenCompanyFormModal } =
    useOutletContext();
  const { loading, error, data } = useQuery(query, { variables: { id: id } });

  if (loading) return null;
  if (error) return <div>Failed to fetch company</div>;

  const { company } = data;

  const handleDeleteClick = () => {
    setSelectedCompany(company);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = () => {
    setSelectedCompany(company);
    setOpenCompanyFormModal(true);
  };

  const disabled = company.deleted;

  return (
    <Box sx={{ width: 500 }}>
      <BackButton />
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 32 }} color="text.secondary" gutterBottom>
            {displayName("Company", company.deleted)}
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

export { Company };
