
import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";

import {RootState, Playlist} from "../store";
import {loadPlaylistsIfNeeded, selectPlaylist} from "../actions";

interface Props {
  // from Playlists
  items: {[id: string]: Playlist};
  loading: boolean;
  invalid: boolean;

  filter: string;
  onSelectPlaylist: (id: string) => void;
  dispatch: Function;
}

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
            if (this.props.filter && playlist.name.indexOf(this.props.filter) == -1) {
              return null;
            }

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
  return _.extend({}, state.playlists);
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
