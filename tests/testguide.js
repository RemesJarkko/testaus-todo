/* Importeilla tuodaan käyttöön testausfunktiot vitest-kirjastosta, ja tuodaan mukaan itse testattava koodi eli laskin.js -tiedosto. */
import { describe, test, expect, it } from 'vitest';
import laskin from '../laskin/laskin.js';

/* describe-funktio ryhmittelee testit "Test Suiteksi". */
describe('Laskimen testaus', function () {
  /* Ensimmäinen testi käyttää it-funktiota, joka on behavior-driven development (BDD) -tyylinen tapa kirjoittaa testit. */
  it('should add two numbers correctly and return the sum of 1 + 1', function () {
    const checkSumma = laskin.plusLasku(1, 1);
    expect(checkSumma).toBe(2);
  });

  /* Toinen testi käyttää test-funktiota, jolla ei toiminnallisesti ole it-funktioon nähden mitään eroa, mutta ilmaisee testin tarkoituksen eksplisiittisesti. Ero on kirjoitusasussa. Voit käyttää testeissä myös mitä tahansa kieltä, mutta hyvä käytäntö on pysyä englannissa EIKÄ sekoittaa it- ja test-funktioita samassa testitiedostossa, kuten tässä tiedostossa on tehty... */
  test('Tarkistetaan, että miinusLasku-funktio palauttaa oikean erotuksen vähennyslaskulla 5 - 2', function () {
    const checkSumma = laskin.miinusLasku(5, 2);
    expect(checkSumma).toBe(3);
  });
});
describe('Laskimen toinen testau ihan huvkseen', function () {
  test('Tarkistetaan että pluslasku palauttaa -1 + 5 summan', () => {
    const checkSumma = laskin.plusLasku(-1, 5);
    expect(checkSumma).toBe(4);
  });

  test('tarkistetaan että miinuslasku palauttaa -1 ja 5 erotukset', () => {
    const checkSumma = laskin.miinusLasku(-1, 5);
    expect(checkSumma).toBe(-6);
  });
});
