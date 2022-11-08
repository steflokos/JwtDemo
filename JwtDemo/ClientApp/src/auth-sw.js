
var accessToken = null;
var refreshToken = null;
var expiresIn = 0;

const emptyRoleArray = [];
var roles = emptyRoleArray;

const channel = new BroadcastChannel('sw-messages');

addEventListener('fetch', async (event) => {

  console.log('http-intercepted', event.request);


  if (event.request.url.includes('account/sign-in')) {

    event.respondWith(
      fetch(event.request).then(async function (response) {
        if (response.ok) {
          let jsonResponse = await response.json();

          accessToken = jsonResponse.accessToken;
          refreshToken = jsonResponse.refreshToken;
         
          expiresIn = jsonResponse.expiresIn;
          console.log("expires in",expiresIn);
          roles = getUserRoles();

          return new Response(JSON.stringify(roles), response);
        
        }
        else{
          return response;
        }
      })
    )

  }

  else if(event.request.url.includes('account/sign-out')){

    const body = JSON.stringify(refreshToken);
    const {cache, credentials, headers, integrity, method,mode, redirect, referrer} = event.request;
    const init = {body, cache, credentials, headers, integrity, method,mode, redirect, referrer};


    event.respondWith(fetch(event.request.url,init).then(async response =>{

      if(!response.ok && response.status === 401) {
        const seconds = Math.floor(Date.now() / 1000);
        if(!!expiresIn && expiresIn <= seconds) {
          await refreshAccessToken()
        }
          init.headers={headers: {"Authorization": `Bearer ${accessToken}`}}

        refreshToken=null;
        accessToken=null;
        expiresIn=0;

        return fetch(event.request.url,init).then(response => {return response});

      }
      return response;
      
    }));
  }
  else {
    
      event.respondWith(fetch(event.request).then(async response =>{

        if(!response.ok && response.status === 401) {
          const seconds = Math.floor(Date.now() / 1000);
          if(!!expiresIn && expiresIn <= seconds) {
            await refreshAccessToken()
          }
            let newRequest = new Request(event.request, {
              headers: {"Authorization": `Bearer ${accessToken}`},
          });
          return fetch(newRequest).then(response => {return response});
        }
        return response;
        
      }));
    
  }

  }
);

addEventListener('message', async ({ data }) => {
  console.log("tora mpike ston listner me ", data, data.type);

  switch (data.type) {
    case "getRoles":
      channel.postMessage({ type: "getRoles", data: roles });
      break;
    case "actExists":
      channel.postMessage({ type: "actExists", data: accessTokenExists() });
      break;
    case "rftExists":
      channel.postMessage({ type: "rftExists", data: refreshTokenExists() });
      break;
    case "bothExist":
      channel.postMessage({ type: "bothExist", data: tokensExist() });
      break;
    case "checkRefresh":
      const expired = await checkRefreshTokenExpiration();
      channel.postMessage({ type: "checkRefresh", data: expired });
      break;
  }

});


function refreshTokenExists() {
  return !!refreshToken;
}

function accessTokenExists() {
  return !!accessToken;
}

function tokensExist() {
  return refreshTokenExists() && accessTokenExists();
}

function getUserRoles() {
  if (accessToken) {
    let decodedJwt = parseJwt(accessToken);
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
  const rawResponse = await fetch(environment.refreshTokenAPI + 'is-active/' + refreshToken, {
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

  const rawResponse = await fetch('/refreshToken/refresh/' + refreshToken, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  const content = await rawResponse.json();
  accessToken = content.accessToken;
  refreshToken = content.refreshToken;
  expiresIn = content.expiresIn;
  // return content;
}
