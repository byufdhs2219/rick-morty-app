
// Apollo Client with InMemoryCache and cumulative pagination
import { ApolloClient, InMemoryCache, HttpLink, FetchPolicy, ApolloLink } from '@apollo/client';

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://rickandmortyapi.com/graphql',

      credentials: 'same-origin',
    }),
    
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            characters: {
              keyArgs: ['filter'],
              
              merge(existing, incoming, { args }) {
                if (!existing) return incoming;
                

                // Extract results array dari existing cache
                // Default ke empty array jika tidak ada
                const existingResults = existing.results || [];

                // Extract results array dari incoming data
                const incomingResults = incoming.results || [];
                
                const existingIds = new Set(
                  existingResults.map((item: any) => item.__ref || item.id)
                );
                
                const newResults = incomingResults.filter((item: any) => {
                  const id = item.__ref || item.id;
                  return !existingIds.has(id);  // true jika belum ada
                });
                
                return {
                  ...incoming,  // Keep meta data dari incoming
                  results: [...existingResults, ...newResults],  // Cumulative results
                };
              },
            },
          },
        },
      },
    }),
    
    ssrMode: false,
    
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network' as FetchPolicy,

        errorPolicy: 'all',
      },

      query: {
        fetchPolicy: 'cache-and-network' as FetchPolicy,
        errorPolicy: 'all',
      },
    },
  });
}

export const apolloClient = createApolloClient();

export default apolloClient;
