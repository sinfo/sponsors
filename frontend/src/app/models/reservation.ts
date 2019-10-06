import {Company} from './company';


export class Feedback {
    status: String;
}

export class ReservationStand {
    day: number;
    standId: number;

    constructor(day: number, standId: number) {
        this.day = day;
        this.standId = standId;
    }

    static fromArray(stands: ReservationStand[]): ReservationStand[] {
        const result = [];

        for (const stand of stands) {
            result.push(new ReservationStand(stand.day, stand.standId));
        }

        return result as ReservationStand[];
    }

    isInArray(stands: ReservationStand[]): boolean {
        for (const stand of stands) {
            if (stand.day === this.day && stand.standId === this.standId) {
                return true;
            }
        }

        return false;
    }
}

export class Reservation {
    id?: number;
    companyId?: String;
    edition?: String;
    issued?: Date;
    stands: ReservationStand[];
    feedback?: Feedback;
    company?: Company;

    constructor(reservation?: Reservation) {
        if (reservation) {
            this.id = reservation.id;
            this.companyId = reservation.companyId;
            this.edition = reservation.edition;
            this.issued = reservation.issued;
            this.stands = ReservationStand.fromArray(reservation.stands);
            this.feedback = reservation.feedback;
        } else {
            this.stands = [] as ReservationStand[];
        }
    }

    static fromArray(_reservations: Reservation[], companies?: Company[]): Reservation[] {
        if (_reservations === undefined) { return [] as Reservation[]; }

        const reservations = [] as Reservation[];

        for (const reservation of _reservations) {
            const r = new Reservation(reservation);

            r.company = companies
                ? companies.filter(c => c.id === reservation.companyId)[0]
                : undefined;

            reservations.push(r);
        }

        return reservations.sort(Reservation.compareDates);
    }

    static updateArrayWithCompanyInfo(reservations: Reservation[], companies: Company[]): void {
        for (const reservation of reservations) {
            reservation.company = companies.filter(c => c.id === reservation.companyId)[0];
        }
    }

    static compareDates(r1: Reservation, r2: Reservation): number {
        if (r1.issued === undefined && r2.issued !== undefined) {
            return 1;
        }

        if (r1.issued !== undefined && r2.issued === undefined) {
            return -1;
        }

        if (r1.issued === undefined && r2.issued === undefined) {
            return 0;
        }

        const t1 = new Date(r1.issued).getTime();
        const t2 = new Date(r2.issued).getTime();

        return t2 - t1;
    }

    canbeConfirmed(confirmed: Reservation[]): boolean {
        for (const reservation of confirmed) {
            for (const stand of reservation.stands) {
                if (stand.isInArray(this.stands)) {
                    return false;
                }
            }
        }

        return true;
    }

    isPending(): boolean {
        return this.feedback === undefined || this.feedback.status === 'PENDING';
    }

    isConfirmed(): boolean {
        return this.feedback && this.feedback.status === 'CONFIRMED';
    }

    isCancelled(): boolean {
        return this.feedback && this.feedback.status === 'CANCELLED';
    }

    hasStand(stand: ReservationStand): boolean {
        for (const _stand of this.stands) {
            if (_stand.day === stand.day && _stand.standId === stand.standId) {
                return true;
            }
        }

        return false;
    }

    daysAreContiguous(): boolean {
        this.stands.sort((s1, s2) => s1.day - s2.day);
        let last = -1;
        for (const _stand of this.stands) {
            if (last !== -1 && _stand.day - last !== 1) {
                return false;
            }
            last = _stand.day;
        }

        return true;
    }

    standIsSame(): boolean {
        if ( this.stands.length === 0) { return true; }
        const _id: number = this.stands[0].standId;
        for (const _stand of this.stands) {
            if (_id !== _stand.standId) {
                return false;
            }
        }

        return true;
    }

    private getStandIndexByDay(day: number): number {
        return this.stands.findIndex(stand => stand.day === day);
    }

    private addStand(stand: ReservationStand) {
        this.stands.push(stand);
    }

    private removeStand(stand: ReservationStand) {
        this.stands = this.stands.filter(
            _stand => !(_stand.day === stand.day && _stand.standId === stand.standId)
        ) as ReservationStand[];
    }

    update(participationDays: number, stand: ReservationStand) {
        const isPending = this.hasStand(stand);

        if (isPending) {
            this.removeStand(stand);
            return;
        }

        const standIndexByDay = this.getStandIndexByDay(stand.day);

        if (standIndexByDay !== -1) {
            this.stands.splice(standIndexByDay, 1);
            this.addStand(stand);
            return;
        }

        if (this.stands.length === participationDays) {
            return;
        }

        this.addStand(stand);
    }
}
