
import * as _ from 'lodash';
import {combineReducers} from 'redux';

import {RootState, Playlists, Tracks, Albums} from './store';
import {ActionType} from './actions';

function emptyRemoteData(): any {
  return {
    loading: false,
    invalid: true,
    items: {},
  };
}

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
        loading: false,
        invalid: false,
        items: _.extend({}, oldItems, newItems),
      };
  }
  return state;
}

function tracks(state: Tracks = emptyRemoteData(), action): Tracks {
  return state;
}

function albums(state: Albums = emptyRemoteData(), action): Albums {
  return state;
}

export var rootReducer = combineReducers({
  accessToken,
  playlists,
  tracks,
  albums,
});
