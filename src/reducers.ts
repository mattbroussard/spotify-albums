
import * as _ from 'lodash';
import {combineReducers} from 'redux';

import {RootState, Playlists, AlbumsByPlaylist, emptyRemoteData} from './store';
import {ActionType} from './actions';

function accessToken(state: string = null, action): string {
  if (action.type == ActionType.AuthSuccess) {
    return action.accessToken;
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
  }
  return state;
}

function albums(state: AlbumsByPlaylist = {}, action): AlbumsByPlaylist {
  switch (action.type) {
    case ActionType.RequestedAlbums:
      var data = _.extend(emptyRemoteData(), state[action.playlistId], {loading: true});
      return <AlbumsByPlaylist> _.extend({}, state, {[action.playlistId]: data});

    case ActionType.ReceivedAlbums:
      var oldItems = state[action.playlistId].items;
      var newData = {
        loading: !action.done,
        invalid: false,
        items: _.extend({}, oldItems, action.albums)
      };

      return <AlbumsByPlaylist> _.extend({}, state, {[action.playlistId]: newData});
  }
  return state;
}

export var rootReducer = combineReducers({
  accessToken,
  playlists,
  albums,
});
