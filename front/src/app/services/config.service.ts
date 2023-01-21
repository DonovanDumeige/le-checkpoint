import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  constructor (private http: HttpClient) {
  }

  configUrl = 'assets/config.json';

  getConfig() {
    return this.http.get<any>(this.configUrl);
  }
}
