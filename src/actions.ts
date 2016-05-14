
import * as $ from "jquery";

import {Playlists} from "./store";
import {getPlaylists} from "./spotify";

export enum ActionType {
  AuthSuccess,
  RequestedPlaylists,
  ReceivedPlaylists,
}

function loadPlaylists() {
  return (dispatch, getState) => {
    dispatch({
      type: ActionType.RequestedPlaylists,
    });

    var accessToken = getState().accessToken;
    getPlaylists(accessToken, (playlists, done) => {
      // TODO: flatten tracks/albums here + make subsequent API calls

      dispatch({
        type: ActionType.ReceivedPlaylists,
        done: done,
        playlists: playlists,
      });
    });
  };
}

export function loadPlaylistsIfNeeded() {
  return (dispatch, getState) => {
    var { accessToken, playlists } = getState();
    if (!playlists.loading && playlists.invalid && !!accessToken) {
      return dispatch(loadPlaylists());
    }
  }
}
