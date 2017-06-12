import { FETCH_COI, COI_RECEIVED, FETCH_ERROR } from '../actions/coi';

export type toolsStateType = {
  coi: Object
};

type actionType = {
  type: string
};

export default function coi(state={
    coi:{},
    fetching:false,
    fetched:false,
    error:null
  },action) {
  switch (action.type) {
    case FETCH_COI:
      state = {...state,fetching:true,error:null}
      break;
    case COI_RECEIVED:
      state = {
        ...state,
        fetching:false,
        fetched:true,
        coi:action.payload
      }
      break;
    case FETCH_ERROR:
      state = {
        ...state,
        fetching:false,
        fetched:false,
        error:action.payload
      }
      break;
    default:
      state = {...state}
  }
  return state
}
