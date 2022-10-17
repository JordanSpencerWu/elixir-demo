import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";

import { client } from "clients/graphql/apolloClient";
import App from "./App";

ReactDOM.createRoot(document.getElementById("app")).render(
  <div data-app-init="">
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </div>
);
