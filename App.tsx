import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Button, AppRegistry } from 'react-native';
import { Route, MemoryRouter, Switch } from 'react-router';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Home from './components/Home';
import CreateBill from './components/CreateBill';
import BillsList from './components/BillsList';

//apollo client setup
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api-euwest.graphcms.com/v1/cjsusp5ar6mfy01ckiztobrxx/master'
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network', //looks at cache and then updates
      errorPolicy: 'all'
    },
    mutate: {
      errorPolicy: 'all'
    }
  }
});

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <MemoryRouter>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/create' component={CreateBill} />
            <Route path='/bills' component={BillsList} />
          </Switch>
        </MemoryRouter>
      </ApolloProvider>
    );
  }
}

AppRegistry.registerComponent('BillManager', () => App);
