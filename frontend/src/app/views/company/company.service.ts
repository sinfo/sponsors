import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { StorageService } from '../../storage.service';

import { SponsorsApiService } from '../../services/sponsors.api.service';
import { Credentials } from '../../models/credentials';
import {Availability} from '../../models/venue';
import {Reservation} from '../../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private credentials;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private sponsorsApiService: SponsorsApiService
  ) { }

  getVenueAvailability(): Observable<Availability> {
    return this.sponsorsApiService.getVenueAvailability();
  }

  getReservations(latest: boolean): Observable<Reservation[]> {
    return this.sponsorsApiService.getReservations(latest);
  }

  makeReservation(reservation: Reservation): Observable<Reservation> {
    return this.sponsorsApiService.makeReservation(reservation);
  }

  cancelReservation(): Observable<Reservation> {
    return this.sponsorsApiService.cancelReservation();
  }

  getCredentials(): Credentials | null {
    return <Credentials | null>this.storage.getItem('credentials');
  }

  updateCredentials(credentials: Credentials) {
    this.credentials = credentials;
    this.storage.setItem('credentials', credentials);
  }
}
