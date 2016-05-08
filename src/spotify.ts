
import * as $ from "jquery";

import {Playlist} from "./store";

const DEFAULT_PAGE_LIMIT = 20;
const REDIRECT_URI = "http://localhost:8000/oauth_callback.html";
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
    callback: (items: any[], done: boolean) => void) {
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
      paginatedAPICall(data["next"], accessToken, {}, pageLimit - 1, callback);
    }
  });
}

export function getPlaylists(accessToken,
    callback: (playlists: Playlist[], done?: boolean) => void) {
  paginatedAPICall("/v1/me/playlists", accessToken,
      {
        limit: 50,
        // fields: "",
      },
      DEFAULT_PAGE_LIMIT,
      (playlists, done) => {
        callback(<Playlist[]> playlists, done);
      });
}