import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class CompanyApiService {
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

  updateCompany(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/company', data, {
      headers: this.getHeaders(),
    });
  }

  getCompany(): Observable<any> {
    return this.http.get(environment.apiURL + '/company', {
      headers: this.getHeaders(),
    });
  }
}
