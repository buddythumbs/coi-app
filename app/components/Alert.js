import React, {Component} from 'react'
import AlertContainer from 'react-alert'
import SvgIcon from 'material-ui/SvgIcon';

export default class Alert extends Component {
  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'fade'
  }

  showAlert = () => {
    this.msg.show('Some text or component', {
      time: 2000,
      type: 'success',
      icon: <span className="zmdi zmdi-close zmdi-hc-2x"/>
    })
  }

  render () {
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <a onClick={this.showAlert}>Show Alert</a>
      </div>
    )
  }
}