import * as React from "react";
import {connect} from "react-redux";

import {RootState} from "../store";
import Header from "./Header";
import AuthPage from "./AuthPage";
import PlaylistsViewWithFilter from "./PlaylistsViewWithFilter";
import AlbumsView from "./AlbumsView";

interface State {
  selectedPlaylist: string;
}

interface StateProps {
  authed: boolean;
}

class App extends React.Component<StateProps, State> {
  constructor(props) {
    super(props);
    this.state = {selectedPlaylist: null};
  }

  componentWillUpdate(nextProps) {
    // Prevent keeping stale selectedPlaylist around after logout
    // If we did, we'd try to load it in the albums view after logging back
    // in before having an ownerId for it.
    if (this.props.authed && !nextProps.authed) {
      this.setState({selectedPlaylist: null});
    }
  }

  render() {
    var innerContent = this.props.authed ? [
      <div key="left-sidebar" className="left-sidebar">
        <PlaylistsViewWithFilter
          onSelectPlaylist={(id) => this.setState({selectedPlaylist: id})}
          selectedPlaylist={this.state.selectedPlaylist} />
      </div>,
      <div key="right-content" className="right-content">
        <AlbumsView
          playlistId={this.state.selectedPlaylist} />
      </div>
    ] : (<AuthPage />);

    return (
      <div className="main-page">
        <Header
          showMenu={this.props.authed}
          selectedPlaylist={this.state.selectedPlaylist} />
        <div className="content">
          {innerContent}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    authed: !!state.accessToken,
  };
}

export default connect<StateProps, {}, {}>(
  mapStateToProps
)(App);