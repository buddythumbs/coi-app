// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash'

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import Results from './Results';
import { fetchTools } from '../actions/tools'
import { getCOI } from '../actions/coi'
import { colors } from '../store/colors'

import {
  createToolString,
  createStatusString,
  createSubsystemString,
  createString,
  searchCOI
} from '../actions/search'

const statuses = [
  'draft','submit','approve','execute','complete'
]

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paddingTop: {
    marginTop: '20px',
  },
  search : {
    marginTop: '25px',
    backgroundColor: colors[3],
    color: '#eee'
  }
};

export default class Search extends Component {
  componentWillMount(){
    this.props.dispatch(fetchTools())
  }
  handleChange = ({param, value}) => {
    console.log(param,value);
    switch (param) {
      case 'tool':
        this.props.dispatch(createToolString(value))
        break;
      case 'status':
        this.props.dispatch(createStatusString(value))
        break;
      case 'subsystem':
        this.props.dispatch(createSubsystemString(value))
        break;
      case 'string':
        this.props.dispatch(createString(value))
        break;
      default:
    }
  }
  handleSearch = _.debounce(() => {
    let search = {...this.props.search}
    this.props.dispatch(searchCOI(search))
  },750)
  selectionRenderer = (values) => {
    switch (values.length) {
      case 0:
        return '';
      case 1:
        return values;
      default:
        return `${values.length} tools selected`;
    }
  }
  chipsTools(searchTools){
    if (searchTools.length) {
      return searchTools.map((tool,i)=> {
        return (
          <Chip backgroundColor={colors[1]} labelColor={colors[0]} key={i} style={styles.chip}>
            <Avatar
            icon={<span className="zmdi zmdi-wrench"></span>}
            color={colors[1]}
            backgroundColor={colors[0]}/>
            {tool}
          </Chip>
        )
      })

    }
  }
  chipsStatus(searchStatus){
    if (searchStatus.length) {
      return searchStatus.map((status,i)=> {
        return (
          <Chip key={i} style={styles.chip}>
          <Avatar
          icon={<span className="zmdi zmdi-time-interval"></span>}
          color={colors[0]}
          backgroundColor={colors[1]}/>
            {status}
          </Chip>
        )
      })

    }
  }
  chipsSubsystem(searchSubsystem){
    if (searchSubsystem.length) {
      return searchSubsystem.map((sys,i)=> {
        return (
          <Chip key={i} style={styles.chip}>
          <Avatar
          icon={<span className="zmdi zmdi-memory"></span>}
          color={colors[0]}
          backgroundColor={colors[1]}/>
            {sys}
          </Chip>
        )
      })

    }
  }
  chipsString(searchString){
    if (searchString.length>0) {
        return (
          <Chip backgroundColor={colors[6]} labelColor={colors[0]} style={styles.chip}>
            <Avatar
            icon={<span className="zmdi zmdi-text-format"></span>}
            color={colors[6]}
            backgroundColor={colors[1]}/>
            {searchString}
          </Chip>
        )

    }
  }

  render() {
    console.log(this.props);
    if (!this.props.tools.fetched) {
      return (
        <div className="container text-center">
          <h4>Fetching tools form PMA <i className="zmdi zmdi-spinner zmdi-hc-spin text-info"></i></h4>
        </div>
      )
    }else{
      const {
        searchTools,
        searchStatus,
        searchSubsystem,
        searchString,
        results,
        searching,
        received } = this.props.search
      const { statuses, subsystems } = this.props.config
      return (
        <div className='container-fluid'>
          <h3>Search COIs</h3>
          <div className="row">
            <div className="col-xs-2">
              <SelectField
                floatingLabelText="Select tools"
                multiple={true}
                fullWidth={true}
                selectionRenderer={this.selectionRenderer}
                value={searchTools.length>0?searchTools:null}
                onChange={  (event, index, value) => {
                    this.handleChange({
                      param:'tool',
                      value:value
                    })
                  }
                }
              >
                <MenuItem value={null} primaryText="Clear" />
                {
                  this.props.tools.tools.map((tool,i)=>{
                    return (
                      <MenuItem
                        value={tool.CUSTOMER_MACHINE_NAME}
                        key={i}
                        primaryText={tool.CUSTOMER_MACHINE_NAME}
                        checked={searchTools && searchTools.indexOf(tool.CUSTOMER_MACHINE_NAME) > -1}/>
                    )
                  })
                }
              </SelectField>
            </div>
            <div className='col-xs-2'>
              <SelectField
                floatingLabelText="Select status"
                multiple={true}
                fullWidth={true}
                value={searchStatus.length>0?searchStatus:null}
                onChange={  (event, index, value) => {
                    this.handleChange({
                      param:'status',
                      value:value
                    })
                  }
                }
              >
                <MenuItem value={null} primaryText="Clear" />
                {
                  statuses.map((status,i)=>{
                    return (
                      <MenuItem
                        value={status}
                        key={i}
                        primaryText={status}
                        checked={searchStatus && searchStatus.indexOf(status) > -1}/>
                    )
                  })
                }
              </SelectField>
            </div>
            <div className='col-xs-3'>
              <SelectField
                floatingLabelText="Select subsystem"
                multiple={true}
                fullWidth={true}
                value={searchSubsystem.length>0?searchSubsystem:null}
                onChange={  (event, index, value) => {
                    this.handleChange({
                      param:'subsystem',
                      value:value
                    })
                  }
                }
              >
              <MenuItem value={null} primaryText="Clear" />
              {
                subsystems.map((sys,i)=>{
                  return (
                    <MenuItem
                      value={sys}
                      key={i}
                      primaryText={sys}
                      checked={searchSubsystem && searchSubsystem.indexOf(sys) > -1}/>
                  )
                })
              }
              </SelectField>
            </div>
            <div className="col-xs-4">
              <TextField
                floatingLabelText="Text in COI name"
                value={searchString||''}
                fullWidth={true}
                onChange={  (event, value) => {
                  this.handleChange({
                    param:'string',
                    value:value
                  })
                }
              }
              />
            </div>
            <div className="col-xs-1">
              <FlatButton
                label="Search"
                labelPosition="before"
                primary={true}
                onTouchTap={this.handleSearch}
                style={styles.search}
                icon={<span className="zmdi zmdi-search-for"></span>}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12' style={styles.wrapper}>
              {this.chipsTools(searchTools)}
              {this.chipsStatus(searchStatus)}
              {this.chipsSubsystem(searchSubsystem)}
              {this.chipsString(searchString)}
            </div>
          </div>
          <div className="row" style={styles.paddingTop}>
            <div className="col-xs-12">
              <Results search={this.props.search} dispatch={this.props.dispatch}/>
            </div>
          </div>
        </div>
      );
    }
  }
}
