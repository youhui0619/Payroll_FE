import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authTokenKey = 'access_token';
  private userKey = 'user';
  private permissionsKey = 'user_permissions';
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(
    private router: Router, 
    private http: HttpClient,
  ) {}

  getStoredUser(): any {
    const user = sessionStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getStoredPermissions(): string[] {
    const permissions = sessionStorage.getItem(this.permissionsKey);
    return permissions ? JSON.parse(permissions) : [];
  }

  login(userData: any): void {
    this.setUser(userData);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.userSubject.next(null);
    sessionStorage.removeItem(this.authTokenKey);
    sessionStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  private setUser(userData: any): void {
    this.userSubject.next(userData);
    sessionStorage.setItem(this.authTokenKey, userData.access_token);
    sessionStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  getAuthToken(): string | null {
    const token = sessionStorage.getItem(this.authTokenKey);
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}