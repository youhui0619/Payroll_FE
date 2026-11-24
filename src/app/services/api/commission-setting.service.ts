import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class CommissionSettingApiService {
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
  getAllCommissionSettings(searchTerms: any): Observable<any> {
   const params: any = Object.fromEntries(
    Object.entries(searchTerms || {}).filter(
      ([key, value]) =>
        value !== '' && value !== null && value !== undefined
    ));

    return this.http.get(environment.apiURL + '/commission/settings', {
      headers: this.getHeaders(),
      params,
    });
  }

  createCommissionSetting(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/commission/settings', data, {
      headers: this.getHeaders(),
    });
  }

  getCommissionSetting(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/commission/settings/'+id, {
      headers: this.getHeaders(),
    });
  }

  updateCommissionSetting(id: any, data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/commission/settings/'+id, data,  {
      headers: this.getHeaders(),
    });
  }

  updateCommissionSettingStatus(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/commission/settings/' +id+ '/deactivate', null, {
      headers: this.getHeaders(),
    });
  }
}
