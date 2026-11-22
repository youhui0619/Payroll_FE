var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/app/services/api/work-location.service.ts
import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

// src/environments/environment.ts
var environment = {
  production: false,
  apiURL: "http://localhost:3000/api/v1",
  // apiURL: 'https://mortgagebe.uhuidesignstudio.my',
  firebaseConfig: {
    apiKey: "AIzaSyAAIxXIKgxQmxo58TFlrHU_HkgAN_vlejs",
    authDomain: "payroll-system-6ae9b.firebaseapp.com",
    projectId: "payroll-system-6ae9b",
    storageBucket: "payroll-system-6ae9b.firebasestorage.app",
    messagingSenderId: "452876600395",
    appId: "1:452876600395:web:5bc68515bfb30d213639ce"
  }
};

// src/app/services/api/work-location.service.ts
var WorkLocationApiService = class {
  constructor(http, authService) {
    this.http = http;
    this.authService = authService;
  }
  http;
  authService;
  getHeaders() {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
  getFormDataHeaders() {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
  getAllWorkLocations(searchTerms) {
    const params = Object.fromEntries(
      Object.entries(searchTerms || {}).filter(
        ([key, value]) => value !== "" && value !== null && value !== void 0
      )
    );
    return this.http.get(environment.apiURL + "/work-locations", {
      headers: this.getHeaders(),
      params
    });
  }
  createWorkLocation(data) {
    return this.http.post(environment.apiURL + "/work-locations", data, {
      headers: this.getHeaders()
    });
  }
  getWorkLocation(id) {
    return this.http.get(environment.apiURL + "/work-locations/" + id, {
      headers: this.getHeaders()
    });
  }
  updateWorkLocation(id, data) {
    return this.http.patch(environment.apiURL + "/work-locations/" + id, data, {
      headers: this.getHeaders()
    });
  }
  updateWorkLocationStatus(id) {
    return this.http.post(environment.apiURL + "/work-locations/" + id + "/deactivate", null, {
      headers: this.getHeaders()
    });
  }
};
WorkLocationApiService = __decorateClass([
  Injectable()
], WorkLocationApiService);
export {
  WorkLocationApiService
};
