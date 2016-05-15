
import * as $ from "jquery";
import * as _ from "lodash";
import * as React from "react";
import * as ReactDom from "react-dom";
import {connect} from "react-redux";

import {RootState, AlbumsByPlaylist, Album, Albums, emptyRemoteData, AlbumImage} from "../store";
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
          return <AlbumItem album={album} />;
        })}
      </ul>);
    }

    return <div className="albums-view">{ret}</div>;
  }
}

class AlbumItem extends React.Component<{album: Album}, {}> {
  onClick() {
    window.location = this.props.album.uri as any;
  }

  render() {
    let album = this.props.album;

    // Albums from local tracks may be missing a link. We can't do anything
    // with them, so don't show them.
    if (!album.uri) return null;

    return (
      <li onClick={this.onClick.bind(this)}>
        <AlbumImageView album={album} />
        <div className="album-info">
          <div className="album-title">{album.name}</div>
          <div className="album-artist">{album.artist.name}</div>
        </div>
      </li>
    );
  }
}

class AlbumImageView extends React.Component<{album: Album}, {width: number}> {
  private resizeCheckInterval: any;

  constructor(props) {
    super(props);
    this.state = {width: 200};
  }

  componentDidMount() {
    this.resizeCheckInterval = setInterval(() => {
      var width = $(ReactDom.findDOMNode(this)).width();
      if (width > this.state.width) {
        this.setState({width});
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.resizeCheckInterval);
  }

  render() {
    let album = this.props.album;

    var imageSrc: string = null;
    if (album.images) {
      var cur = Infinity;
      _.each(album.images, (image: AlbumImage) => {
        if (image.width >= this.state.width && image.width < cur) {
          cur = image.width;
          imageSrc = image.url;
        }
      });
    }

    var img = imageSrc ? <img src={imageSrc} title={album.name} /> : null;
    return (
      <div className="square-image-container">
        {img}
      </div>
    );
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
