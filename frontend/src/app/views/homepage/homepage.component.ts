import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute } from '@angular/router';
import {SponsorsApiService} from '../../services/sponsors.api.service';
import {AuthService} from '../../services/auth.service';
import {CompanyService} from '../company/company.service';

@Component({
  selector: 'homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  customOptions: OwlOptions = {
    nav: false,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 4000,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    margin: 0,
    smartSpeed: 1000,
    items: 1,
    center: true,
  };

  token: string;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private sponsorsApiService: SponsorsApiService,
    private authService: AuthService,
    private companyService: CompanyService
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.sponsorsApiService.authenticateCompany(this.token).subscribe(
          credentials => {
            this.authService.saveToken(this.token);
            this.companyService.updateCredentials(credentials);
            this.isLoggedIn = true;
          });
      }
      console.log(this.isLoggedIn, this.token);
    });
  }

  ngOnInit() {
  }
}
