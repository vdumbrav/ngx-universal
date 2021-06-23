import { Inject, Injectable } from '@angular/core';

import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';
import { CookieOptions } from './cookie-options.model';
import { NgxRequest, NgxResponse } from './tokens';

@Injectable()
export class CookieBackendService extends CookieService {
  constructor(
    @Inject(NgxRequest) private request: any,
    @Inject(NgxResponse) private response: any,
    _optionsProvider: CookieOptionsProvider
  ) {
    super(_optionsProvider);
  }

  protected get cookieString(): string {
    return this.request.cookie || this.request.headers['cookie'] || '';
  }

  protected set cookieString(val: string) {
    this.request.cookie = val;
    this.response.cookie = val;
  }

  put(key: string, value: string, options: CookieOptions = {}): void {
    let findKey = false;
    let newCookie = Object.keys(this.getAll())
      .map((keyItem) => {
        if (keyItem === key) {
          findKey = true;
          return `${key}=${value}`;
        }
        return `${keyItem}=${this.get(keyItem)}`;
      })
      .join('; ');
    if (!findKey) {
      newCookie += `; ${key}=${value}`;
    }
    this.request.headers.cookie = newCookie;
    // not sure
    this.cookieString = newCookie;
  }

  remove(key: string, options?: CookieOptions): void {
    const newCookie = Object.keys(this.getAll())
      .map((keyItem) => {
        if (keyItem === key) {
          return '';
        }
        return `${keyItem}=${this.get(keyItem)}`;
      })
      .join('; ');
    this.request.headers.cookie = newCookie;
    // not sure
    this.cookieString = newCookie;
  }
}
