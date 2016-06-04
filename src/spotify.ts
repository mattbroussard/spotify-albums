
import * as $ from "jquery";
import * as _ from 'lodash';

import {Playlist, Track} from "./store";

const DEFAULT_PAGE_LIMIT = 20;
const REDIRECT_URI = window.location.origin + "/oauth_callback.html";
const SPOTIFY_API_PREFIX = "https://api.spotify.com";
const CLIENT_ID = "3a0d380877cd4590ab63a7c2c1cd1faa";
const SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
];

function getAuthorizeURL() {
  return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
      '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
      '&scope=' + encodeURIComponent(SCOPES.join(' ')) +
      '&response_type=token';
}

export function doLogin() {
  window.open(getAuthorizeURL(), 'Spotify',
    'menubar=no,location=no,resizable=no,scrollbars=no,' +
    'status=no,width=450,height=730');
}

function paginatedAPICall(path: string, accessToken: string, data = {}, pageLimit: number = -1,
    callback: (items: any[], done: boolean) => void, errorCallback?: (jqXHR: any) => void) {
  var prefix = path.indexOf(SPOTIFY_API_PREFIX) == 0 ? "" : SPOTIFY_API_PREFIX;

  $.ajax({
    url: prefix + path,
    headers: {
      "Authorization": "Bearer " + accessToken,
    },
    data: data,
  }).then((data, textStatus, jqXHR) => {
    var items = data["items"] || [];
    var done = !data["next"] || pageLimit == 1 || !items;
    callback(items, done);
    if (!done) {
      paginatedAPICall(data["next"], accessToken, {}, pageLimit - 1, callback, errorCallback);
    }
  }).fail((jqXHR, textStatus, errorThrown) => {
    if (errorCallback) {
      errorCallback(jqXHR);
    }
  });
}

export function getPlaylists(accessToken: string,
    callback: (playlists: Playlist[], done?: boolean) => void,
    errorCallback?: (jqXHR: any) => void) {
  paginatedAPICall("/v1/me/playlists", accessToken,
      {
        limit: 50,
        fields: "items(id,name,uri,owner,tracks),next",
      },
      DEFAULT_PAGE_LIMIT,
      (playlists, done) => {
        callback(<Playlist[]> playlists, done);
      },
      errorCallback);
}

export function getTracksForPlaylist(accessToken: string, playlistId: string,
    ownerId: string, callback: (tracks: Track[], done?: boolean) => void,
    errorCallback?: (jqXHR: any) => void) {
  var url = "/v1/users/" + encodeURIComponent(ownerId) + "/playlists/" +
      encodeURIComponent(playlistId) + "/tracks";
  paginatedAPICall(url, accessToken,
      {
        limit: 50,
        fields: "items(track(artists(name,uri,id),album(images,name,uri,id,artists))),next",
      },
      DEFAULT_PAGE_LIMIT,
      (playlistItems, done) => {
        // apparently _.pluck is no more...
        callback(<Track[]> _.map(playlistItems, "track"), done);
      },
      errorCallback);
}