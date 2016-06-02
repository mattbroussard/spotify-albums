
import * as React from "react";
import {connect} from "react-redux";
import * as classnames from "classnames";

import {logout, refreshPlaylists, refreshAlbums} from "../actions";

interface OwnProps {
  selectedPlaylist: string;
  showMenu: boolean;
}

interface DispatchProps {
  refreshPlaylists: () => void;
  refreshAlbums: (id: string) => void;
  logout: () => void;
}

type AllProps = OwnProps & DispatchProps;

interface State {
  menuOpen: boolean;
}

class Header extends React.Component<AllProps, State> {

  constructor(props) {
    super(props);
    this.state = {menuOpen: false};
  }

  render() {
    var menu = null;
    if (this.props.showMenu) {
      var refreshCurrentItem = this.props.selectedPlaylist ?
          <li
            onClick={() => this.props.refreshAlbums(this.props.selectedPlaylist)}>
            Refresh This Playlist
          </li> : null;

      menu = (
        <button
          onClick={() => this.setState({menuOpen: !this.state.menuOpen})}
          className={classnames({
            "menu": true,
            "menu-open": this.state.menuOpen,
          })}>
          <i className="fa fa-bars" />
          <ul>
            {refreshCurrentItem}
            <li onClick={() => this.props.refreshPlaylists()}>Refresh All Playlists</li>
            <li onClick={() => this.props.logout()}>Logout</li>
          </ul>
        </button>
      );
    }

    return (
      <div className="header">
        <div className="header-left">
          Albums Lists for Spotify
        </div>
        <div className="header-right">
          <a className="about-link" href="#">About</a>
          {menu}
        </div>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch): DispatchProps {
  return {
    refreshPlaylists: () => dispatch(refreshPlaylists()),
    refreshAlbums: (playlistId: string) => dispatch(refreshAlbums(playlistId)),
    logout: () => dispatch(logout()),
  };
}

export default connect<{}, DispatchProps, OwnProps>(
  undefined,
  mapDispatchToProps
)(Header);

