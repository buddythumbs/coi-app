// @flow
// import * as jQuery from 'jquery';
// import {$SP} from '../lib/sharepointplus/sharepointplus'
import type { toolsStateType } from '../reducers/tools';


// window.jQuery = jQuery
// window.$ = $
type actionType = {
  type: string
};
const _USER = 'moleary'
const _PWD = 'Asdfghjkl123%'
const _PMA_KEY = '7fb481a3-18ca-4ca3-b9c2-8348a89d20fd'
const _TOOLS_TABLE = 'https://pma.asml.com/odata/pma.2/pma.MACHINE_DIM'


export const GET_TOOLS = 'GET_TOOLS';
export const RECEIVE_TOOLS = 'RECEIVE_TOOLS';
export const TOOLS_ERROR = 'TOOLS_ERROR'

export function fetchTools(){
  return dispatch => {
    dispatch({
      type:GET_TOOLS
    })
    const myHeaders = new Headers({
        "Accept": "application/json",
        'Authorization': 'Basic '+ btoa(`${_USER}:${_PWD}`),
        'ank': _PMA_KEY
    });
    const myInit = {
        method: 'GET',
        headers: myHeaders,
    }
    fetch(_TOOLS_TABLE,myInit).then(function(response) {
      return response.json();
    }).then(function(json) {
      dispatch({
        type:RECEIVE_TOOLS,
        payload: json.d.results
      })
    }).catch((err)=>{
      dispatch({
        type:TOOLS_ERROR,
        payload: err
      })
    });
  }
}
