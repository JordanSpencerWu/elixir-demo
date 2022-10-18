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

function Company() {
  const { id } = useParams();
  const { setSelectCompany, setOpenDeleteDialog, setOpenCompanyFormModal } =
    useOutletContext();
  const { loading, error, data } = useQuery(query, { variables: { id: id } });

  if (loading) return null;
  if (error) return <div>Failed to fetch company</div>;

  const { company } = data;

  const handleDeleteClick = () => {
    setSelectCompany(company);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = () => {
    setSelectCompany(company);
    setOpenCompanyFormModal(true);
  };

  return (
    <Box sx={{ width: 500 }}>
      <BackButton />
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

export { Company };
