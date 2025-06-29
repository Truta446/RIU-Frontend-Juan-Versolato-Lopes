import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SingletonSecureStorageService {
  public init(): any {
    Storage.prototype['_setItem'] = Storage.prototype.setItem;
    Storage.prototype['_getItem'] = Storage.prototype.getItem;

    Storage.prototype.setItem = function (key, value) {
      if (environment.PRODUCTION) {
        this['_setItem'](key, CryptoJS.AES.encrypt(value, environment.CRYPTO_PRIVATE_KEY).toString());
      } else {
        this['_setItem'](key, value);
      }
    };

    Storage.prototype.getItem = function (key) {
      const value = this['_getItem'](key);

      if (value) {
        if (environment.PRODUCTION) {
          return CryptoJS.AES.decrypt(value, environment.CRYPTO_PRIVATE_KEY).toString(CryptoJS.enc.Utf8);
        } else {
          return value;
        }
      }

      return null;
    };
  }
}
