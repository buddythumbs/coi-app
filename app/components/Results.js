import React, {Component} from 'react'
import './Results.css'
import classNames from 'classnames'
import { getCOI } from '../actions/search'
export default class Results extends Component {

  handleFetch = (url) => {
    this.props.dispatch(getCOI(url))
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
                  return (
                    <span
                    key={ind}
                      onClick={()=>{this.handleFetch(coi.attachments[attach].latest)}}
                      className={classNames('label',`label-primary`)}>{attach}
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
