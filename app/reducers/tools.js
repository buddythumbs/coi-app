import {
  GET_TOOLS,
  RECEIVE_TOOLS,
  TOOLS_ERROR
} from '../actions/tools';

export type toolsStateType = {
  tools: array,
  fetching: boolean,
  fetched: boolean
};

type actionType = {
  type: string
};

export default function tools(state={
    tools:[],
    fetching:false,
    fetched:false,
    error:null
  },action) {
  switch (action.type) {
    case GET_TOOLS:
      state = {...state,fetching:true}
      break;
    case RECEIVE_TOOLS:
      state = {
        ...state,
        fetching:false,
        fetched:true,
        tools:action.payload.filter(tool => tool.EQUIPMENT_TYPE === 'S')
      }
      break;
    case TOOLS_ERROR:
      state = {
        ...state,
        error:action.payload
      }
      break;
    default:
      state = {...state}
  }
  return state
}
