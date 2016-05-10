import * as React from "react";
import {connect} from "react-redux";

import AuthButton from "./AuthButton";
import {PlaylistsView} from "./PlaylistsView";

class App extends React.Component<any, any> {
  render() {
    if (this.props.authed) {
      return (
        <div>
          <h1>Successfully authenticated!</h1>
          <PlaylistsView />
        </div>
      );
    } else {
      return <AuthButton />;
    }
  }
}

export default connect((state) => {
  return {
    authed: !!state.accessToken,
  };
})(App);