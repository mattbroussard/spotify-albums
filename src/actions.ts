
import * as $ from "jquery";

import {Playlists} from "./store";
import {getPlaylists} from "./spotify";

export enum ActionType {
  AuthSuccess,
  SelectPlaylist,
  RequestedPlaylists,
  ReceivedPlaylists,
}

function loadPlaylists() {
  return (dispatch, getState) => {
    dispatch({
      type: ActionType.RequestedPlaylists,
    });

    var accessToken = getState().accessToken;
    getPlaylists(accessToken, (playlists) => {
      // TODO: flatten tracks/albums here + make subsequent API calls

      dispatch({
        type: ActionType.ReceivedPlaylists,
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

export function selectPlaylist(id: string) {
  return {
    type: ActionType.SelectPlaylist,
    id: id,
  };
}
