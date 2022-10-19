import { useEffect, useState } from "react";
import { bool, func, string, shape } from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

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

function CompanyFormModal(props) {
  const { open, handleClose, handleSubmit, company } = props;
  const [formCompany, setFormCompany] = useState({});

  useEffect(() => {
    setFormCompany(company);
  }, [company]);

  const updateCompanyForm = (key, value) => {
    setFormCompany((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  function handleClick() {
    setFormCompany({});
    handleSubmit(formCompany);
  }

  let disabled = !formCompany.name || !formCompany.creditLine;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Company
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
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={formCompany?.name}
              onChange={(e) => updateCompanyForm("name", e.target.value)}
              required
            />
            <TextField
              id="credit-line"
              label="Credit Line"
              variant="outlined"
              value={formCompany?.creditLine}
              onChange={(e) => updateCompanyForm("creditLine", e.target.value)}
              required
            />
          </Box>
          <Button variant="contained" onClick={handleClick} disabled={disabled}>
            {company?.id ? "Update" : "Create"}
          </Button>
        </FormControl>
      </Box>
    </Modal>
  );
}

CompanyFormModal.propTypes = {
  open: bool.isRequired,
  handleClose: func.isRequired,
  handleSubmit: func.isRequired,
  company: shape({
    id: string,
    availableCredit: string,
    creditLine: string,
  }),
};

CompanyFormModal.defaultProps = {
  company: {},
};

export default CompanyFormModal;
