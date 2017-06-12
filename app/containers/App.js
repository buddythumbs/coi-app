// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import Header from '../components/Header'

const styles = {
  body: {
    marginTop: '20px'
  }
}

export default class App extends Component {
  props: {
    children: Children
  };
  render() {
    return (
      <div>
        <Header/>
        <div style={styles.body} className="container-fluid body">
          {this.props.children}
        </div>
      </div>
    );
  }
}
