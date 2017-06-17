import React, {Component} from 'react'
import './Results.css'
import classNames from 'classnames'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RaisedButton from 'material-ui/RaisedButton';
import { getCOI } from '../actions/coi'

const styles = {
  draft:{
    backgroundColor: '#3A3F44'
  },
  submit:{
    backgroundColor: '#7A8288'
  },
  approve:{
    backgroundColor: '#F89406'
  },
  execute:{
    backgroundColor: '#EE5F5B'
  },
  complete:{
    backgroundColor: '#34B233'
  }
}

export default class Results extends Component {
  handleFetch = (url) => {
    this.props.dispatch(getCOI(url))
  }
  IconMenuExampleNested = (stat) => {
    return (
        <IconMenu
          iconButtonElement={<span style={styles[stat.status]} className="label">{stat.status}</span>}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
        <MenuItem primaryText="Open" onTouchTap={()=>{this.handleFetch(stat.latest)}}/>
        <Divider/>
        <MenuItem primaryText="Files"/>
        <Divider />
        {
          stat.files.map(file=>{
          return (
            <MenuItem
              primaryText={file.date}
              rightIcon={<ArrowDropRight />}
              menuItems={[
                <MenuItem primaryText="Open" />,
                <MenuItem primaryText="Download" />,
                <MenuItem primaryText="Delete" />
              ]}
            />)
          })
        }
          <Divider />
          <MenuItem primaryText="Clean" />
          <Divider />
          <MenuItem value="Del" primaryText="Delete" />

        </IconMenu>
    )
}

  cois = (results) => {
    return(
        results.map((coi,i) => {
          return (
            <tr key={i}><td>
              {coi.ID} - <b>{coi.tool}</b> - {coi.so_number}- <b className="text-primary">{coi.subsys}</b>
              - {coi.reason} - <b><span className="zmdi zmdi-time-countdown"></span> {coi.time} hrs </b>
              {coi.expired?(
                <span title="Submission date is more than 30 days ago" className="label label-danger">
                  Expired !!  <span className="zmdi zmdi-alert-circle-o"></span>
                </span>):''}
              {Object.keys(coi.attachments).map((attach,ind)=>{
                console.log(styles[attach]);
                  return (
                    <span>
                      {this.IconMenuExampleNested(coi.attachments[attach])}
                    </span>
                  )
                })
              }</td>
            </tr>
            )
        })
      )
  }

  render(){
    const { results, searching, received } = this.props.search
    console.log( this.props.search);
    if (searching) {
      return(
        <div className="container text-center">
          <h4>Fetching COIs <i className="zmdi zmdi-spinner zmdi-hc-spin text-info"></i></h4>
        </div>
      )
    }else if (!received) {
     return(
        <div className="container text-center">
          <p>
            Search for COIs
          </p>
        </div>
      )
    }else{
      if (results.length==0) {
        return (
          <div className="text-center">
            <h4 className="text-info">No COIs found</h4>
          </div>
        )
      }else {
        return (
          <table className="table table-hover">
          <tbody>
          {this.cois(results)}
          </tbody>
          </table>
        )
      }
    }
  }
}
