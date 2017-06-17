import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { toggleDrawer } from '../actions/search'
import { Link } from 'react-router-dom';

const styles = {
  title: {
    cursor: 'pointer',
  },
  appBar: {
    backgroundColor: '#000'
  }
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
  drawer = () => {
    this.props.dispatch(toggleDrawer())
  }
  render(){
    return(
      <AppBar
        title={<span style={styles.title}>ASML Ireland COI App</span>}
        iconElementRight={<Menu />}
        onLeftIconButtonTouchTap={this.drawer}
        style={styles.appBar}
      />
    )
  }
}

export default connect(state => ({
  search: state.search,
} ))(Header)
