/* eslint-disable @typescript-eslint/no-explicit-any */
import { defined } from '@hansogj/array.utils/dist/defined';

interface IndexedObject {
    [key: string]: any;
}

export class Abonnement<T> {
    protected abonnenter: ((nyVerdi: T, gammelVerdi: T) => void)[];

    private aktuellVerdi: any;

    private ren: boolean = true;

    constructor(init?: T) {
        this.abonnenter = [];
        this.aktuellVerdi = init;
    }

    abonner(abonnent: (nyVerdi: T, gmlVerdi?: T) => void, callOnInit: boolean = true): number {
        const length: number = this.abonnenter.push(abonnent);
        if (this.aktuellVerdi && callOnInit) {
            abonnent(this.aktuellVerdi);
        }
        return length - 1;
    }

    varsle(nyVerdi: T): T {
        this.abonnenter.map((fn) => {
            if (defined(nyVerdi) || defined(this.aktuellVerdi) || this.ren) {
                fn.call(this, nyVerdi, this.aktuellVerdi);
            }
        });
        this.ren = false;
        this.aktuellVerdi = nyVerdi;
        return nyVerdi;
    }

    get verdi(): T {
        return this.aktuellVerdi;
    }

    avslutt(id: number) {
        this.abonnenter = this.abonnenter.filter((_, i) => i !== id);
    }

    get __test(): IndexedObject {
        return { abonnenter: this.abonnenter };
    }
}

export class AlleAbonnementer<T> extends Abonnement<T> {
    private avsluttListe: number[];

    constructor(private list: Abonnement<any>[]) {
        super();

        this.avsluttListe = this.list.map((abonnent: Abonnement<T>, i: number) => {
            return abonnent.abonner((nyVerdi: T) => {
                const nyeVerdier: any[] = this.list.map((denne: Abonnement<T>, j) => (i === j ? nyVerdi : denne.verdi));
                if (nyeVerdier.defined().length === this.list.length) {
                    super.varsle(nyeVerdier as any);
                }
            });
        });
    }

    avslutt(id: number) {
        this.avsluttListe.forEach((_id, index) => this.list[index].avslutt(id));
        super.avslutt(id);
    }
}

export class JoinedAbonnement<T> extends Abonnement<T> {
    private avsluttListe: number[];

    constructor(private list: Abonnement<T>[]) {
        super();

        this.avsluttListe = this.list.map((abonnent: Abonnement<T>, i) =>
            abonnent.abonner((nyVerdi: T) => {
                const nyeVerdier: T[] = this.list.map((denne: Abonnement<T>, j) => (i === j ? nyVerdi : denne.verdi));
                super.varsle(nyeVerdier as any);
            }),
        );
    }

    avslutt(id: number) {
        this.avsluttListe.forEach((_id, index) => this.list[index].avslutt(id));
        super.avslutt(id);
    }
}
