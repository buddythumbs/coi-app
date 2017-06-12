// @flow
import {
  SEARCH_COIS,
  RECEIVE_COIS,
  TOOL_SEARCH_STRING,
  STATUS_SEARCH_STRING,
  SUBSYSTEM_SEARCH_STRING,
  UPDATE_SEARCH_STRING,
  COI_RECEIVED
} from '../actions/search';

export type searchStateType = {
  results: array,
  searching: boolean,
  received: boolean,
  searchTools:array,
  searchStatus: array,
  searchSubsystem: array,
  searchString: string,
  query:string,
  coi:Object
};

type actionType = {
  type: string
};

export default function search(state={
    results : [],
    searching:false,
    received:false,
    searchTools:[],
    searchStatus: [],
    searchSubsystem: [],
    searchString: '',
    query:'',
    coi:{}
  },action) {
  switch (action.type) {
    case SEARCH_COIS:
      state = {
        ...state,
        searching:true,
        query:action.payload
      }
      break;
    case RECEIVE_COIS:
      state = {
        ...state,
        searching: false,
        received: true,
        results: action.payload
      }
      break;
    case TOOL_SEARCH_STRING:
      state = {
        ...state,
        searchTools: action.payload
      }
      break;
    case STATUS_SEARCH_STRING:
      state ={
        ...state,
        searchStatus: action.payload
      }
      break;
    case SUBSYSTEM_SEARCH_STRING:
      state = {
        ...state,
        searchSubsystem: action.payload
      }
      break;
    case UPDATE_SEARCH_STRING:
      console.log(action.payload);
      state = {
        ...state,
        searchString: action.payload
      }
      break;
    case COI_RECEIVED:
      state = {
        ...state,
        coi: action.payload
      }
      break;
    default:
      state = {...state};
  }
  return state
}
