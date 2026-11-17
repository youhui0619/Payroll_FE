import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthApiService {
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


  // login
  login(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/auth/login', data, {
      headers: this.getHeaders(),
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(environment.apiURL + '/auth/me', {
      headers: this.getHeaders(),
    });
  }
}
