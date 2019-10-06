import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subscription } from 'rxjs/internal/Subscription';


import { DeckService } from 'src/app/services/deck.service';

import { Link, LinkForm, LinkEdit } from '../models/link';
import { Companies } from '../models/companies';
import {SponsorsApiService} from './sponsors.api.service';
import {StorageService} from '../storage.service';
import {Company} from '../models/company';
import {Event} from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  companies: Companies;
  event: Event;
  eventSubscription: Subscription;
  deckCompaniesSubscription: Subscription;

  private companiesSubject: ReplaySubject<Companies> = new ReplaySubject<Companies>();

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private deckService: DeckService,
    private sponsorsApiService: SponsorsApiService
  ) {
    this.companies = new Companies();

    this.eventSubscription = this.deckService.getEventSubject()
      .subscribe(event => {
        const eventOverride = this.event !== undefined && this.event.id !== event.id;
        this.event = event;
        if (eventOverride) { this.updateLinks(event.id as string); }
      });

    this.deckCompaniesSubscription = this.deckService.getDeckCompaniesSubject()
      .subscribe(companies => {
        this.companies.updateCompanies(companies, this.event.id);
        this.updateLinks();
      });
  }

  getCompaniesSubscription(): Observable<Companies> {
    return this.companiesSubject.asObservable();
  }

  updateLinks(edition?: string) {
    edition
      ? this.getLinks({ edition: edition }).subscribe(links => {
        const l = links instanceof Link ? [links] as Link[] : links as Link[];
        this.companies.updateLinks(l);
        this.companiesSubject.next(this.companies);
      })
      : this.verifyAndGetLinks().subscribe(links => {
        this.companies.updateLinks(links);
        this.companiesSubject.next(this.companies);
      });

  }

  uploadLink(form: LinkForm): Observable<Link> {
    return this.sponsorsApiService.uploadLink(form);
  }

  getLinks(filter?: {
    companyId?: string,
    edition?: string,
    token?: string
  }): Observable<Link | Link[]> {
    return this.sponsorsApiService.getLinks(filter);
  }

  verifyAndGetLinks(): Observable<Link[]> {
    return this.sponsorsApiService.verifyAndGetLinks();
  }

  // TODO why is it unused
  getCompaniesWithMissingLinks(): Observable<Company[]> {
    return this.sponsorsApiService.getCompaniesWithMissingLinks();
  }

  extend(companyId: String, edition: String, form: { expirationDate: Date }): Observable<Link> {
    return this.sponsorsApiService.extend(companyId, edition, form);
  }

  edit(form: LinkEdit, event: Event, companyId: String): Observable<Link> {
    return this.sponsorsApiService.edit(form, event, companyId);
  }

  revoke(companyId: String, edition: String): void {
    this.sponsorsApiService.revoke(companyId, edition).subscribe(() => {
      this.updateLinks(edition as string);
    });
  }

  check(companyId: String): Observable<{ expirationDate: Date }> {
    return this.sponsorsApiService.check(companyId);
  }
}
