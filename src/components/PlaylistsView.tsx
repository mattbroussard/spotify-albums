
import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";

import {RootState, Playlist} from "../store";
import {loadPlaylistsIfNeeded, selectPlaylist} from "../actions";

class PlaylistsView extends React.Component<Props, {}> {
  componentWillMount() {
    this.props.dispatch(loadPlaylistsIfNeeded());
  }

  componentWillReceiveProps(nextProps) {
    this.props.dispatch(loadPlaylistsIfNeeded());
  }

  render() {
    var ret = [];

    if (this.props.loading) {
      ret.push(<div>Loading</div>);
    }

    if (!this.props.invalid) {
      ret.push(
        <ul>
          {_.map(this.props.items, (playlist: Playlist) => {
            return (
              <li onClick={this.props.onSelectPlaylist.bind(null, playlist.id)}>
                {playlist.name}
              </li>
            );
          })}
        </ul>
      );
    }

    return <div>{ret}</div>;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistsView);
