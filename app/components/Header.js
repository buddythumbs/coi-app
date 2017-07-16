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

class Header extends Component {
  toggleDrawer = () => {
    this.props.dispatch(toggleDrawer())
  }
  render(){
    return(
      <AppBar
        title={<span style={styles.title}>ASML Ireland COI App</span>}
        // iconElementRight={<Menu />}
        onLeftIconButtonTouchTap={this.toggleDrawer}
        // onRightIconButtonTouchTap={this.toggleDrawer}
        style={styles.appBar}
      />
    )
  }
}

export default connect(state => ({
  search: state.search,
} ))(Header)
