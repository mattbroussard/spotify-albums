
import * as $ from "jquery";

import {Playlists, Track, Album, Artist} from "./store";
import {getPlaylists, getTracksForPlaylist} from "./spotify";

// This is a class instead of an enum so that human-friendly string values
// show up in Redux dev tools
export class ActionType {
  static AuthSuccess = "AuthSuccess";
  static RequestedPlaylists = "RequestedPlaylists";
  static ReceivedPlaylists = "ReceivedPlaylists";
  static RequestedAlbums = "RequestedAlbums";
  static ReceivedAlbums = "ReceivedAlbums";
}

function loadPlaylists() {
  return (dispatch, getState) => {
    var accessToken = getState().accessToken;
    // TODO: check for error (missing token?)

    dispatch({
      type: ActionType.RequestedPlaylists,
    });

    getPlaylists(accessToken, (playlists, done) => {
      dispatch({
        type: ActionType.ReceivedPlaylists,
        done: done,
        playlists: playlists,
      });
    });
  };
}

function loadAlbums(playlistId: string) {
  return (dispatch, getState) => {
    var state = getState();
    var accessToken = state.accessToken;
    var playlist = state.playlists.items[playlistId];
    var owner = playlist ? playlist.owner : null;
    var ownerId = owner ? owner.id : null;

    if (!accessToken || !ownerId) {
      // TODO: handle error
      throw new Error("missing ownerId or accessToken in loadAlbums");
    }

    dispatch({
      type: ActionType.RequestedAlbums,
      playlistId: playlistId,
    });

    getTracksForPlaylist(accessToken, playlistId, ownerId, (tracks: Track[], done) => {
      var albums: {[id: string]: Album} = {};

      _.each(tracks, (track: Track) => {
        var album: Album = track.album;
        if (album && !(album.id in albums)) {
          var artist: any = track.artists && track.artists[0];
          if (artist) {
            album.artist = <Artist> artist;
          }

          albums[album.id] = album;
        }
      });

      dispatch({
        type: ActionType.ReceivedAlbums,
        playlistId: playlistId,
        albums: albums,
        done: done,
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

export function loadAlbumsIfNeeded(playlistId: string) {
  return (dispatch, getState) => {
    var { accessToken, albums } = getState();
    albums = albums[playlistId];
    if (!!accessToken && (!albums || (!albums.loading && albums.invalid))) {
      return dispatch(loadAlbums(playlistId));
    }
  }
}