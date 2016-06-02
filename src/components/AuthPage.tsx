import * as $ from "jquery";
import * as React from "react";
import {connect} from "react-redux";

import {doLogin} from "../spotify";
import {ActionType} from "../actions";
import {RootState} from "../store";

interface StateProps {
  everSuccessfullyAuthenticated: boolean;
}

interface DispatchProps {
  onAuthSuccess: (accessToken: string) => void;
}

type AllProps = StateProps & DispatchProps;

class AuthPage extends React.Component<AllProps, {}> {
  componentWillMount(): void {
    $(window).on("message.AuthPage", (event) => {
      var msg = (event.originalEvent as any).data;
      // Looks like Redux DevTools extension uses postMessage...
      if (!("is_oauth_callback" in msg)) {
        return;
      }

      if ("access_token" in msg) {
        this.props.onAuthSuccess(msg["access_token"]);
      } else {
        // TODO: handle this better
        alert("Authentication with Spotify failed :(");
      }
    });
  }

  componentWillUnmount(): void {
    $(window).off(".AuthPage");
  }

  onClick(): void {
    doLogin();
  }

  render() {
    var reauthMessage = null;
    if (this.props.everSuccessfullyAuthenticated) {
      reauthMessage = (
        <div className="reauth-message">
          <h1>Sorry for the interruption...</h1>
          <p>Your Spotify login token has expired. Please login again.</p>
        </div>
      );
    }

    return (
      <div className="auth-page">
        {reauthMessage}
        <button
          className="auth-button"
          onClick={this.onClick}>Login with Spotify</button>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  (state: RootState) => {
    return {everSuccessfullyAuthenticated: state.everSuccessfullyAuthenticated};
  },

  // mapDispatchToProps
  (dispatch) => {
    return {
      onAuthSuccess: (accessToken) => {
        dispatch({
          type: ActionType.AuthSuccess,
          accessToken: accessToken,
        });
      }
    }
  }
)(AuthPage);
