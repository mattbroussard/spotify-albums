
import * as _ from 'lodash';
import {combineReducers} from 'redux';

import {RootState, Playlists, Albums, AlbumsByPlaylist, emptyRemoteData} from './store';
import {ActionType} from './actions';

function accessToken(state: string = null, action): string {
  switch (action.type) {
    case ActionType.AuthSuccess:
      return action.accessToken;

    case ActionType.Logout:
    case ActionType.ReauthNeeded:
      return null;
  }
  return state;
}

function playlists(state: Playlists = emptyRemoteData(), action): Playlists {
  switch (action.type) {
    case ActionType.RequestedPlaylists:
      return <Playlists> _.extend({}, state, {loading: true});

    case ActionType.ReceivedPlaylists:
      var oldItems = state.invalid ? {} : state.items;
      var newItems = {};
      action.playlists.forEach((playlist) => {
        newItems[playlist.id] = playlist;
      });

      return <Playlists> {
        loading: !action.done,
        invalid: false,
        items: _.extend({}, oldItems, newItems),
      };

    case ActionType.Logout:
    case ActionType.ClearPlaylists:
      return emptyRemoteData();

    case ActionType.LoadPlaylistsError:
      if (action.autoRetry) {
        return emptyRemoteData();
      } else {
        return <Playlists> _.extend(emptyRemoteData(), {error: true});
      }

    case ActionType.DismissLoadPlaylistsError:
      return <Playlists> _.extend({}, state, {error: false});
  }
  return state;
}

function albums(state: AlbumsByPlaylist = {}, action): AlbumsByPlaylist {
  var newData: Albums;
  switch (action.type) {
    case ActionType.RequestedAlbums:
      var data = _.extend(emptyRemoteData(), state[action.playlistId], {loading: true});
      return <AlbumsByPlaylist> _.extend({}, state, {[action.playlistId]: data});

    case ActionType.ReceivedAlbums:
      var oldItems = state[action.playlistId].items;
      newData = {
        loading: !action.done,
        invalid: false,
        items: <any> _.extend({}, oldItems, action.albums)
      };

      return <AlbumsByPlaylist> _.extend({}, state, {[action.playlistId]: newData});

    case ActionType.ClearAlbums:
      if (action.playlistId in state) {
        var newCopy = _.clone(state);
        delete newCopy[action.playlistId];
        return newCopy;
      }
      break;

    case ActionType.Logout:
    case ActionType.ClearPlaylists:
      return {};

    case ActionType.LoadAlbumsError:
      var remoteData = emptyRemoteData();
      if (!action.autoRetry) {
        remoteData.error = true;
      }
      return <AlbumsByPlaylist> _.extend({}, state, {[action.playlistId]: remoteData});

    case ActionType.DismissLoadAlbumsError:
      newData = <Albums> _.extend({}, state[action.playlistId], {error: false});
      return <AlbumsByPlaylist> _.extend({}, state, {[action.playlistId]: newData});
  }
  return state;
}

function everSuccessfullyAuthenticated(state: boolean = false, action) {
  switch (action.type) {
    case ActionType.AuthSuccess:
      return true;

    case ActionType.Logout:
      return false;
  }
  return state;
}

export var rootReducer = combineReducers({
  accessToken,
  playlists,
  albums,
  everSuccessfullyAuthenticated,
});
