
import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";

import {RootState, Playlist} from "../store";
import {loadPlaylistsIfNeeded, selectPlaylist} from "../actions";

class _PlaylistsView extends React.Component<any, any> {
  componentWillMount() {
    this.props.dispatch(loadPlaylistsIfNeeded());
  }

  componentWillReceiveProps(nextProps) {
    this.props.dispatch(loadPlaylistsIfNeeded());
  }

  render() {
    if (this.props.loading) {
      return <div>Loading</div>;
    } else if (!this.props.invalid) {
      return (
        <ul>
          {_.map(this.props.items, (playlist: Playlist) => {
            return <li onClick={this.props.onSelectPlaylist.bind(playlist.id)}>{playlist.name}</li>;
          })}
        </ul>
      );
    } else {
      return <div>Invalid</div>;
    }
  }
}

function mapStateToProps(state: RootState) {
  return _.extend({accessToken: state.accessToken}, state.playlists);
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectPlaylist: (playlistId) => {
      dispatch(selectPlaylist(playlistId));
    },
    dispatch
  };
}

export var PlaylistsView = connect(
  mapStateToProps,
  mapDispatchToProps
)(_PlaylistsView);
