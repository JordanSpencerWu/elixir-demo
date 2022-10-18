import { Link, useParams, useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import query from "clients/graphql/queries/userQuery";
import BackButton from "components/BackButton";
import pathTo from "utils/pathTo";

function User() {
  const { id } = useParams();
  const { setSelectedUser, setOpenDeleteDialog, setOpenUserFormModal } =
    useOutletContext();
  const { loading, error, data } = useQuery(query, { variables: { id: id } });

  if (loading) return null;
  if (error) return <div>Failed to fetch user</div>;

  const { user } = data;

  const handleDeleteClick = () => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = () => {
    setSelectedUser(user);
    setOpenUserFormModal(true);
  };

  return (
    <Box sx={{ width: 500 }}>
      <BackButton />
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 32 }} color="text.secondary" gutterBottom>
            User
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Id: {user.id}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            First Name: {user.firstName}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Last Name: {user.lastName}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Date Of Birth: {user.dob}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Company:{" "}
            {user.company && (
              <Link to={`${pathTo.company}${user.company.id}`}>
                {user.company.name}
              </Link>
            )}
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

export { User };
