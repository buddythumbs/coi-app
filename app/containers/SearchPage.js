import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Search from '../components/Search';
import * as SearchActions from '../actions/search';
import * as ToolsActions from '../actions/tools';

export default connect(state => ({
  search: state.search,
  config: state.config,
  tools: state.tools
} ))(Search)
