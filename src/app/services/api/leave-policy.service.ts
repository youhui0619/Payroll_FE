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

  getMyAttendanceStatus(): Observable<any> {
    return this.http.get(environment.apiURL + '/attendance/me/status', {
      headers: this.getHeaders(),
    });
  }

  createLeaveGrants(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/leave/grants', {
      headers: this.getHeaders()
    });
  }

  getMyLeaveBalances(searchTerm: any): Observable<any> {
    console.log("searchTerm", searchTerm)
    const params: any = searchTerm ? { search: searchTerm } : {};
    return this.http.get(environment.apiURL + '/leave/me/balances', {
      headers: this.getHeaders(),
      params,
    });
  }

  getEmployeeLeaveBalances(id: any, searchTerm: any): Observable<any> {
    console.log("searchTerm", searchTerm)
    const params: any = searchTerm ? { search: searchTerm } : {};
    return this.http.get(environment.apiURL + '/leave/'+id+'/balances', {
      headers: this.getHeaders(),
      params,
    });
  }

  getLeave(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/leave/applications/'+id, {
      headers: this.getHeaders()
    });
  }

  putLeave(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/leave/applications/'+id, {
      headers: this.getHeaders()
    });
  }

  getAllMyLeave(): Observable<any> {
    return this.http.get(environment.apiURL + '/leave/me/applications/', {
      headers: this.getHeaders()
    });
  }
  
  getAllLeave(): Observable<any> {
    return this.http.get(environment.apiURL + '/leave/applications/', {
      headers: this.getHeaders()
    });
  }

  
  createLeave(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/leave/applications/', data, {
      headers: this.getHeaders()
    });
  }


  getAllPendingLeave(): Observable<any> {
    return this.http.get(environment.apiURL + '/leave/pending', {
      headers: this.getHeaders()
    });
  }
  
  leaveSubmit(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/leave/applications/'+id+'/submit', {
      headers: this.getHeaders()
    });
  }

  leaveDecision(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/leave/applications/'+id+'/decision', {
      headers: this.getHeaders()
    });
  }
  
  leaveCancel(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/leave/applications/'+id+'/cancel', {
      headers: this.getHeaders()
    });
  }
}
