import * as React from "react";

import {spotifyDataStore} from "../spotify";
import {AuthButton} from "./AuthButton";

export class App extends React.Component<any, any> {
  private observerId: number = null;

  constructor(props: any) {
    super(props);
    this.state = {
      authed: spotifyDataStore.isAuthenticated(),
    };
  }

  componentWillMount() {
    this.observerId = spotifyDataStore.addObserver(() => {
      this.setState({
        authed: spotifyDataStore.isAuthenticated(),
      });
      if (this.state.authed) {
        spotifyDataStore.get("/v1/me/playlists", {limit: 50}, (data) => {
          alert("got " + data.length + " playlists!");
          console.log(data);
        });
      }
    });
  }

  componentWillUnmount() {
    spotifyDataStore.removeObserver(this.observerId);
  }

  render() {
    if (this.state.authed) {
      return <h1>Successfully authenticated!</h1>;
    } else {
      return <AuthButton />;
    }
  }
}
