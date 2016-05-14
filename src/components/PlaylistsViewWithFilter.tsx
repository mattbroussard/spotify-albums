
import * as React from "react";
import {connect} from "react-redux";

import PlaylistsView from "./PlaylistsView";

interface StateProps {
  showFilter: boolean;
}

interface OwnProps {
  onSelectPlaylist: (id: string) => void;
  selectedPlaylist: string;
}

type AllProps = OwnProps & StateProps;

interface State {
  filterString: string;
}

class PlaylistsViewWithFilter extends React.Component<AllProps, State> {
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
        <PlaylistsView
          selectedPlaylist={this.props.selectedPlaylist}
          onSelectPlaylist={this.props.onSelectPlaylist}
          filter={this.props.showFilter ? this.state.filterString : ""} />
      </div>
    );
  }
}

export default connect<StateProps, {}, OwnProps>(
  // mapStateToProps
  (state) => {
    return {showFilter: !state.playlists.invalid};
  }
)(PlaylistsViewWithFilter);
