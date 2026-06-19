/* eslint-disable @typescript-eslint/no-explicit-any */
import { defined } from '@hansogj/array.utils';

interface IndexedObject {
    [key: string]: any;
}

/**
 * Lightweight observable. Holds a value of type `T` and notifies subscribers
 * when it changes.
 *
 * API is in Norwegian:
 *   `abonner`  — subscribe
 *   `varsle`   — notify (publish a new value)
 *   `avslutt`  — unsubscribe
 *   `verdi`    — current value
 *
 * @example
 *   const a = new Abonnement<number>(0);
 *   const id = a.abonner((ny, gml) => console.log(ny, gml));
 *   a.varsle(1);
 *   a.avslutt(id);
 */
export class Abonnement<T> {
    protected abonnenter: ((nyVerdi: T, gammelVerdi: T) => void)[];

    private aktuellVerdi: any;

    private ren: boolean = true;

    constructor(init?: T) {
        this.abonnenter = [];
        this.aktuellVerdi = init;
    }

    /**
     * Subscribe to value changes. Returns the subscriber's id (use it with
     * `avslutt`). When `callOnInit` is true (default) the callback is invoked
     * immediately with the current value, provided that value is truthy.
     */
    abonner(abonnent: (nyVerdi: T, gmlVerdi?: T) => void, callOnInit: boolean = true): number {
        const length: number = this.abonnenter.push(abonnent);
        if (this.aktuellVerdi && callOnInit) {
            abonnent(this.aktuellVerdi);
        }
        return length - 1;
    }

    /**
     * Publish a new value. Subscribers are called with `(newValue, oldValue)`.
     * The first call is always delivered, even when the new value is the
     * same as the old.
     */
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

    /** Current value. */
    get verdi(): T {
        return this.aktuellVerdi;
    }

    /** Unsubscribe by id (returned from `abonner`). */
    avslutt(id: number) {
        this.abonnenter = this.abonnenter.filter((_, i) => i !== id);
    }

    /** Test-only inspection of the subscriber list. */
    get __test(): IndexedObject {
        return { abonnenter: this.abonnenter };
    }
}

/**
 * Combines several `Abonnement`s into one. Subscribers are notified with an
 * array of every source's current value, but only once **all** sources have
 * defined values. Compare with `JoinedAbonnement`, which fires on any change.
 */
export class AlleAbonnementer<T> extends Abonnement<T> {
    private avsluttListe: number[];

    constructor(private list: Abonnement<any>[]) {
        super();

        this.avsluttListe = this.list.map((abonnent: Abonnement<T>, i: number) =>
            abonnent.abonner((nyVerdi: T) => {
                const nyeVerdier: any[] = this.list.map((denne: Abonnement<T>, j) => (i === j ? nyVerdi : denne.verdi));
                if (nyeVerdier.defined().length === this.list.length) {
                    super.varsle(nyeVerdier as any);
                }
            })
        );
    }

    avslutt(id: number) {
        this.avsluttListe.forEach((_id, index) => this.list[index].avslutt(id));
        super.avslutt(id);
    }
}

/**
 * Combines several `Abonnement`s into one. Subscribers are notified every
 * time **any** source publishes, with the array of all current values
 * (defined or not). Compare with `AlleAbonnementer`, which waits until every
 * source has a value.
 */
export class JoinedAbonnement<T> extends Abonnement<T> {
    private avsluttListe: number[];

    constructor(private list: Abonnement<T>[]) {
        super();

        this.avsluttListe = this.list.map((abonnent: Abonnement<T>, i) =>
            abonnent.abonner((nyVerdi: T) => {
                const nyeVerdier: T[] = this.list.map((denne: Abonnement<T>, j) => (i === j ? nyVerdi : denne.verdi));
                super.varsle(nyeVerdier as any);
            })
        );
    }

    avslutt(id: number) {
        this.avsluttListe.forEach((_id, index) => this.list[index].avslutt(id));
        super.avslutt(id);
    }
}
