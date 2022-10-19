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
import displayName from "utils/displayName";

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

  const disabled = user.deleted;

  return (
    <Box sx={{ width: 500 }}>
      <BackButton />
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 32 }} color="text.secondary" gutterBottom>
            {displayName("User", user.deleted)}
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
            {displayName("Company", user.company.deleted)}:{" "}
            <Link to={`${pathTo.company}${user.company.id}`}>
              {user.company.name}
            </Link>
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

export { User };
