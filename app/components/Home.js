// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import Alert  from './Alert'

const image = "./img/coi-logo.png"
const width = 200
export default class Home extends Component {
  render() {
    return (
      <div>
        <div className='text-center' >
          <img src={image} width={width}/><br/>
          <Alert/>
          <Link to="/counter">Counter</Link><br/>
          <Link to="/search">Search for COIs</Link>
        </div>
      </div>
    );
  }
}
