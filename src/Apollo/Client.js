import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { resolvers } from "./LocalState";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";

const cache = new InMemoryCache();

export default new ApolloClient({
  cache,
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: "http://localhost:4000"
    })
  ]),
  resolvers: resolvers
});

cache.writeData({
  data: { isLoggedIn: Boolean(localStorage.getItem("token")) || false }
});
