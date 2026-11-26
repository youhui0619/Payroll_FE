import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { getEmployee } from '../../data/workforce/employees.data';

@Injectable()
export class LeaveApplicationApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getAllLeaveApplications(searchTerms: any): Observable<any> {
    const params: any = Object.fromEntries(
      Object.entries(searchTerms || {}).filter(
        ([key, value]) =>
          value !== '' && value !== null && value !== undefined
    ));
    return this.http.get(environment.apiURL + '/leave/applications/', {
      headers: this.getHeaders(),
      params
    });
  }

  getLeaveApplication(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/leave/applications/'+id, {
      headers: this.getHeaders()
    });
  }

  getMyLeaveApplications(): Observable<any> {
    return this.http.get(environment.apiURL + '/leave/me/applications/', {
      headers: this.getHeaders()
    });
  }

  
  createLeaveApplication(data: any): Observable<any> {
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
