export const parseCookie = (str: string) =>
//Eksportuje funkcję `parseCookie` jako stałą, która przyjmuje jeden argument - ciąg znaków (string) reprezentujący ciasteczka

    str
        .split(';')
        //Dzieli ciąg znaków na tablicę, używając średników jako separatorów. Każdy element tej tablicy będzie reprezentować jedno ciasteczko

        .map((v) => v.split('='))
        //Mapuje każdy element tablicy na tablicę, dzieląc go na klucz i wartość w oparciu o znak równości
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
            );
            return acc;
        }, {} as Record<string, string>);
        //Redukuje tablicę do pojedynczego obiektu, gdzie kluczem jest nazwa ciasteczka (po zdekodowaniu URI i usunięciu białych znaków),
        // a wartością jest wartość ciasteczka
        // (po zdekodowaniu URI i usunięciu białych znaków). Początkowym akumulatorem jest pusty obiekt.
        //Po zdekodowaniu: oznacza, że specjalne znaki, które zostały zakodowane w celu umieszczenia ich w adresie URL, są zamieniane z powrotem na ich oryginalne postacie.


