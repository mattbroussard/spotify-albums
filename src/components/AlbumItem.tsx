
import * as React from "react";

import {Album} from "../store";
import AlbumImageView from "./AlbumImageView";

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

export default AlbumItem;
