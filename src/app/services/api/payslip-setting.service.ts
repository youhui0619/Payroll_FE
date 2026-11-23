import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class PayslipSettingApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getPayslipSetting(): Observable<any> {
    return this.http.get(environment.apiURL + '/settings/payslip/', {
      headers: this.getHeaders(),
    });
  }
  
  updatePayslipSetting(data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/settings/payslip/', data, {
      headers: this.getHeaders(),
    });
  }
}
