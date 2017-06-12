// @flow
import * as jQuery from 'jquery';

export const COI_RECEIVED = 'COI_RECEIVED';
export const FETCH_COI = 'FETCH_COI';

type actionType = {
  type: string
};


export function getCOI(url) {
  return dispatch => {
    dispatch({type:FETCH_COI})
    $.get(url,data=>{
      dispatch({
        type:COI_RECEIVED,
        payload: JSON.parse(data)
      })
    })
  }
}
