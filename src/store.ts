
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {rootReducer} from './reducers';

interface RemoteData<T> {
  loading: boolean;
  invalid: boolean;
  items: {[id: string]: T};
}

// https://developer.spotify.com/web-api/object-model/#playlist-object-full
interface Playlist {
  id: string;
  name: string;
  uri: string;

  // Transformed from API
  tracks: string[];
}
type Playlists = RemoteData<Playlist>;

// https://developer.spotify.com/web-api/object-model/#track-object-full
interface Track {
  id: string;
  name: string;
  uri: string;

  // transformed from API
  artists: string[];
  album: string;
}
type Tracks = RemoteData<Track>;

// https://developer.spotify.com/web-api/object-model/#image-object
interface AlbumImage {
  width: number;
  height: number;
  url: string;
}

// https://developer.spotify.com/web-api/object-model/#album-object-full
interface Album {
  id: string;
  name: string;
  uri: string;
  images: AlbumImage[];

  // transformed from API
  artist: string;

}
type Albums = RemoteData<Album>;

interface RootState {
  accessToken?: string;
  playlists: Playlists;
  tracks: Tracks;
  albums: Albums;
}

function defaultInitialState(): RootState {
  return {
    accessToken: null,
    playlists: {
      loading: false,
      invalid: true,
      items: {},
    },
    tracks: {
      loading: false,
      invalid: true,
      items: {},
    },
    albums: {
      loading: false,
      invalid: true,
      items: {},
    },
  };
}

export function configureStore(initialState: RootState = defaultInitialState()) {
  return createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
}
