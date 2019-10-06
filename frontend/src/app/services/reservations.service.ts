import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { Reservation } from '../models/reservation';
import {SponsorsApiService} from './sponsors.api.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  private headers: HttpHeaders;

  private reservationsSubject: BehaviorSubject<Reservation[]>
    = new BehaviorSubject<Reservation[]>(undefined);

  private reservationSubject: BehaviorSubject<Reservation>
    = new BehaviorSubject<Reservation>(undefined);

  constructor(
    private http: HttpClient,
    private sponsorsApiService: SponsorsApiService
  ) {

  }

  setReservations(reservations: Reservation[]) {
    this.reservationsSubject.next(reservations);
  }

  getReservationsSubject(): Observable<Reservation[]> {
    return this.reservationsSubject.asObservable();
  }

  setReservation(reservation: Reservation) {
    this.reservationSubject.next(reservation);
  }

  getReservationSubject(): Observable<Reservation> {
    return this.reservationSubject.asObservable();
  }

  getFromEdition(edition: String): Observable<Reservation[]> {
    return this.sponsorsApiService.getFromEdition(edition);
  }

  updateWithLatest(): void {
    this.getLatest().subscribe(reservations => this.setReservations(reservations));
  }

  getLatest(): Observable<Reservation[]> {
    return this.sponsorsApiService.getLatest();
  }

  confirm(companyId: String): Observable<Reservation> {
    return this.sponsorsApiService.confirm(companyId);
  }

  cancel(companyId: String): Observable<Reservation> {
    return this.sponsorsApiService.cancel(companyId);
  }

  remove(companyId: String, reservationId: number): Observable<Reservation> {
    return this.sponsorsApiService.remove(companyId, reservationId);
  }

}
