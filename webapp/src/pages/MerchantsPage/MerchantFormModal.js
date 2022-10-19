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

function MerchantFormModal(props) {
  const { open, handleClose, handleSubmit, merchant } = props;
  const [formMerchant, setFormMerchant] = useState({});

  useEffect(() => {
    setFormMerchant(merchant);
  }, [merchant]);

  const updateMerchantForm = (key, value) => {
    setFormMerchant((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  function handleClick() {
    setFormMerchant({});
    handleSubmit(formMerchant);
  }

  let disabled = !formMerchant.name || !formMerchant.description;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Merchant
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
              value={formMerchant?.name}
              onChange={(e) => updateMerchantForm("name", e.target.value)}
              required
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              value={formMerchant?.description}
              onChange={(e) =>
                updateMerchantForm("description", e.target.value)
              }
              required
            />
          </Box>
          <Button variant="contained" onClick={handleClick} disabled={disabled}>
            {merchant?.id ? "Update" : "Create"}
          </Button>
        </FormControl>
      </Box>
    </Modal>
  );
}

MerchantFormModal.propTypes = {
  open: bool.isRequired,
  handleClose: func.isRequired,
  handleSubmit: func.isRequired,
  merchant: shape({
    id: string,
    name: string,
    description: string,
  }),
};

MerchantFormModal.defaultProps = {
  merchant: {},
};

export default MerchantFormModal;
