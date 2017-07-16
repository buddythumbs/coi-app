import React, { Component } from 'react'
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom'
import { toggleDrawer } from '../actions/search'


class SideBar extends Component {
  toggleDrawer = () => {
    this.props.dispatch(toggleDrawer())
  }
  render(){
    const { open } = this.props
    console.log(this.props);
    console.log(open);
    return(
      <Drawer 
        open={open}
        docked={false}
        width={200}
        onRequestChange={(open) => this.toggleDrawer()}
      >
        <Link to="/"><MenuItem onTouchTap={() => this.toggleDrawer()} primaryText="Home" /></Link>
        <Link to="/counter"><MenuItem onTouchTap={() => this.toggleDrawer()}  primaryText="Counter" /></Link>
        <Link to="/search"><MenuItem onTouchTap={() => this.toggleDrawer()}  primaryText="Search" /></Link>
        <Link to="/runner"><MenuItem onTouchTap={() => this.toggleDrawer()}  primaryText="Runner" /></Link>
      </Drawer>
    )
  }

}

export default connect(state => ({
  open: state.search.sidebar,
  config: state.config,
  tools: state.tools
} ))(SideBar)
