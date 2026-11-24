import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class PayrollSettingApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getPayrollSetting(): Observable<any> {
    return this.http.get(environment.apiURL + '/payroll/settings/', {
      headers: this.getHeaders(),
    });
  }
  
  updatePayrollSetting(data: any): Observable<any> {
    return this.http.put(environment.apiURL + '/payroll/settings/', data, {
      headers: this.getHeaders(),
    });
  }
}
