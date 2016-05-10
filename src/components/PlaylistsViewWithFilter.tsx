
import * as React from "react";
import {connect} from "react-redux";

import PlaylistsView from "./PlaylistsView";

interface Props {
  showFilter: boolean;
}

interface State {
  filterString: string;
}

class PlaylistsViewWithFilter extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {filterString: ""};
  }

  onChange() {
    this.setState({filterString: (this.refs["input"] as HTMLInputElement).value});
  }

  render() {
    var filter = this.props.showFilter ? (
      <input
        type="text"
        ref="input"
        onKeyUp={this.onChange.bind(this)} />
    ) : null;

    return (
      <div>
        {filter}
        <PlaylistsView filter={this.props.showFilter ? this.state.filterString : ""} />
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  (state) => {
    return {showFilter: !state.playlists.invalid};
  }
)(PlaylistsViewWithFilter);
