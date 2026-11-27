import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class EmployeesApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private getFormDataHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getMyEmployee(): Observable<any> {
    return this.http.post(environment.apiURL + '/employees/me', {
      headers: this.getHeaders(),
    });
  }

  createMyEmployee(): Observable<any> {
    return this.http.post(environment.apiURL + '/employees/me', {
      headers: this.getHeaders(),
    });
  }

  getAllEmployees(searchTerms: any): Observable<any> {
    const params: any = Object.fromEntries(
      Object.entries(searchTerms || {}).filter(
        ([key, value]) =>
          value !== '' && value !== null && value !== undefined
      ));

    return this.http.get(environment.apiURL + '/employees', {
      headers: this.getHeaders(),
      params,
    });
  }

  createEmployee(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/employees', data, {
      headers: this.getHeaders(),
    });
  }
  getEmployee(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/employees/' + id, {
      headers: this.getHeaders(),
    });
  }

  updateEmployee(id: any, data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/employees/'+id, data,  {
      headers: this.getHeaders(),
    });
  }
  getEmployeeSalary(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/employees/' +id+ '/salaries', {
      headers: this.getHeaders(),
    });
  }

  getEmployeeCalendar(id: any, searchTerms: any): Observable<any> {
    const params: any = Object.fromEntries(
    Object.entries(searchTerms || {}).filter(
      ([key, value]) =>
        value !== '' && value !== null && value !== undefined
    ));
    return this.http.get(environment.apiURL + '/employees/' +id+ '/calendar', {
      headers: this.getHeaders(),
      params
    });
  }

  getEmployeeAttendanceCalendar(id: any, searchTerms: any): Observable<any> {
    const params: any = Object.fromEntries(
    Object.entries(searchTerms || {}).filter(
      ([key, value]) =>
        value !== '' && value !== null && value !== undefined
    ));
    return this.http.get(environment.apiURL + '/attendance/employees/' +id+ '/calendar', {
      headers: this.getHeaders(),
      params
    });
  }

  getEmployeeLeaveBalances(id: any, searchTerms: any): Observable<any> {
    const params: any = Object.fromEntries(
    Object.entries(searchTerms || {}).filter(
      ([key, value]) =>
        value !== '' && value !== null && value !== undefined
    ));
    return this.http.get(environment.apiURL + '/leave/employees/' +id+ '/balances', {
      headers: this.getHeaders(),
      params
    });
  }

  createEmployeeSalary(id: any, data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/employees/'+id+ '/salaries', data,  {
      headers: this.getHeaders(),
    });
  }
}
