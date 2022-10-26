import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  public clearStorage() {
    window.sessionStorage.clear();
  }
  public saveAccessToken(token: string): void {
    window.sessionStorage.removeItem(environment.accessToken);
    window.sessionStorage.setItem(environment.accessToken, token);
  }

  public getAccessToken(): string | null {
    return window.sessionStorage.getItem(environment.accessToken);
  }

  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(environment.refreshToken);
    window.sessionStorage.setItem(environment.refreshToken, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(environment.refreshToken);
  }
}
