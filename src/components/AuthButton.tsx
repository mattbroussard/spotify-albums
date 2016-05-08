import * as React from "react";
import {doLogin} from "../spotify";

export class AuthButton extends React.Component<any, any> {
  onClick(event: any): void {
    doLogin();
  }

  render() {
    return (<button onClick={this.onClick}>Auth with Spotify</button>);
  }
}