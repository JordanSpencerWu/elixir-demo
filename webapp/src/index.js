import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { client } from "clients/graphql/apolloClient";
import App from "./App";

const mdTheme = createTheme();

ReactDOM.createRoot(document.getElementById("app")).render(
  <div data-app-init="">
    <ApolloProvider client={client}>
      <ThemeProvider theme={mdTheme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </div>
);
