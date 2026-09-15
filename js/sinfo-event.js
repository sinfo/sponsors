/**
 * sinfo-event.js
 * Fetches the current SINFO event from the public API and dynamically
 * updates the edition number and event dates throughout the page.
 *
 * API: https://sinfo.org/api/events/current
 * Returns an array sorted newest-first. Each event object has:
 *   id        - edition number string, e.g. "34"
 *   name      - "SINFO 34"
 *   date      - ISO start date, e.g. "2027-02-15T00:00:00Z"
 *   duration  - stored as an epoch date; the day-of-month gives the duration
 *               in days (e.g. "1970-01-05T00:00:00.000Z" → 4 extra days →
 *               event runs day 1 through day 5, i.e. 5-day event).
 */
(function () {
  'use strict';

  var API_URL = 'https://sinfo.org/api/events/current';

  /** Return the ordinal suffix for a day number (1→"st", 2→"nd", etc.) */
  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /** Format a UTC Date as "Month Nth" */
  function formatDay(date) {
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getUTCMonth()] + ' ' + ordinal(date.getUTCDate());
  }

  /** Update a DOM element's text content if it exists */
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function applyEvent(event) {
    var edition  = event.id;                         
    var name     = event.name;                        
    var startDate = new Date(event.date);             

    // duration is stored as an epoch date; getUTCDate() gives the day number.
    // "1970-01-05" → day 5 → the event spans 4 extra days from the start.
    var durationDate = new Date(event.duration);
    var extraDays    = durationDate.getUTCDate() - 1; 

    var endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + extraDays);

    var startStr = formatDay(startDate);              
    var endStr   = formatDay(endDate);               
    var year     = startDate.getUTCFullYear();        

    // Date range strings
    var dateRangeLong  = startStr + ' to ' + endStr + ', ' + year; 
    var dateRangeShort = startStr + ' to ' + endStr;               

    // --- Update the <title> ---
    document.title = name + " - Sponsors' Program";

    // --- Update all marked elements ---
    setText('sinfo-edition',       edition);
    setText('sinfo-date-range',    dateRangeLong);
    setText('sinfo-name-1',        name);
    setText('sinfo-name-2',        name);
    setText('sinfo-dates-bold',    dateRangeShort);
    setText('sinfo-name-deadlines', name);
  }

  fetch(API_URL)
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (events) {
      if (!Array.isArray(events) || events.length === 0) return;
      // The API returns events sorted newest-first
      var latest = events[0];
      applyEvent(latest);
    })
    .catch(function (err) {
      // Silently fail – the hardcoded fallback values remain in the DOM
      console.warn('[sinfo-event] Could not load event data:', err.message);
    });
})();

