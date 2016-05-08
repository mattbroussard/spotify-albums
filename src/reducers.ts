
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
