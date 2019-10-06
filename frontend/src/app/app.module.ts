import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ClipboardModule } from 'ngx-clipboard';

import { AppRoutes } from './app.routes';

import { CompanyGuard } from './auth/company.guard';

import { DatePtPipe } from './views/company/welcome/date-pt.pipe';
import { DateEnPipe } from './views/company/welcome/date-en.pipe';
import { PtDatePipe } from './views/company/company-reservations/pt-date.pipe';
import { StandsDisplayPipe } from './views/company/company-reservations/reservation-card/stands-display.pipe';

import { StorageService } from 'src/app/storage.service';
import { CompanyService } from 'src/app/views/company/company.service';
import { DeckService } from 'src/app/services/deck.service';


// TODO import { intersectionObserverPreset, LazyLoadImageModule } from 'ng-lazyload-image'; // <-- include intersectionObserverPreset
import { AppComponent } from './app.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { HomepageComponent } from './views/homepage/homepage.component';
import { CompanyComponent } from './views/company/company.component';
import { WelcomeComponent } from './views/company/welcome/welcome.component';
import { CompanyReservationsComponent } from './views/company/company-reservations/company-reservations.component';
import { ReservationCardComponent } from './views/company/company-reservations/reservation-card/reservation-card.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdvertisingItemsComponent } from './views/homepage/advertisingItems/advertisingItems.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {VenueImageComponent} from './views/company/company-reservations/venue-image/venue-image.component';
import {CanvasComponent} from './views/company/company-reservations/venue-image/canvas/canvas.component';
import {SortStandsPipe} from './views/company/company-reservations/sort-stands.pipe';


library.add(fas);

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    HomepageComponent,
    AdvertisingItemsComponent,
    CompanyComponent,
    WelcomeComponent,
    CompanyReservationsComponent,
    DatePtPipe,
    DateEnPipe,
    PtDatePipe,
    ReservationCardComponent,
    StandsDisplayPipe,
    VenueImageComponent,
    CanvasComponent,
    SortStandsPipe
  ],
  imports: [
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutes,
    /* TODO    LazyLoadImageModule.forRoot({
          preset: intersectionObserverPreset
        }),*/
    FontAwesomeModule,
    ClipboardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CarouselModule
  ],
  providers: [
    StorageService,
    CompanyGuard,
    DeckService,
    CompanyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
