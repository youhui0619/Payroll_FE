import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable()
export class WorkLocationApiService {
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

  getAllWorkLocations(searchTerm: any): Observable<any> {
    console.log("searchTerm", searchTerm)
    const params: any = searchTerm || {};
    return this.http.get(environment.apiURL + '/work-locations', {
      headers: this.getHeaders(),
      params,
    });
  }

  createWorkLocation(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/work-locations', data, {
      headers: this.getHeaders(),
    });
  }

  getWorkLocation(id: any): Observable<any> {
    return this.http.get(environment.apiURL + '/work-locations/'+id, {
      headers: this.getHeaders(),
    });
  }
  
  updateWorkLocation(id: any, data: any): Observable<any> {
    return this.http.patch(environment.apiURL + '/work-locations/'+id, data, {
      headers: this.getHeaders(),
    });
  }

  updateWorkLocationStatus(id: any): Observable<any> {
    return this.http.post(environment.apiURL + '/work-locations/'+id+'/deactivate', {
      headers: this.getHeaders(),
    });
  }
}
