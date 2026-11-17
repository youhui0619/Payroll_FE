import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { getEmployee } from '../../data/workforce/employees.data';

@Injectable()
export class AttendanceApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  clockIn(): Observable<any> {
    return this.http.post(environment.apiURL + '/attendance/clock-in', {
      headers: this.getHeaders(),
    });
  }

  clockOut(): Observable<any> {
    return this.http.post(environment.apiURL + '/attendance/clock-out', {
      headers: this.getHeaders(),
    });
  }


  getMyAttendanceStatus(): Observable<any> {
    return this.http.get(environment.apiURL + '/attendance/me/status', {
      headers: this.getHeaders(),
    });
  }

  getMyAttendanceHistory(searchTerm: any): Observable<any> {
    console.log("searchTerm", searchTerm)
    const params: any = searchTerm ? { search: searchTerm } : {};
    return this.http.get(environment.apiURL + '/attendance/me/history', {
      headers: this.getHeaders(),
      params,
    });
  }

  getAllAttendance(searchTerm: any): Observable<any> {
    console.log("searchTerm", searchTerm)
    const params: any = searchTerm ? { search: searchTerm } : {};
    return this.http.get(environment.apiURL + '/attendance', {
      headers: this.getHeaders(),
      params,
    });
  }
}
