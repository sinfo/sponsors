import { Pipe, PipeTransform } from '@angular/core';

import { Event } from 'src/app/models/event';
import {ReservationStand} from '../../../../models/reservation';

@Pipe({
  name: 'standsDisplay',
  pure: false
})
export class StandsDisplayPipe implements PipeTransform {

  transform(stands: ReservationStand[], event: Event): any {
    const duration = event.getDuration();
    const result = [];
    const date = new Date(event.date);

    for (let day = 1; day <= duration; day++) {
      const stand = stands.filter(s => s.day === day);

      if (stand.length > 0) {
        result.push({
          day: day,
          date: new Date(date.getTime()),
          id: stand[0].standId
        });
      } else {
        result.push({
          day: day,
          date: new Date(date.getTime()),
        });
      }

      date.setDate(date.getDate() + 1);
    }

    return result;
  }

}
