
import * as React from "react";
import {connect} from "react-redux";

import {RootState, AlbumsByPlaylist, Album, Albums, emptyRemoteData} from "../store";
import {loadAlbumsIfNeeded} from "../actions";

interface OwnProps {
  playlistId: string;
}

interface DispatchProps {
  loadAlbumsIfNeeded: (playlistId: string) => void;
}

type StateProps = Albums;

type AllProps = OwnProps & StateProps & DispatchProps;

class AlbumsView extends React.Component<AllProps, {}> {
  componentWillMount() {
    this.props.loadAlbumsIfNeeded(this.props.playlistId);
  }

  componentWillReceiveProps(nextProps) {
    this.props.loadAlbumsIfNeeded(nextProps.playlistId || this.props.playlistId);
  }

  render() {
    if (this.props.invalid && !this.props.loading) {
      return null;
    }

    var ret = [];
    if (this.props.loading) {
      ret.push(<div>Loading albums...</div>);
    }

    if (!this.props.invalid) {
      ret.push(<ul>
        {_.map(this.props.items, (album: Album) => {
          return <li>{album.name}</li>;
        })}
      </ul>);
    }

    return <div>{ret}</div>;
  }
}

function mapStateToProps(state: RootState, ownProps: OwnProps): StateProps {
  var albums = ownProps.playlistId ? state.albums[ownProps.playlistId] : null;
  return _.extend(emptyRemoteData(), albums) as Albums;
}

function mapDispatchToProps(dispatch): DispatchProps {
  return {
    loadAlbumsIfNeeded: (playlistId) => {
      if (playlistId) {
        dispatch(loadAlbumsIfNeeded(playlistId));
      }
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AlbumsView);
