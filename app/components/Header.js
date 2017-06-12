import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import { Link } from 'react-router-dom';

const styles = {
  title: {
    cursor: 'pointer',
  },
};

const Menu = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <Link to="/"><MenuItem primaryText="Home" /></Link>
    <Link to="/counter"><MenuItem primaryText="Counter" /></Link>
    <Link to="/search"><MenuItem primaryText="Search" /></Link>
    <Link to="/runner"><MenuItem primaryText="Runner" /></Link>
  </IconMenu>
);

class Header extends Component {
  render(){
    return(
      <AppBar
        title={<span style={styles.title}>ASML Ireland COI App</span>}
        iconElementRight={<Menu />}
      />
    )
  }
}

export default Header
