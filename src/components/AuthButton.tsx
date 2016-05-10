import * as $ from "jquery";
import * as React from "react";
import {connect} from "react-redux";

import {doLogin} from "../spotify";
import {ActionType} from "../actions";

class AuthButton extends React.Component<any, any> {
  componentWillMount(): void {
    $(window).on("message.AuthButton", (event) => {
      var msg = (event.originalEvent as any).data;
      // Looks like Redux DevTools extension uses postMessage...
      if (!("is_oauth_callback" in msg)) {
        return;
      }

      if ("access_token" in msg) {
        this.props.dispatch({
          type: ActionType.AuthSuccess,
          accessToken: msg["access_token"],
        });
      } else {
        alert("Authentication with Spotify failed :(");
      }
    });
  }

  componentWillUnmount(): void {
    $(window).off(".AuthButton");
  }

  onClick(): void {
    doLogin();
  }

  render() {
    return (<button onClick={this.onClick}>Auth with Spotify</button>);
  }
}

export default connect()(AuthButton);