
export interface RemoteData<T> {
  loading: boolean;
  invalid: boolean;
  items: {[id: string]: T};
}

interface RemotePtr {
  href: string;
  total?: number;
}

export function emptyRemoteData(): any { // RemoteData
  return {
    loading: false,
    invalid: true,
    items: {},
  };
}

// https://developer.spotify.com/web-api/object-model/#user-object-public
export interface PlaylistOwner {
  id: string;
}

// https://developer.spotify.com/web-api/object-model/#playlist-object-full
export interface Playlist {
  id: string;
  name: string;
  uri: string;
  owner: PlaylistOwner;
  tracks: RemotePtr;
}
export type Playlists = RemoteData<Playlist>;

// https://developer.spotify.com/web-api/object-model/#track-object-full
export interface Track {
  id: string;
  name: string;
  uri: string;
  artists: Artist[];
  album: Album;
}

export interface PlaylistItem {
  track: Track;
}

export interface Artist {
  id: string;
  name: string;
  uri: string;
}

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
  artist?: Artist;
}

export type Albums = RemoteData<Album>;
export interface AlbumsByPlaylist {
  [id: string]: Albums;
}

export interface RootState {
  accessToken?: string;
  playlists: Playlists;
  albums: AlbumsByPlaylist;
}
