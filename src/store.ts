
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {rootReducer} from './reducers';

interface RemoteData<T> {
  loading: boolean;
  invalid: boolean;
  items: {[id: string]: T};
}

// https://developer.spotify.com/web-api/object-model/#playlist-object-full
export interface Playlist {
  id: string;
  name: string;
  uri: string;

  // Transformed from API
  tracks: string[];
}
export type Playlists = RemoteData<Playlist>;

// https://developer.spotify.com/web-api/object-model/#track-object-full
export interface Track {
  id: string;
  name: string;
  uri: string;

  // transformed from API
  artists: string[];
  album: string;
}
export type Tracks = RemoteData<Track>;

// https://developer.spotify.com/web-api/object-model/#image-object
export interface AlbumImage {
  width: number;
  height: number;
  url: string;
}

// https://developer.spotify.com/web-api/object-model/#album-object-full
export interface Album {
  id: string;
  name: string;
  uri: string;
  images: AlbumImage[];

  // transformed from API
  artist: string;

}
export type Albums = RemoteData<Album>;

export interface RootState {
  accessToken?: string;
  playlists: Playlists;
  tracks: Tracks;
  albums: Albums;
}

export function configureStore(initialState?) {
  return createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
}
