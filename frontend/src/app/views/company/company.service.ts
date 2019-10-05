import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { StorageService } from '../../storage.service';

import { Availability } from '../admin/venues/venue/venue';
import { Reservation } from '../admin/reservations/reservation/reservation';
import { SponsorsService } from '../../services/sponsors.service';
import { Credentials } from '../../models/credentials';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private credentials;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private sponsorsService: SponsorsService
  ) { }

  getVenueAvailability(): Observable<Availability> {
    return this.sponsorsService.getVenueAvailability();
  }

  getReservations(latest: boolean): Observable<Reservation[]> {
    return this.sponsorsService.getReservations(latest);
  }

  makeReservation(reservation: Reservation): Observable<Reservation> {
    return this.sponsorsService.makeReservation(reservation);
  }

  cancelReservation(): Observable<Reservation> {
    return this.sponsorsService.cancelReservation();
  }

  getCredentials(): Credentials | null {
    return <Credentials | null>this.storage.getItem('credentials');
  }

  updateCredentials(credentials: Credentials) {
    this.credentials = credentials;
    this.storage.setItem('credentials', credentials);
  }
}
