import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { bool, func, string, shape } from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import companiesQuery from "clients/graphql/queries/companiesQuery";
import merchantsQuery from "clients/graphql/queries/merchantsQuery";
import usersQuery from "clients/graphql/queries/usersQuery";

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

export function getUserName(user) {
  if (user) return user.firstName + " " + user.lastName;
  return null;
}

function TransactionFormModal(props) {
  const { open, handleClose, handleSubmit, transaction } = props;
  const [formTransaction, setFormTransaction] = useState({});
  const { loading: loadingCompanies, data: companiesData } =
    useQuery(companiesQuery);
  const { loading: loadingMerchants, data: merchantsData } =
    useQuery(merchantsQuery);
  const { loading: loadingUsers, data: usersData } = useQuery(usersQuery);

  useEffect(() => {
    setFormTransaction(transaction);
  }, [transaction]);

  if (loadingCompanies || loadingMerchants || loadingUsers) return null;

  const { companies } = companiesData;
  const { merchants } = merchantsData;
  const { users } = usersData;

  const updateTransactionForm = (key, value) => {
    setFormTransaction((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  function handleClick() {
    setFormTransaction({});
    handleSubmit(formTransaction);
  }

  let disabled =
    !formTransaction.amount ||
    !formTransaction.companyId ||
    !formTransaction.description ||
    !formTransaction.merchantId ||
    !formTransaction.userId ||
    (formTransaction.credit && formTransaction.debit);

  const companyOptions = companies.entries.map((company) => company.name);
  const merchantOptions = merchants.entries.map((merchant) => merchant.name);
  const userOptions = users.entries.map((user) => getUserName(user));

  const companyValue = formTransaction?.companyId
    ? companies.entries.find((c) => c.id == formTransaction.companyId)?.name
    : null;

  function handleCompanyOnChange(companyName) {
    const companyId = companies.entries.find((c) => c.name == companyName)?.id;
    updateTransactionForm("companyId", companyId);
  }

  const merchantValue = formTransaction?.merchantId
    ? merchants.entries.find((m) => m.id == formTransaction.merchantId)?.name
    : null;

  function handleMerchantOnChange(merchantName) {
    const merchantId = merchants.entries.find(
      (m) => m.name == merchantName
    )?.id;
    updateTransactionForm("merchantId", merchantId);
  }

  const userValue = formTransaction?.userId
    ? getUserName(users.entries.find((u) => u.id == formTransaction.userId))
    : null;

  function handleUserOnChange(userName) {
    const userId = users.entries.find((u) => getUserName(u) == userName)?.id;
    updateTransactionForm("userId", userId);
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
          Transaction
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
              options={companyOptions}
              value={companyValue}
              onChange={(e, companyName) => handleCompanyOnChange(companyName)}
              renderInput={(params) => (
                <TextField {...params} label="Company Name" />
              )}
            />
            <Autocomplete
              id="merchant-id"
              freeSolo
              options={merchantOptions}
              value={merchantValue}
              onChange={(e, merchantName) =>
                handleMerchantOnChange(merchantName)
              }
              renderInput={(params) => (
                <TextField {...params} label="Merchant Name" />
              )}
            />
            <Autocomplete
              id="user-id"
              freeSolo
              options={userOptions}
              value={userValue}
              onChange={(e, userName) => handleUserOnChange(userName)}
              renderInput={(params) => (
                <TextField {...params} label="User Name" />
              )}
            />

            <TextField
              id="description"
              label="Description"
              variant="outlined"
              value={formTransaction?.description}
              onChange={(e) =>
                updateTransactionForm("description", e.target.value)
              }
              required
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formTransaction?.debit}
                    onChange={(e) =>
                      updateTransactionForm("debit", e.target.checked)
                    }
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Debit"
                id="debit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formTransaction?.credit}
                    onChange={(e) =>
                      updateTransactionForm("credit", e.target.checked)
                    }
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                id="credit"
                label="Credit"
              />
            </FormGroup>
            <TextField
              id="amount"
              label="Amount"
              variant="outlined"
              value={formTransaction?.amount}
              onChange={(e) => updateTransactionForm("amount", e.target.value)}
              required
            />
          </Box>
          <Button variant="contained" onClick={handleClick} disabled={disabled}>
            {transaction?.id ? "Update" : "Create"}
          </Button>
        </FormControl>
      </Box>
    </Modal>
  );
}

TransactionFormModal.propTypes = {
  open: bool.isRequired,
  handleClose: func.isRequired,
  handleSubmit: func.isRequired,
  transaction: shape({
    id: string,
    amount: string,
    companyId: string,
    credit: bool,
    debit: bool,
    description: string,
    merchantId: string,
    userId: string,
  }),
};

TransactionFormModal.defaultProps = {
  transaction: {},
};

export default TransactionFormModal;
