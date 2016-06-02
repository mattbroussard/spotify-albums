
import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";

import {RootState, Playlist, Playlists} from "../store";
import {loadPlaylistsIfNeeded, dismissLoadPlaylistsError} from "../actions";
import ErrorDialog from "./ErrorDialog";

type StateProps = Playlists;

interface OwnProps {
  filterFn: (playlist: Playlist) => boolean;
  selectedPlaylist: string;
  onSelectPlaylist: (id: string) => void;
}

interface DispatchProps {
  loadPlaylistsIfNeeded: () => void;
  retryLoading: () => void;
}

type AllProps = StateProps & DispatchProps & OwnProps;

class PlaylistsView extends React.Component<AllProps, {}> {
  componentWillMount() {
    this.props.loadPlaylistsIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    this.props.loadPlaylistsIfNeeded();
  }

  render(): any {
    if (this.props.error) {
      return <ErrorDialog onRetry={() => this.props.retryLoading()}/>;
    }

    var ret = [];
    if (this.props.loading) {
      ret.push(<div>Loading</div>);
    }

    if (!this.props.invalid) {
      ret.push(
        <ul>
          {_.map(this.props.items, (playlist: Playlist) => {
            if (this.props.filterFn && !this.props.filterFn(playlist)) {
              return null;
            }

            let selected: boolean = this.props.selectedPlaylist == playlist.id;

            return (
              <li
                className={selected ? "selected" : null}
                onClick={this.props.onSelectPlaylist.bind(null, playlist.id)}>
                {playlist.name}
              </li>
            );
          })}
        </ul>
      );
    }

    return <div className="playlists-view">{ret}</div>;
  }
}

function mapStateToProps(state: RootState): StateProps {
  return _.extend({}, state.playlists) as Playlists;
}

function mapDispatchToProps(dispatch): DispatchProps {
  return {
    loadPlaylistsIfNeeded: () => {
      dispatch(loadPlaylistsIfNeeded());
    },
    retryLoading: () => {
      dispatch(dismissLoadPlaylistsError());
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistsView);

