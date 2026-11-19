import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class DepartmentsApiService {
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
  getAllDepartments(searchTerms: any): Observable<any> {
   const params: any = Object.fromEntries(
    Object.entries(searchTerms || {}).filter(
      ([key, value]) =>
        value !== '' && value !== null && value !== undefined
    ));

    return this.http.get(environment.apiURL + '/departments', {
      headers: this.getHeaders(),
      params,
    });
  }

  createDepartment(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/departments', data, {
      headers: this.getHeaders(),
    });
  }

  getDepartment(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/departments/'+id, {
      headers: this.getHeaders(),
    });
  }

  updateDepartment(id: any, data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/departments/'+id, data,  {
      headers: this.getHeaders(),
    });
  }

  updateDepartmentStatus(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/departments/' +id+ '/deactivate' ,  {
      headers: this.getHeaders(),
    });
  }
}
