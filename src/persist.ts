
import * as _ from "lodash";

import {RootState, RemoteData, Playlist} from "./store";

const LOCALSTORAGE_KEY = "spotify-albums";

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
    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
  }
}

export function clearPersistentData(): void {
  try {
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  } catch (e) {}
}
