import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import AppStateProvider from "providers/AppStateProvider";
import { client } from "clients/graphql/apolloClient";
import App from "./App";

const mdTheme = createTheme();

ReactDOM.createRoot(document.getElementById("app")).render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={mdTheme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </ApolloProvider>
);
