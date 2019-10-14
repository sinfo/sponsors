import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompanyGuard } from './auth/company.guard';

import { NotfoundComponent } from 'src/app/views/notfound/notfound.component';
import { CompanyComponent } from 'src/app/views/company/company.component';
import { WelcomeComponent } from 'src/app/views/company/welcome/welcome.component';
import { CompanyReservationsComponent } from 'src/app/views/company/company-reservations/company-reservations.component';
import {HomepageComponent} from './views/homepage/homepage.component';
import {AdvertisingItemsComponent} from './views/homepage/advertisingItems/advertisingItems.component';
import { ParticipationFormComponent } from './views/homepage/participationForm/participationForm.component';

const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'advertising-items', component: AdvertisingItemsComponent },
  // { path: 'participation-form', component: ParticipationFormComponent },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [CompanyGuard],
    children: [
      {
        path: ':token',
        pathMatch: 'full',
        component: WelcomeComponent,
        canActivate: [CompanyGuard]
      },
      {
        path: 'reservations',
        component: CompanyReservationsComponent,
        canActivate: [CompanyGuard]
      }
    ]
  },
  { path: '**', component: NotfoundComponent }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
