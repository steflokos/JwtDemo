import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CustomHttpResponse } from '../models/response';
import { Role } from '../models/role';
import { SignInRequest } from '../models/sign-in-request';

@Injectable({
  providedIn: 'root'
})

export class WorkerManagerService {
  private worker;
  constructor() {

    this.worker = new Worker(new URL('../auth.worker', import.meta.url));
  }

  public async signIn(signInRequest: SignInRequest) {

    return new Promise<CustomHttpResponse>((resolve, reject) => {
      let messageData = { type: "signIn", request: signInRequest };
      this.worker.onmessage = ({ data }) => {
        if (data.type === "signIn") {
          resolve(data.data);
        }
      };
      this.worker.postMessage(messageData);
    });
  }

  public async setHeaders(givenRequest: HttpRequest<any>) {

    return new Promise<HttpRequest<any>>((resolve, reject) => {
      let data = { type: "setHeaders", request: givenRequest };
      this.worker.onmessage = ({ data }) => {
        if (data.type === "setHeaders") {
          resolve(data.data);
        }

      };
      this.worker.postMessage(data);

    });
  }

  public async refreshToken() {
    return new Promise<any>((resolve, reject) => {
      let data = { type: "refresh", request: null };
      this.worker.onmessage = ({ data }) => {
        if (data.type === "refresh") {
          resolve(data.data);
        }
      };
      this.worker.postMessage(data);

    });
  }
  public async checkRefreshTokenExpiration() {

    return new Promise<boolean>((resolve, reject) => {
      let data = { type: "checkRefresh", request: null };
      this.worker.onmessage = ({ data }) => {
        if (data.type === "checkRefresh") {
          resolve(data.data);
        }
      };
      this.worker.postMessage(data);

    });
  }

  public async accessTokenExists() {
    return new Promise<boolean>((resolve, reject) => {
      let data = { type: "actExists", request: null };
      this.worker.onmessage = ({ data }) => {
        if (data.type === "actExists") {
          resolve(data.data);
        }
      };
      this.worker.postMessage(data);

    });
  }

  public async refreshTokenExists() {
    return new Promise<boolean>((resolve, reject) => {
      let data = { type: "rftExists", request: null };
      this.worker.onmessage = ({ data }) => {
        if (data.type === "rftExists") {
          resolve(data.data);
        }
      };
      this.worker.postMessage(data);

    });
  }

  public async tokenExist() {
    return new Promise<boolean>((resolve, reject) => {
      let data = { type: "bothExist", request: null };
      this.worker.onmessage = ({ data }) => {
        if (data.type === "bothExist") {
          resolve(data.data);
        }
      };
      this.worker.postMessage(data);
    });
  }

  public async signOut() {

  }

  public async getRoles() {
    console.log("mpike mesa sto getroles");
    return new Promise<Role[]>((resolve, reject) => {
      let messageData = { type: "getRoles", request: null };
      this.worker.onmessage = ({ data }) => {
        if (data.type === "getRoles") {
          resolve(data.data);
        }
      };
      this.worker.postMessage(messageData);

    });
  }


}
