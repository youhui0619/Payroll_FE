import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private previousUrl: string | null;
  private currentUrl: string;
  private navigatingBack = false;

  constructor(private readonly router: Router) {
    const previousNavigation = this.router.lastSuccessfulNavigation()?.previousNavigation;
    this.previousUrl = previousNavigation?.finalUrl
      ? this.router.serializeUrl(previousNavigation.finalUrl)
      : null;
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        if (this.navigatingBack) {
          this.previousUrl = null;
          this.navigatingBack = false;
        } else {
          this.previousUrl = this.currentUrl;
        }
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  /** Navigate to the prior in-app route, or to the supplied path if none exists. */
  back(fallbackPath = '/dashboard'): Promise<boolean> {
    const destination = this.previousUrl ?? fallbackPath;
    this.navigatingBack = true;
    return this.router.navigateByUrl(destination).finally(() => {
      this.navigatingBack = false;
    });
  }
}
