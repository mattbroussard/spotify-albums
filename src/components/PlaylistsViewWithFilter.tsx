
import * as classnames from "classnames";
import * as React from "react";
import {connect} from "react-redux";

import {Playlist} from "../store";
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

  filter(playlist: Playlist): boolean {
    if (this.state.filterString) {
      return playlist.name.toLowerCase().indexOf(this.state.filterString.toLowerCase()) >= 0;
    }
    return true;
  }

  render() {
    var filter = this.props.showFilter ? (
      <input
        className="filter-input"
        type="text"
        ref="input"
        placeholder="Filter Playlists..."
        onKeyUp={this.onChange.bind(this)} />
    ) : null;

    return (
      <div className={classnames({
        "playlists-view-with-filter": true,
        "has-filter": this.props.showFilter,
      })}>
        {filter}
        <PlaylistsView
          selectedPlaylist={this.props.selectedPlaylist}
          onSelectPlaylist={this.props.onSelectPlaylist}
          filterFn={this.filter.bind(this)} />
      </div>
    );
  }
}

export default connect<StateProps, {}, OwnProps>(
  // mapStateToProps
  (state) => {
    return {showFilter: !state.playlists.invalid && !state.playlists.error};
  }
)(PlaylistsViewWithFilter);
