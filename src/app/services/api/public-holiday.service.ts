import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class PublicHolidayApiService {
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

  getAllPublicHolidays(searchTerm: any): Observable<any> {
    console.log("searchTerm", searchTerm)
    const params: any = searchTerm || {};
    return this.http.get(environment.apiURL + '/public-holidays', {
      headers: this.getHeaders(),
      params,
    });
  }

  createPublicHoliday(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/public-holidays', data, {
      headers: this.getHeaders(),
    });
  }

  getPublicHoliday(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/public-holidays/'+id, {
      headers: this.getHeaders(),
    });
  }
  
  updatePublicHoliday(id: any, data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/public-holidays/'+id, data, {
      headers: this.getHeaders(),
    });
  }

  updatePublicHolidayStatus(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/public-holidays/'+id+'/deactivate', {
      headers: this.getHeaders(),
    });
  }
}
