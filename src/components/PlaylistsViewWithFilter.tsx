
import * as React from "react";
import {connect} from "react-redux";

import PlaylistsView from "./PlaylistsView";

interface Props {
  showFilter: boolean;
}

interface State {
  filter: string;
}

class PlaylistsViewWithFilter extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {filter: ""};
  }

  onChange() {
    this.setState({filter: (this.refs["input"] as HTMLInputElement).value});
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
        <PlaylistsView filter={this.props.showFilter ? this.state.filter : ""} />
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
