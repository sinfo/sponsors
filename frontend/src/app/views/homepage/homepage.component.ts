import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SponsorsApiService } from '../../services/sponsors.api.service';
import { AuthService } from '../../services/auth.service';
import { CompanyService } from '../company/company.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  token: string;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private sponsorsApiService: SponsorsApiService,
    private authService: AuthService,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.sponsorsApiService
          .authenticateCompany(this.token)
          .subscribe(credentials => {
            this.authService.saveToken(this.token);
            this.companyService.updateCredentials(credentials);
            this.isLoggedIn = true;
            this.router.navigate(['/']);
          });
      }
    });
  }

  ngOnInit() {}
}
