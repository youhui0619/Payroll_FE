import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { getEmployee } from '../../data/workforce/employees.data';

@Injectable()
export class LeavePolicyApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getAllLeavePolicies(searchTerms: any): Observable<any> {
    const params: any = Object.fromEntries(
      Object.entries(searchTerms || {}).filter(
        ([key, value]) =>
          value !== '' && value !== null && value !== undefined
    ));

    return this.http.get(environment.apiURL + '/leave/policies', {
      headers: this.getHeaders(),
      params,
    });
  }

  createLeavePolicies(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/leave/policies', data, {
      headers: this.getHeaders(),
    });
  }

  getLeavePolicy(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/leave/policies/'+id, {
      headers: this.getHeaders()
    });
  }

  updateLeavePolicy(id: any, data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/leave/policies/'+id, data, {
      headers: this.getHeaders()
    });
  }

  updateLeavePolicyStatus(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/leave/policies/'+id+ '/deactivate', null, {
      headers: this.getHeaders()
    });
  }

}
