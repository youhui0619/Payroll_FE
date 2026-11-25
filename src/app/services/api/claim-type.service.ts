import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class ClaimTypeApiService {
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

  getAllClaimTypes(searchTerms: any): Observable<any> {
    const params: any = Object.fromEntries(
      Object.entries(searchTerms || {}).filter(
        ([key, value]) =>
          value !== '' && value !== null && value !== undefined
      ));

    return this.http.get(environment.apiURL + '/claims/types', {
      headers: this.getHeaders(),
      params,
    });
  }

  createClaimType(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/claims/types', data, {
      headers: this.getHeaders(),
    });
  }

  getClaimType(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/claims/types/'+id, {
      headers: this.getHeaders(),
    });
  }
  
  updateClaimType(id: any, data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/claims/types/'+id, data, {
      headers: this.getHeaders(),
    });
  }

}
