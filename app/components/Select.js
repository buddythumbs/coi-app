import React, { Component } from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class SelectPicker extends Component {
  state = {
    values: [],

  selectionRenderer = (values) => {
    switch (values.length) {
      case 0:
        return '';
      case 1:
        return this.props.options[values[0]];
      default:
        return `${values.length} names selected`;
    }
  }
  render(){
    const { style, options, search, size, value, title, onChange } = this.props
    return(
      <SelectField
        floatingLabelText={title}
        floatingLabelFixed={true}
        multiple={true}
        value={value}
        onChange={onChange}
        selectionRenderer={this.selectionRenderer}
      >
        <MenuItem value={null} primaryText="" />
        {
          options.map((option,i)=>{
            return <MenuItem checked={options && this.state.values.indexOf(option) > -1} key={i} value={option} primaryText={option} />
          })
        }
      </SelectField>
    )
  }
}

export default SelectPicker;
