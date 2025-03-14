import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  constructor(public http: HttpClient) {
    // This service can now make HTTP requests via `this.http`.
  }
}
