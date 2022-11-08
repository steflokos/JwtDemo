import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CustomHttpResponse } from '../models/response';
import { Role } from '../models/role';
import { SignInRequest } from '../models/sign-in-request';

@Injectable({
  providedIn: 'root'
})

export class WorkerManagerService {
  //private worker;
  channel = new BroadcastChannel('sw-messages');
  constructor() {

    // this.worker = new Worker(new URL('../auth.worker', import.meta.url));
  }

  public async checkRefreshTokenExpiration() {

    return new Promise<boolean>((resolve, reject) => {
      let messageData = { type: "checkRefresh", request: null };
      this.channel.onmessage = ({ data }) => {
        if (data.type === "checkRefresh") {
          resolve(data.data);
        }
      };
      navigator.serviceWorker.ready.then(registration => {
        const reg = registration.active;
        if (reg) {
          reg.postMessage(messageData);
        }
      });
    });
  }

  public async accessTokenExists() {
    return new Promise<boolean>((resolve, reject) => {
      let messageData = { type: "actExists", request: null };
      this.channel.onmessage = ({ data }) => {
        if (data.type === "actExists") {
          resolve(data.data);
        }
      };
      navigator.serviceWorker.ready.then(registration => {
        const reg = registration.active;
        if (reg) {
          reg.postMessage(messageData);
        }
      });

    });
  }

  public async refreshTokenExists() {
    return new Promise<boolean>((resolve, reject) => {
      let messageData = { type: "rftExists", request: null };
      this.channel.onmessage = ({ data }) => {
        if (data.type === "rftExists") {
          resolve(data.data);
        }
      };
      navigator.serviceWorker.ready.then(registration => {
        const reg = registration.active;
        if (reg) {
          reg.postMessage(messageData);
        }
      });

    });
  }

  public async tokensExist() {
    return new Promise<boolean>((resolve, reject) => {
      let messageData = { type: "bothExist", request: null };

      this.channel.onmessage = ({ data }) => {
        if (data.type === "bothExist") {
          resolve(data.data);
        }
      };

      navigator.serviceWorker.ready.then(registration => {
        const reg = registration.active;
        if (reg) {
          reg.postMessage(messageData);
        }
      });
    });
  }


  public async getRoles() {
    return new Promise<Role[]>((resolve, reject) => {
      let messageData = { type: "getRoles", request: null };

      this.channel.onmessage = ({ data }) => {
        if (data.type === "getRoles") {
          resolve(data.data);
        }
      };

      navigator.serviceWorker.ready.then(registration => {
        const reg = registration.active;
        if (reg) {
          reg.postMessage(messageData);
        }
      });
    });
  }


}
