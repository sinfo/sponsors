import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { CompanyService } from '../views/company/company.service';
import { SponsorsApiService } from '../services/sponsors.api.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
    private sponsorsApiService: SponsorsApiService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    const token = next.params.token || this.authService.getToken();
    const tokenURL = state.url.includes('/token');

    if (token === null) {
      window.location.href = `${environment.frontend}`;
      return false;
    }

    return new Promise<boolean>(resolve => {
      this.sponsorsApiService.authenticateCompany(token).subscribe(
        credentials => {
          this.authService.saveToken(token);
          this.companyService.updateCredentials(credentials);

          if (tokenURL) {
            this.router.navigate(['/']);
          }

          resolve(true);
        }, () => {
          this.authService.logout()
          resolve(false);
        }
      );
    });
  }
}
