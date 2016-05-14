import * as React from "react";
import {connect} from "react-redux";

import AuthButton from "./AuthButton";
import PlaylistsViewWithFilter from "./PlaylistsViewWithFilter";

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

export default connect<StateProps, {}, {}>((state) => {
  return {
    authed: !!state.accessToken,
  };
})(App);