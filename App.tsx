import React from 'react';
import {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {Route, MemoryRouter, Switch} from 'react-router';

import Home from './components/Home';
import CreateBill from './components/CreateBill';

export default class App extends React.Component {
  render() {
    return (
    <MemoryRouter>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/create' component={CreateBill}/>
        </Switch>
    </MemoryRouter>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
