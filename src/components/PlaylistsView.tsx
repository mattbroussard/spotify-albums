
import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";

import {RootState, Playlist, Playlists} from "../store";
import {loadPlaylistsIfNeeded, selectPlaylist} from "../actions";

interface ExternalProps {
  filter: string;
}

type ReduxProps = Playlists & {
  onSelectPlaylist: (id: string) => void;
  loadPlaylistsIfNeeded: () => void;
};

type Props = ReduxProps & ExternalProps;

class PlaylistsView extends React.Component<Props, {}> {
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

function mapStateToProps(state: RootState) {
  return _.extend({}, state.playlists);
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectPlaylist: (playlistId) => {
      dispatch(selectPlaylist(playlistId));
    },
    loadPlaylistsIfNeeded: () => {
      dispatch(loadPlaylistsIfNeeded());
    }
  };
}

// "as ComponentClass" is to workaround this:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8787#issuecomment-206482943
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistsView) as React.ComponentClass<ExternalProps>;

