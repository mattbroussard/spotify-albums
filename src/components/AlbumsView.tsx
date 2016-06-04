
import * as $ from "jquery";
import * as _ from "lodash";
import * as React from "react";
import * as ReactDom from "react-dom";
import {connect} from "react-redux";

import {RootState, Album, Albums, emptyRemoteData} from "../store";
import {loadAlbumsIfNeeded, dismissLoadAlbumsError} from "../actions";
import ErrorDialog from "./ErrorDialog";
import LoadingIndicator from "./LoadingIndicator";
import AlbumItem from "./AlbumItem";

interface OwnProps {
  playlistId: string;
}

interface DispatchProps {
  loadAlbumsIfNeeded: (playlistId: string) => void;
  retryLoading: (playlistId: string) => void;
}

type StateProps = Albums;

type AllProps = OwnProps & StateProps & DispatchProps;

class AlbumsView extends React.Component<AllProps, {}> {
  componentWillMount() {
    this.props.loadAlbumsIfNeeded(this.props.playlistId);
  }

  componentWillReceiveProps(nextProps) {
    this.props.loadAlbumsIfNeeded(nextProps.playlistId);
  }

  render() {
    if (this.props.error) {
      return <ErrorDialog onRetry={() => this.props.retryLoading(this.props.playlistId)} />;
    }

    if (this.props.invalid && !this.props.loading) {
      return null;
    }

    var ret = [];
    if (this.props.loading) {
      ret.push(<LoadingIndicator />);
    }

    if (!this.props.invalid) {
      ret.push(<ul>
        {_.map(this.props.items, (album: Album) => {
          return <AlbumItem album={album} />;
        })}
      </ul>);
    }

    return <div className="albums-view">{ret}</div>;
  }
}

function mapStateToProps(state: RootState, ownProps: OwnProps): StateProps {
  var albums = ownProps.playlistId ? state.albums[ownProps.playlistId] : null;
  return _.extend(emptyRemoteData(), albums) as Albums;
}

function mapDispatchToProps(dispatch): DispatchProps {
  return {
    loadAlbumsIfNeeded: (playlistId: string) => {
      if (playlistId) {
        dispatch(loadAlbumsIfNeeded(playlistId));
      }
    },
    retryLoading: (playlistId: string) => {
      dispatch(dismissLoadAlbumsError(playlistId));
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AlbumsView);
