import * as React from "react";
import {connect} from "react-redux";

import {RootState} from "../store";
import AuthButton from "./AuthButton";
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

  render() {
    if (this.props.authed) {
      return (
        <div>
          <h1>Successfully authenticated!</h1>
          <AlbumsView
            playlistId={this.state.selectedPlaylist} />
          <PlaylistsViewWithFilter
            onSelectPlaylist={(id) => this.setState({selectedPlaylist: id})}
            selectedPlaylist={this.state.selectedPlaylist} />
        </div>
      );
    } else {
      return <AuthButton />;
    }
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