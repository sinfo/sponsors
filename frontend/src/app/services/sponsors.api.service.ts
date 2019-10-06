import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import {Company} from '../models/company';
import {Event} from '../models/event';

import {AuthService} from './auth.service';
import {Credentials} from '../models/credentials';
import {Link, LinkEdit, LinkForm} from '../models/link';
import {Availability, Venue} from '../models/venue';
import {Stand} from '../models/stand';
import {Reservation} from '../models/reservation';


@Injectable({
  providedIn: 'root'
})
export class SponsorsApiService {

  private sponsorsUrl = `${environment.sponsors}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /*************************************************************
   *                     Admin Link methods                    *
   *************************************************************/

  getLinks(filter?: {
    companyId?: string,
    edition?: string,
    token?: string
  }): Observable<Link | Link[]> {
    return this.http.get<Link | Link[]>(`${this.sponsorsUrl}/link`, {
      headers: this.authService.getHeaders(),
      params: filter
    });
  }

  uploadLink(form: LinkForm): Observable<Link> {
    return this.http.post<Link>(`${this.sponsorsUrl}/link`, form, { headers: this.authService.getHeaders() });
  }

  edit(form: LinkEdit, event: Event, companyId: String): Observable<Link> {
    return this.http.put<Link>(
      `${this.sponsorsUrl}/link/company/${companyId}/edition/${event.id}`,
      form,
      { headers: this.authService.getHeaders() });
  }

  extend(companyId: String, edition: String, form: { expirationDate: Date }): Observable<Link> {
    return this.http.put<Link>(
      `${this.sponsorsUrl}/link/company/${companyId}/edition/${edition}/extend`,
      form,
      { headers: this.authService.getHeaders() });
  }

  revoke(companyId: String, edition: String) {
    return this.http.get<Link>(
      `${this.sponsorsUrl}/link/company/${companyId}/edition/${edition}/revoke`,
      { headers: this.authService.getHeaders() }
    );
  }

  check(companyId: String): Observable<{ expirationDate: Date }> {
    const headers = this.authService.getHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.get<{ expirationDate: Date }>(
      `${this.sponsorsUrl}/link/company/${companyId}/validity`,
      { headers: headers }
    );
  }

  getCompaniesWithMissingLinks(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.sponsorsUrl}/link/missing`, { headers: this.authService.getHeaders() });
  }

  verifyAndGetLinks(): Observable<Link[]> {
    return this.http.get<Link[]>(`${this.sponsorsUrl}/link/validity`, { headers: this.authService.getHeaders() });
  }

  /*************************************************************
   *                     Admin Venue methods                    *
   *************************************************************/

  getVenueFromEdition(edition: String): Observable<Venue> {
    return this.http.get<Venue>(`${this.sponsorsUrl}/venue/${edition}`, { headers: this.authService.getHeaders() });
  }

  getCurrentVenue(): Observable<Venue> {
    return this.http.get<Venue>(`${this.sponsorsUrl}/venue/current`, { headers: this.authService.getHeaders() });
  }

  uploadVenueImage(image: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', image);

    return this.http.post<HttpEvent<{}>>(`${this.sponsorsUrl}/venue/image`, formdata, {
      headers: this.authService.getHeaders(),
      reportProgress: true,
      // responseType: 'text'
    });
  }

  uploadStand(stand: Stand): Observable<Venue> {
    return this.http.post<Venue>(`${this.sponsorsUrl}/venue/stand`, stand, { headers: this.authService.getHeaders() });
  }

  deleteStand(id: number): Observable<Venue> {
    return this.http.delete<Venue>(`${this.sponsorsUrl}/venue/stand/${id}`, { headers: this.authService.getHeaders() });
  }

  /*************************************************************
   *                      Company methods                      *
   *************************************************************/

  authenticateCompany(token: String): Observable<Credentials> {
    return this.http.get<Credentials>(`${this.sponsorsUrl}/company/auth`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getReservations(latest: boolean): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.sponsorsUrl}/company/reservation?latest=${latest}`, { headers: this.authService.getHeaders()}
    );
  }

  makeReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(
      `${this.sponsorsUrl}/company/reservation`, reservation.stands, { headers: this.authService.getHeaders()}
    );
  }

  cancelReservation(): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.sponsorsUrl}/company/reservation`, { headers: this.authService.getHeaders()});
  }

  getVenueAvailability(): Observable<Availability> {
    return this.http.get<Availability>(`${this.sponsorsUrl}/company/venue`, { headers: this.authService.getHeaders()});
  }

  /*************************************************************
   *                    Reservation methods                    *
   *************************************************************/

  getFromEdition(edition: String): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.sponsorsUrl}/reservation`, {
      headers: this.authService.getHeaders(),
      params: { edition: edition as string }
    });
  }

  getLatest(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.sponsorsUrl}/reservation/latest`, { headers: this.authService.getHeaders() });
  }

  confirm(companyId: String): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.sponsorsUrl}/reservation/company/${companyId}/confirm`,
      { headers: this.authService.getHeaders() });
  }

  cancel(companyId: String): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.sponsorsUrl}/reservation/company/${companyId}/cancel`,
      { headers: this.authService.getHeaders() });
  }

  remove(companyId: String, reservationId: number): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.sponsorsUrl}/reservation/${reservationId}/company/${companyId}`,
      { headers: this.authService.getHeaders() });
  }
}
