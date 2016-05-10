
import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";

import {RootState, Playlist, Playlists} from "../store";
import {loadPlaylistsIfNeeded, selectPlaylist} from "../actions";

type StateProps = Playlists;

interface OwnProps {
  filter: string;
}

interface DispatchProps {
  onSelectPlaylist: (id: string) => void;
  loadPlaylistsIfNeeded: () => void;
}

type AllProps = StateProps & DispatchProps & OwnProps;

class PlaylistsView extends React.Component<AllProps, {}> {
  componentWillMount() {
    this.props.loadPlaylistsIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    this.props.loadPlaylistsIfNeeded();
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

function mapStateToProps(state: RootState): StateProps {
  return _.extend({}, state.playlists) as Playlists;
}

function mapDispatchToProps(dispatch): DispatchProps {
  return {
    onSelectPlaylist: (playlistId) => {
      dispatch(selectPlaylist(playlistId));
    },
    loadPlaylistsIfNeeded: () => {
      dispatch(loadPlaylistsIfNeeded());
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistsView);

