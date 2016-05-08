
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

interface ObserverFunction {
  (data?: any): void;
}

class SpotifyDataStore {
  private token: string = null;
  private observers: {[observerId: number]: ObserverFunction} = {};
  private nextObserverId: number = 0;

  constructor() {
    // init from localStorage, etc.
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  setToken(token: string): void {
    this.token = token;
    this.notifyObservers();
  }

  addObserver(fn: ObserverFunction): number {
    this.nextObserverId++;
    this.observers[this.nextObserverId] = fn;
    return this.nextObserverId;
  }

  removeObserver(id: number): void {
    if (id in this.observers) {
      delete this.observers[id];
    }
  }

  private notifyObservers(data?: any) {
    Object.keys(this.observers).map((id) => {
      this.observers[Number(id)](data);
    });
  }

  get(path: string, args: any, callback: (data: any) => void): void {
    if (!this.token) {
      throw new Error("not authenticated");
    }

    var prefix = path.indexOf("https://api.spotify.com") == 0 ? "" : "https://api.spotify.com";

    $.ajax({
      url: prefix + path,
      headers: {
        "Authorization": "Bearer " + this.token,
      },
      data: args || {},
    }).then((data, textStatus, jqXHR) => {
      var items = data["items"];
      // update cache?
      if (items) {
        if (data["next"]) {
          this.get(data["next"], null, (nextItems) => {
            callback(items.concat(nextItems));
          });
        } else {
          callback(items);
        }
      } else {
        // error.
        console.error("items null");
      }
    });
  }
}
export var spotifyDataStore = new SpotifyDataStore();

$(window).on("message", (event) => {
  var msg = (event.originalEvent as any).data;
  msg = JSON.parse(msg);
  if ("access_token" in msg) {
    spotifyDataStore.setToken(msg["access_token"]);
  } else {
    alert("Authentication with Spotify failed :(");
  }
});

// window.addEventListener("message", function(event) {
//   var hash = JSON.parse(event.data);
//   if (hash.type == 'access_token') {
//     spotifyDataStore.setToken(hash.access_token);
//   }
// }, false);