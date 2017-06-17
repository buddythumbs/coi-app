import React, { Component } from 'react'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

export default class Runner extends Component {
  render(){
    const { coi } = this.props.coi
    console.log(coi);
    return(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>length</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
        {
          coi.actions.map((fms,i) => {
            return (
              <TableRow key={i}>
                <TableRowColumn>{fms.queue.index}</TableRowColumn>
                <TableRowColumn>{fms.id}</TableRowColumn>
                <TableRowColumn>{fms.queue.steps.length}</TableRowColumn>
              </TableRow>
            )
          })
        }
        </TableBody>
      </Table>
    )
  }
}
