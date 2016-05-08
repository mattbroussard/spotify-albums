import * as React from "react";
import {connect} from "react-redux";

import {AuthButton} from "./AuthButton";

class _App extends React.Component<any, any> {
  render() {
    if (this.props.authed) {
      return <h1>Successfully authenticated!</h1>;
    } else {
      return <AuthButton />;
    }
  }
}

export var App = connect((state) => {
  return {
    authed: !!state.accessToken,
  };
})(_App);