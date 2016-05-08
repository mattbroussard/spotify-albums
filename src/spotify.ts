
import * as $ from "jquery";

const REDIRECT_URI = "http://localhost:8000/oauth_callback.html";
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
