/* eslint-disable @typescript-eslint/no-explicit-any */
import { Abonnement, JoinedAbonnement, AlleAbonnementer } from '../src/abonnement';
import '@hansogj/array.utils';

let stringAbonnement: Abonnement<string>;
let numberAbonnement: Abonnement<number>;
let stringAbonnent: jest.Mock;
let numberAbonnent: jest.Mock;
let stringAbonnentId: number;
let numberAbonnentId: number;
const initiellVerdi: string = 'initiell verdi';
const nyVerdi: string = 'random oppdatering av verdi';
const lastCall = (spy: jest.Mock) =>
    []
        .concat(spy.mock.calls as any)
        .last()
        .flatMap((e) => e)
        .shift();

describe('Abonnement', () => {
    afterEach(jest.restoreAllMocks);
    afterEach(jest.resetAllMocks);
    beforeEach(() => {
        stringAbonnement = new Abonnement<string>(initiellVerdi);
        numberAbonnement = new Abonnement<number>();
        stringAbonnent = jest.fn();
        numberAbonnent = jest.fn();
        stringAbonnentId = stringAbonnement.abonner(stringAbonnent);
        numberAbonnentId = numberAbonnement.abonner(numberAbonnent);
    });

    describe('setter opp abonnement', () => {
        it('abonnent er lagt til liste over abonnenter', () => {
            expect(stringAbonnement.__test.abonnenter.length).toEqual(1);
            expect(numberAbonnement.__test.abonnenter.length).toEqual(1);
        });

        it('listen over abonnenter vokser', () => {
            stringAbonnement.abonner(() => {});
            stringAbonnement.abonner(() => {});
            stringAbonnement.abonner(() => {});
            stringAbonnement.abonner(() => {});
            expect(stringAbonnement.__test.abonnenter.length).toEqual(5);
        });

        it('abonnement kalles umiddelbart hvis initiell verdi er angitt', () => {
            expect(stringAbonnent).toHaveBeenCalledTimes(1);
            expect(stringAbonnent).toHaveBeenCalledWith(initiellVerdi);
            expect(numberAbonnent).not.toHaveBeenCalled();
        });
    });

    describe('abonnent kalles ved oppdatering', () => {
        beforeEach(() => stringAbonnement.varsle(nyVerdi));
        beforeEach(() => numberAbonnement.varsle(22));

        it('abonnent blir kallet', () => {
            expect(stringAbonnent).toHaveBeenCalledTimes(2);
            expect(numberAbonnent).toHaveBeenCalledTimes(1);
        });

        it('abonnent oppdateres med ny verdi', () => {
            expect(lastCall(stringAbonnent)).toEqual(nyVerdi);
            expect(lastCall(numberAbonnent)).toEqual(22);
        });
    });

    describe('abonnement skal ikke kalles initielt hvis angitt ', () => {
        let annenSpion: jest.Mock;
        beforeEach(() => {
            annenSpion = jest.fn();
            stringAbonnement.abonner(annenSpion, false);
        });

        it('er ikke kalt verdi', () => expect(annenSpion).not.toHaveBeenCalled());
        describe('men så', () => {
            beforeEach(() => stringAbonnement.varsle(nyVerdi));
            it('er ikke kalt verdi', () => expect(annenSpion).toHaveBeenCalledTimes(1));
        });
    });

    describe('abonnement holder på aktuell verdi ', () => {
        beforeEach(() => stringAbonnement.varsle(nyVerdi));

        it('forventet verdi', () => {
            expect(stringAbonnement.verdi).toEqual(nyVerdi);
            expect(numberAbonnement.verdi).toEqual(undefined);
        });
    });

    describe('abonnent kalles med oppdatering + utgått verdi', () => {
        beforeEach(() => numberAbonnement.varsle(0));
        beforeEach(() => numberAbonnement.varsle(22));
        it('abonnent oppdatert med ny og gammel verdi', () => expect(numberAbonnent.mock.calls.pop()).toEqual([22, 0]));
    });

    describe('abonnent skal kunne melde seg av abonnementet', () => {
        beforeEach(() => {
            stringAbonnement.avslutt(stringAbonnentId);
            numberAbonnement.avslutt(numberAbonnentId);
            stringAbonnement.varsle(nyVerdi);
            numberAbonnement.varsle(22);
        });

        it('abonnent er fjernet fra liste over abonnenter', () => {
            expect(stringAbonnement.__test.abonnenter.length).toEqual(0);
            expect(numberAbonnement.__test.abonnenter.length).toEqual(0);
        });

        it('abonnent blir ikke kallt selvom abonnementstilbyder oppdaterer', () => {
            expect(stringAbonnent).toHaveBeenCalledTimes(1);
            expect(stringAbonnent).toHaveBeenCalledWith(initiellVerdi);
            expect(numberAbonnent).not.toHaveBeenCalled();
        });
    });
});

describe('JoinedAbonnement', () => {
    let joinedAbonnementId: number;
    let joinedAbonnement: Abonnement<any>;
    let joinedAbonnent: jest.Mock;
    beforeEach(() => {
        stringAbonnement = new Abonnement<string>(initiellVerdi);
        numberAbonnement = new Abonnement<number>();
        joinedAbonnent = jest.fn();
        joinedAbonnement = new JoinedAbonnement<unknown>([stringAbonnement, numberAbonnement]);

        joinedAbonnementId = joinedAbonnement.abonner(joinedAbonnent);
    });

    it('blir kallt initielt', () => expect(joinedAbonnent).toHaveBeenCalled());
    it('blir kallt initielt', () => expect(lastCall(joinedAbonnent)).toEqual([initiellVerdi, undefined]));

    describe('kalles nå en av verdiene endrer seg', () => {
        beforeEach(() => numberAbonnement.varsle(2));
        it('oppdatert', () => expect(joinedAbonnent).toHaveBeenCalledTimes(2));
        it('oppdatert', () => expect(lastCall(joinedAbonnent)).toEqual([initiellVerdi, 2]));
    });

    describe('kalles nå en av verdiene endrer seg selvom den er undefined', () => {
        beforeEach(() => stringAbonnement.varsle(undefined as any));
        it('oppdatert', () => expect(joinedAbonnent).toHaveBeenCalledTimes(2));
        it('oppdatert', () => expect(lastCall(joinedAbonnent)).toEqual([undefined, undefined]));

        it('begge oppdatert', () => {
            stringAbonnement.varsle('EN');
            numberAbonnement.varsle(2);
            expect(joinedAbonnent).toHaveBeenCalledTimes(4);
            expect(lastCall(joinedAbonnent)).toEqual(['EN', 2]);
        });
    });
    describe('avslutt alle abonneter', () => {
        beforeEach(() => {
            joinedAbonnement.avslutt(joinedAbonnementId);
            stringAbonnement.varsle(nyVerdi);
            numberAbonnement.varsle(22);

            expect(stringAbonnement).toBeDefined();
        });

        it('abonnent er fjernet fra liste over abonnenter', () => {
            expect(stringAbonnement.__test.abonnenter.length).toEqual(0);
            expect(numberAbonnement.__test.abonnenter.length).toEqual(0);
        });

        it('abonnent blir ikke kallt selvom abonnementstilbyder oppdaterer', () => {
            expect(stringAbonnent).not.toHaveBeenCalled();
            expect(numberAbonnent).not.toHaveBeenCalled();
        });
    });
});

describe('AlleAbonnenter', () => {
    let alleAbonnenter: Abonnement<any>;
    let alleAbonnenterId: number;
    let alleSpy: jest.Mock;

    beforeEach(() => {
        stringAbonnement = new Abonnement<string>(undefined);
        numberAbonnement = new Abonnement<number>(undefined);
        alleSpy = jest.fn();
        alleAbonnenter = new AlleAbonnementer([stringAbonnement, numberAbonnement]);
        alleAbonnenterId = alleAbonnenter.abonner(alleSpy);
    });

    it('blir ikke  kallt initielt', () => expect(alleSpy).not.toHaveBeenCalled());

    describe('kalles ikke om kun  en av verdiene er definert', () => {
        beforeEach(() => numberAbonnement.varsle(2));
        it('oppdatert', () => expect(alleSpy).not.toHaveBeenCalled());
    });

    describe('kalles kun om alle verdier er definert', () => {
        beforeEach(() => stringAbonnement.varsle(undefined as any));
        beforeEach(() => numberAbonnement.varsle(2));
        it('oppdatert', () => expect(alleSpy).not.toHaveBeenCalled());
        it('begge oppdatert', () => {
            stringAbonnement.varsle('EN');
            expect(alleSpy).toHaveBeenCalledTimes(1);
            expect(lastCall(alleSpy)).toEqual(['EN', 2]);
        });
    });

    describe('kalles ikke om en verdi går tilbake til undef', () => {
        beforeEach(() => stringAbonnement.varsle('EN'));
        beforeEach(() => numberAbonnement.varsle(2));
        it('oppdatert', () => expect(alleSpy).toHaveBeenCalledTimes(1));
        it('begge oppdatert', () => {
            stringAbonnement.varsle(undefined as any);
            expect(alleSpy).toHaveBeenCalledTimes(1);
            expect(lastCall(alleSpy)).toEqual(['EN', 2]);
        });
    });

    describe('avslutt alle abonneter', () => {
        beforeEach(() => {
            alleAbonnenter.avslutt(alleAbonnenterId);
            stringAbonnement.varsle(nyVerdi);
            numberAbonnement.varsle(22);

            expect(stringAbonnement).toBeDefined();
        });

        it('abonnent er fjernet fra liste over abonnenter', () => {
            expect(stringAbonnement.__test.abonnenter.length).toEqual(0);
            expect(numberAbonnement.__test.abonnenter.length).toEqual(0);
        });

        it('abonnent blir ikke kallt selvom abonnementstilbyder oppdaterer', () => {
            expect(stringAbonnent).not.toHaveBeenCalled();
            expect(numberAbonnent).not.toHaveBeenCalled();
        });
    });
});
