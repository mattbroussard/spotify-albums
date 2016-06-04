
import * as $ from "jquery";
import * as React from "react";
import * as ReactDom from "react-dom";

import {Album, AlbumImage} from "../store";

let density = () => window.devicePixelRatio || 1;

class AlbumImageView extends React.Component<{album: Album}, {width: number}> {
  private resizeCheckInterval: any;

  constructor(props) {
    super(props);
    this.state = {width: 250 * density()};
  }

  componentDidMount() {
    this.resizeCheckInterval = setInterval(() => {
      var width = $(ReactDom.findDOMNode(this)).width() * density();
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

      // Images are stored largest-first. So this should get the smallest image
      // that is larger than the display width, or the largest image if all are
      // smaller than the display width.
      _.each(album.images, (image: AlbumImage) => {
        if (!imageSrc || image.width >= this.state.width) {
          cur = image.width;
          imageSrc = image.url;
        }
      });
    }

    var img = imageSrc ? <img src={imageSrc} title={album.name} /> : null;
    return (
      <div className="square-image-container">
        <span className="dummy">&nbsp;</span>
        {img}
      </div>
    );
  }
}

export default AlbumImageView;
