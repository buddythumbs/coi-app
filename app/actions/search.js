// @flow
import type { searchStateType } from '../reducers/search';
import * as jQuery from 'jquery';
import _ from 'lodash'
import moment from 'moment'

window.jQuery = jQuery
window.$ = jQuery

type actionType = {
  type: string
};

const _USER = 'moleary'
const _PWD = 'Asdfghjkl123%'
const _PMA_KEY = '7fb481a3-18ca-4ca3-b9c2-8348a89d20fd'
const _TOOLS_TABLE = 'https://pma.asml.com/odata/pma.2/pma.MACHINE_DIM'
const _COLLAB_ROOT = "http://collaboration.asml.com/projects/cs-ireland/Ops/"

// Helpers
function setupSP() {
  const credentials = {
    username:_USER,
    password:_PWD,
    domain:'collaboration.asml.com'
  };
  const proxyweb = "http://" + credentials.domain + "%5C" + credentials.username + ":" + credentials.password + "@proxy:80";
  const SP_AUTH = $SP().proxy(proxyweb).auth(credentials);
  return SP_AUTH
}
function compare(a,b) {
  if (moment(a.date).isSameOrBefore(moment(b.date)))
  return 1;
  if (moment(a.date).isSameOrAfter(moment(b.date)))
  return -1;
  return 0;
}
function parseFiles(lineItem){
  lineItem.attachments.forEach((x,i,arr)=>{
    if(x=="0"){
      arr.splice(i,1);
    }else{
      if (x.match(/hrs/)) {
        arr[i]={
          "name":_.last(x.split("/")),
          "url":x,
          "date":moment(x.match(/\d{4}.(\d{2}.){4}/)[0].replace(/_-/g," "), "YYYY MM DD HH mm").format('YYYY-MM-DD HH:mm'),
          "status":(x.match(/draft|submit|approve|execute|complete/)[0]||"draft"),
        }
      }else{
        arr[i]={
          "name":_.last(x.split("/")),
          "url":x,
          "status":"file",
        }
      }

    }
  })

  lineItem.attachments = lineItem.attachments.reduce(function(attachments,attachment){
    attachments[attachment.status] = attachments[attachment.status] || {
      "status" : attachment.status,
      "files" : [],
      "latest" : attachment.url
    }
    attachments[attachment.status].files.push(attachment)
    if(attachment.status!== "files"){
      attachments[attachment.status].latest = attachments[attachment.status].files.sort(compare)[0].url
    }
    return attachments
  },{})
  // console.log(lineItem.attachments)
  return lineItem.attachments
}

// Actions
export const SEARCH_COIS = 'SEARCH_COIS';
export const RECEIVE_COIS = 'RECEIVE_COIS';
export const TOOL_SEARCH_STRING = 'TOOL_SEARCH_STRING';
export const STATUS_SEARCH_STRING = 'STATUS_SEARCH_STRING';
export const SUBSYSTEM_SEARCH_STRING = 'SUBSYSTEM_SEARCH_STRING';
export const UPDATE_SEARCH_STRING = 'UPDATE_SEARCH_STRING';
export const COI_RECEIVED = 'COI_RECEIVED';
export const FETCH_COI = 'FETCH_COI';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

export function receive() {
  return {
    type: RECEIVE_COIS
  };
}
export function createToolString(tools) {
  if (Array.isArray(tools)) {
    if (tools.indexOf(null)>-1) {
      return {
        type: TOOL_SEARCH_STRING,
        payload: []
      };
    }else{
      return {
        type: TOOL_SEARCH_STRING,
        payload: tools
      };
    }
  }else {
    return {
      type: TOOL_SEARCH_STRING,
      payload: [tools]
    };
  }

}
export function createStatusString(statuses) {
  if (Array.isArray(statuses)) {
    if (statuses.indexOf(null)>-1) {
      return {
        type: STATUS_SEARCH_STRING,
        payload: []
      };
    }else{
      return {
        type: STATUS_SEARCH_STRING,
        payload: statuses
      };
    }
  }else {
    return {
      type: STATUS_SEARCH_STRING,
      payload: [statuses]
    };
  }
}
export function createSubsystemString(subsystems) {
  if (Array.isArray(subsystems)) {
    if (subsystems.indexOf(null)>-1) {
      return {
        type: SUBSYSTEM_SEARCH_STRING,
        payload: []
      };
    }else{
      return {
        type: SUBSYSTEM_SEARCH_STRING,
        payload: subsystems
      };
    }
  }else {
    return {
      type: SUBSYSTEM_SEARCH_STRING,
      payload: [subsystems]
    };
  }
}
export function createString(string) {
  return {
    type: UPDATE_SEARCH_STRING,
    payload: string
  };
}
export function searchCOI(stateObj) {
  return dispatch => {
    if (stateObj.searchTools.length) {
      var toolString = stateObj.searchTools.map(function (tool) {
        return "C_Tool='"+ tool + "'"
      }).join(' OR ')
      toolString = "("+toolString+")"
    }

    if (stateObj.searchStatus.length) {
      var statusString = stateObj.searchStatus.map(function (status) {
        return "C_Status='"+ status + "'"
      }).join(' OR ')
      statusString = "("+statusString+")"
    }

    if (stateObj.searchSubsystem.length) {
      var subsysString = stateObj.searchSubsystem.map(function (subsystem) {
        return "C_Subsystem='"+ subsystem + "'"
      }).join(' OR ')
      subsysString = "("+subsysString+")"
    }

    if (stateObj.searchString !=='') {
      var stringString =  "C_Name LIKE '"+ stateObj.searchString + "'"
      stringString = "("+stringString+")"
    }

    var QUERY = ''

    QUERY = toolString?toolString:QUERY
    QUERY = statusString?(QUERY!=""?QUERY + " AND " + statusString:statusString):QUERY
    QUERY = subsysString?(QUERY!=""?QUERY + " AND " + subsysString:subsysString):QUERY
    QUERY = stringString?(QUERY!=""?QUERY + " AND " + stringString:stringString):QUERY

    dispatch({
      type: SEARCH_COIS,
      payload: QUERY
    })

    let sp = setupSP()
    sp.list('C_PAS',_COLLAB_ROOT ).get({
      where: QUERY,
      orderby:"E_Abb ASC",
    }, function getData(success) {
      let data = []
      success.forEach( coi => {
        var obj = {
          ID:coi.getAttribute("ID"),
          sender:coi.getAttribute("C_Sender"),
          name:coi.getAttribute("C_Name"),
          subsys:coi.getAttribute("C_Subsystem"),
          tool:coi.getAttribute("C_Tool"),
          time:coi.getAttribute("C_c_Time"),
          status:coi.getAttribute("C_Status"),
          so_number:coi.getAttribute("C_SO"),
          reason:coi.getAttribute("C_Description"),
          date: coi.getAttribute("C_Date"),
          expired: moment(coi.getAttribute("C_Expire")).isBefore(moment()),
          attachments:$SP().cleanResult(coi.getAttribute("Attachments")).split(";"),
        }
        obj.attachments = parseFiles(obj)
        data.push(obj)
      })
      data.sort(compare)
      dispatch({
        type: RECEIVE_COIS,
        payload:data
      })
    });
  }

}
export function toggleDrawer() {
  return {
    type:TOGGLE_DRAWER
  }
}
