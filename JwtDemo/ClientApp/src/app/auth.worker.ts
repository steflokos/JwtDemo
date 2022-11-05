/// <reference lib="webworker" />


import { environment } from "src/environments/environment";
import { JsonWebToken } from "./models/json-web-token";
import { CustomHttpResponse } from "./models/response";
import { Role } from "./models/role";
import { SignInRequest } from "./models/sign-in-request";

const emptyRoleArray: Role[] = [];
var accessToken: string | null = null;
var refreshToken: string | null = null;
var roles = emptyRoleArray;


addEventListener('message', async ({ data }) => {
  console.log("tora mpike ston listner me ",data.type);
  switch (data.type) {
    case "signIn":
      console.log("tora mpike signin");
      const signInRes = await signIn(data.request);
      postMessage({type:"signIn",data:signInRes});
      break;
    case "setHeaders":
      const headers = addTokenHeader(data.request);
      postMessage({type:"setHeaders",data:headers});
      break;
    case "getRoles":
      console.log("mesa", roles);
      postMessage({type:"getRoles",data:roles});
      break;
    case "actExists":
      postMessage({type:"actExists",data:accessTokenExists()});
      break;
    case "rftExists":
      postMessage({type:"rftExists",data:refreshTokenExists()});
      break;
    case "bothExist":
      postMessage({type:"bothExist",data:tokensExist()});
      break;
    case "checkRefresh":
      const expired = await checkRefreshTokenExpiration();
      postMessage({type:"checkRefresh",data:expired});
      break;
    case "refresh":
      const refresh = await refreshAccessToken();
      postMessage({type:"refresh",data:refresh});
      break;

  }



  // signOut();
});

function addTokenHeader(request: any) {
  //console.log("mpike token header add ston worker before", request);
  //request.headers = new Map();
  //request.headers.set("Content-Type", "application/json");
  //console.log("reghead", request.headers.headers);
  request.headers.headers.set("authorization", [environment.bearerHeader + ' ' + accessToken]);
  request.headers.normalizedNames.set("authorization",environment.tokenHeader);
  //console.log("mpike token header add ston worker after", request);
  return request;
  //return request.clone({ headers: request.headers.set(environment.tokenHeader, environment.bearerHeader + ' ' + accessToken) });
}

async function signIn(request: SignInRequest): Promise<CustomHttpResponse> {

  const rawResponse = await fetch(environment.accountAPI + 'sign-in', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  const content = await rawResponse.json();
  refreshToken = content.refreshToken;
  accessToken = content.accessToken;

  roles = getUserRoles();

  let response: CustomHttpResponse = { status: rawResponse.status, statusText: rawResponse.statusText, body: JSON.stringify(roles), errorMessage: content.message };

  return response;

}

function refreshTokenExists() {
  return !!refreshToken;
}
function accessTokenExists() {
  return !!accessToken;
}
function tokensExist() {
  return refreshTokenExists() && accessTokenExists();
}

async function checkRefreshTokenExpiration() {
  const rawResponse = await fetch(environment.refreshTokenAPI + 'is-active/' + refreshToken, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  console.log("raw refresh", rawResponse);
  const content = await rawResponse.json();
  return content;
}

async function refreshAccessToken() {
  const rawResponse = await fetch(environment.refreshTokenAPI + 'refresh/' + refreshToken, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  const content = await rawResponse.json();
  accessToken = content.accessToken;
  return content;
}



function signOut() {

  (async () => {
    const rawResponse = await fetch(environment.accessTokenAPI + 'cancel', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      //body: JSON.stringify({})
    });
    const content = await rawResponse.json();
    console.log("signout cancel", content);
  })();

  (async () => {
    const rawResponse = await fetch(environment.refreshTokenAPI + 'revoke/' + refreshToken, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      //body: JSON.stringify({username:"admin" , password: "admin"})
    });
    const content = await rawResponse.json();
    console.log("signout revoke", content);

  })();
}

function getUserRoles() {
  if (accessToken) {
    let decodedJwt: JsonWebToken = parseJwt(accessToken);
    return decodedJwt.roles;
  }

  else return emptyRoleArray;
}

function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(self.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload) as JsonWebToken;
};



