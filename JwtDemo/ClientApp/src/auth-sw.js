
var accessToken = null;
var refreshToken = null;
var expiresIn = 0;

const emptyRoleArray = [];
var roles = emptyRoleArray;

const channel = new BroadcastChannel('sw-messages');

addEventListener('fetch', async (event) => {

  if (event.request.url.includes('account/sign-in')) {

    event.respondWith(
      fetch(event.request).then(async function (response) {
        if (response.ok) {

          let jsonResponse = await response.json();

          self.accessToken = jsonResponse.accessToken;
          self.refreshToken = jsonResponse.refreshToken;
          self.expiresIn = jsonResponse.expiresIn;
          self.roles = self.getUserRoles();
          return new Response(JSON.stringify(self.roles), response);

        }
        else {
          return response;
        }
      })
    );

  }
  else if (event.request.url.includes('account/sign-out')) {

    const body = JSON.stringify(self.refreshToken);
    const { cache, credentials, headers, integrity, method, mode, redirect, referrer } = event.request;
    const init = { body, cache, credentials, headers, integrity, method, mode, redirect, referrer };
    init.headers = { "Content-Type": "application/json", "Authorization": `Bearer ${self.accessToken}` };
    event.respondWith(fetch(event.request.url, init).then(async response => {


      if (!response.ok && response.status === 401) {

        const seconds = Math.floor(Date.now() / 1000);
        if (!!self.expiresIn && self.expiresIn <= seconds) {
  
          await self.refreshAccessToken();
        }

        init.headers = { "Content-Type": "application/json", "Authorization": `Bearer ${self.accessToken}` };

       
        return fetch(event.request.url, init).then(response => {
          self.refreshToken = null;
          self.accessToken = null;
          self.expiresIn = 0;
          self.roles = [];
          return response;
        });

      }

      self.refreshToken = null;
      self.accessToken = null;
      self.expiresIn = 0;
      self.roles = [];
      return response;

    }));
  }
  else {
    event.respondWith(fetch(event.request).then(async response => {

      if (!response.ok && response.status === 401) {
        const seconds = Math.floor(Date.now() / 1000);
        if (!!self.expiresIn && self.expiresIn <= seconds) {
          await self.refreshAccessToken();
        }
        let newRequest = new Request(event.request, {
          headers: { "Authorization": `Bearer ${self.accessToken}` },
        });
        return fetch(newRequest).then(response => { return response; });
      }
      return response;

    }));

  }

}
);

addEventListener('message', async ({ data }) => {

  switch (data.type) {
    case "getRoles":
      channel.postMessage({ type: "getRoles", data: self.roles });
      break;
    case "actExists":
      channel.postMessage({ type: "actExists", data: self.accessTokenExists() });
      break;
    case "rftExists":
      channel.postMessage({ type: "rftExists", data: self.refreshTokenExists() });
      break;
    case "bothExist":
      channel.postMessage({ type: "bothExist", data: self.tokensExist() });
      break;
    case "checkRefresh":
      const expired = await self.checkRefreshTokenExpiration();
      channel.postMessage({ type: "checkRefresh", data: expired });
      break;
  }

});


function refreshTokenExists() {
  return !!self.refreshToken;
}

function accessTokenExists() {
  return !!self.accessToken;
}

function tokensExist() {
  return self.refreshTokenExists() && self.accessTokenExists();
}

function getUserRoles() {
  if (self.accessToken) {
    let decodedJwt = parseJwt(self.accessToken);
    return decodedJwt.roles;
  }
  else return emptyRoleArray;
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(self.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);// as JsonWebToken;
};

async function checkRefreshTokenExpiration() {
  const rawResponse = await fetch('/refreshToken/is-active/' + self.refreshToken, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  const content = await rawResponse.json();
  return content;
}

async function refreshAccessToken() {

  const rawResponse = await fetch('/refreshToken/refresh/' + self.refreshToken, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  const content = await rawResponse.json();
  self.accessToken = content.accessToken;
  self.refreshToken = content.refreshToken;
  self.expiresIn = content.expiresIn;
  // return content;
}
