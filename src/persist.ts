
import * as _ from "lodash";

import {RootState, RemoteData, Playlist} from "./store";

const LOCALSTORAGE_KEY = "spotify-albums";
const CURRENT_SCHEMA_VERSION = 2;

export function loadPersistentData(): RootState {
  var json: any = window.localStorage.getItem(LOCALSTORAGE_KEY);
  if (json) {
    try {
      json = JSON.parse(json);
    } catch (e) {
      clearPersistentData();
      json = null;
    }
  }

  if (!json || !json.__schemaVersion || json.__schemaVersion != CURRENT_SCHEMA_VERSION) {
    json = null;
    clearPersistentData();
  } else {
    // Redux doesn't need to know about this.
    delete json['__schemaVersion'];
  }

  // Need to return undefined so that we don't set the state to null when
  // nothing's stored.
  return json || undefined;
}

function remoteDataIsClean<T>(data: RemoteData<T>): boolean {
  return data && !(data.loading || data.invalid);
}

function rootStateIsClean(data: RootState): boolean {
  return (
    data &&
    !!data.accessToken &&
    remoteDataIsClean<Playlist>(data.playlists) &&
    _.every(data.albums, remoteDataIsClean)
  );
}

export function persistIfClean(state: RootState): void {
  if (rootStateIsClean(state)) {
    var json: any = JSON.stringify(_.extend({}, state, {__schemaVersion: CURRENT_SCHEMA_VERSION}));
    window.localStorage.setItem(LOCALSTORAGE_KEY, json);
  }
}

export function clearPersistentData(): void {
  try {
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  } catch (e) {}
}
