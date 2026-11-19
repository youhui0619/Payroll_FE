import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class PositionsApiService {
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
  getAllPositions(searchTerms: any): Observable<any> {
   const params: any = Object.fromEntries(
    Object.entries(searchTerms || {}).filter(
      ([key, value]) =>
        value !== '' && value !== null && value !== undefined
    ));

    return this.http.get(environment.apiURL + '/positions', {
      headers: this.getHeaders(),
      params,
    });
  }

  createPosition(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/positions', data, {
      headers: this.getHeaders(),
    });
  }

  getPosition(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/positions/'+id, {
      headers: this.getHeaders(),
    });
  }

  updatePosition(id: any, data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/positions/'+id, data,  {
      headers: this.getHeaders(),
    });
  }

  updatePositionStatus(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/positions/' +id+ '/deactivate' ,  {
      headers: this.getHeaders(),
    });
  }
}
