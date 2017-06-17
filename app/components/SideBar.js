import React, { Component } from 'react'
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom'


class SideBar extends Component {
  render(){
    const { open } = this.props
    console.log(this.props);
    console.log(open);
    return(
      <Drawer open={open}>
        <Link to="/"><MenuItem primaryText="Home" /></Link>
        <Link to="/counter"><MenuItem primaryText="Counter" /></Link>
        <Link to="/search"><MenuItem primaryText="Search" /></Link>
        <Link to="/runner"><MenuItem primaryText="Runner" /></Link>
      </Drawer>
    )
  }

}

export default connect(state => ({
  open: state.search.sidebar,
  config: state.config,
  tools: state.tools
} ))(SideBar)
