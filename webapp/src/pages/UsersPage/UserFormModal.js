import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { bool, func, string, shape } from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";

import query from "clients/graphql/queries/companiesQuery";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

function UserFormModal(props) {
  const { open, handleClose, handleSubmit, user } = props;
  const [formUser, setFormUser] = useState({});
  const { loading, data } = useQuery(query);

  useEffect(() => {
    setFormUser(user);
  }, [user]);

  if (loading) return null;

  const { companies } = data;

  const updateUserForm = (key, value) => {
    setFormUser((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  function handleClick() {
    handleSubmit(formUser);
  }

  let disabled = !formUser.dob || !formUser.firstName || !formUser.lastName;

  const options = companies.entries.map((company) => company.name);

  const companyValue = formUser?.companyId
    ? companies.entries.find((c) => c.id == formUser.companyId)?.name
    : null;

  function handleCompanyOnChange(companyName) {
    const companyId = companies.entries.find((c) => c.name == companyName)?.id;
    updateUserForm("companyId", companyId);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          User
        </Typography>
        <FormControl>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <Autocomplete
              id="company-id"
              freeSolo
              options={options}
              value={companyValue}
              onChange={(e, companyName) => handleCompanyOnChange(companyName)}
              renderInput={(params) => (
                <TextField {...params} label="Company Name" />
              )}
            />
            <DatePicker
              id="dob"
              label="Date of Birth"
              inputFormat="MM-DD-YYYY"
              value={formUser?.dob ?? null}
              onChange={(newValue) => updateUserForm("dob", newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <TextField
              id="first-name"
              label="First Name"
              variant="outlined"
              value={formUser?.firstName}
              onChange={(e) => updateUserForm("firstName", e.target.value)}
              required
            />
            <TextField
              id="last-name"
              label="Last Name"
              variant="outlined"
              value={formUser?.lastName}
              onChange={(e) => updateUserForm("lastName", e.target.value)}
              required
            />
          </Box>
          <Button variant="contained" onClick={handleClick} disabled={disabled}>
            {user?.id ? "Update" : "Create"}
          </Button>
        </FormControl>
      </Box>
    </Modal>
  );
}

UserFormModal.propTypes = {
  open: bool.isRequired,
  handleClose: func.isRequired,
  handleSubmit: func.isRequired,
  user: shape({
    id: string,
    dob: string,
    firstName: string,
    lastName: string,
  }),
};

UserFormModal.defaultProps = {
  user: {},
};

export default UserFormModal;
