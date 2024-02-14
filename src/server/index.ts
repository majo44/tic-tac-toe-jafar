import * as http from 'http';
import express, { Response, response } from 'express';
import { readFile } from 'node:fs/promises';
import cookieParser from 'cookie-parser';
import { checkGameResult } from './checkGameResult.js';
import { PoleProps } from '../client/board.component.js';
import crypto from 'crypto';

let sids: Array<{
    sid: string;
    lastVisit: number;
}> = [];
//Stworzyłem tablicę która przechowuje SID z wartościami dla SID: string oraz daty ostatniej wizyty jako wartośc number

function assignSid(res: Response) {
    //funkcja o nazwie asssignSid która przechowuje wartość Response
    let sid = crypto.randomUUID();
    //zmienna sid, crypto to global property object który służy tylko do czytania i pozwala stronom internetowym na dostęp do usługi crypto
    sids.push({
        sid,
        lastVisit: Date.now()
    });
    //sids nawiozuję do wcześniej zadeklarowanej zmiennej sids która jest tablicą, metoda push dołącza wartości do tablicy,
    // wyżej podane wartości to sid oraz last visit która ma funkcję pokazującą aktualną datę
    res.cookie('SID', sid);
    //ustawia ciasteczko o nazwie SID na wartość sid z maksymalnym czasem życia maxAge
    return sid;
}
//zwracamy wartość sid
const app = express();
//deklarujemy stałą "app" która będzie używać funkcji express która jest frameworkiem
app.use(cookieParser());
//dodaje middleware(funkcje które mają dostęp do obiektu) który parsuje(interpretuje lub kompiluje)nagłówki Coobie z żądań http

app.get('*', (req, res, next) => {
    //aplikacja express, get - zostanie wykonany kiedy będzie zawołany, obsługuje wszystkie ścieżki i posiada parametry request(zapytanie), response(odpowiedz) oraz nextFunction
    let sid = req.cookies['SID'];
    //zmienna sid = zapytanie do cookies czy jest SID
    if (!sid) {
        //jeśli sid ma wartość false itp to warunek jest spełniony
        sid = assignSid(res);
        //odpowiedź od serwera żeby przypisał zmienna sid
    } else {
        //w przeciwnym wypadku
        const existing = sids.find((s) => s.sid === sid);
        //Wyszukuje obiekt o polu sid równym wartości zmiennej sid w tablicy sids, przypisuje wynik do zmiennej existing
        if (!existing) {
            console.log('renew');
            //jeśli existing ma wartość false itp to warunek jest spełniony
            sid = assignSid(res);
            //odpowiedź od serwera żeby przypisał zmienna sid
        }
    }
    next();
    //wywołanie nastepnej funkcji
});

let nicks: Array<{
    userId: string;
    nick: string;
    lastVisit: number;
}> = [];
//zmienna nicks która jest tablicą i przechowuje wartości nick:string oraz lastvisit:number

function assignNick(nick: string, userId: string, res: Response) {
    //funkcja assignNick która ma parametry nick: string oraz res: response
    nicks.push({
        nick,
        userId,
        lastVisit: Date.now()
    });
    //metoda push dołącza wartości nick oraz lastVisit do tablicy
    res.cookie('Nick', nick, {
        maxAge: 60 * 60 * 24
    });
    //ustawia ciasteczko o nazwie Nick na wartość nick z maksymalnym czasem życia maxAge
    return nick;
    //zwraca wartość nick
}
app.use(cookieParser());
//dodaje middleware(funkcje które mają dostęp do obiektu) który parsuje(interpretuje lub kompiluje)nagłówki Coobie z żądań http
app.get('/sn', (req, res, next) => {
    //aplikacja express, get - zostanie wykonany kiedy będzie zawołany, obsługuje wszystkie ścieżki i posiada parametry request(zapytanie), response(odpowiedz) oraz nextFunction
    const url = new URL(req.url, `http://${req.headers.host}`);
    //stała url która tworzy nowy obiekt URL na podstawie ścieżki żądania, korzystając z protokołu i hosta z nagłówków żądania HTTP
    let nick = url.searchParams.get('nick');
    //zmienna nick wyciąga wartość parametru nick z obiektu URL, który został wcześniej utworzony z nagłówków żądania HTTP
    if (nick) {
        nick = assignNick(nick, req.cookies['SID'], res);
        console.log(`Serwer odebrał nick: ${nick}`);
        res.writeHead(200);
        res.send();
        //Jeśli 'nick' istnieje, przypisuje mu nową wartość za pomocą funkcji 'assignNick', a następnie wysyła odpowiedź HTTP z kodem stanu 200
    } else {
        //jeśli nie zostanie spełniona funkcja powyżej
        res.writeHead(400); //odpowiedź z błędem 400
        res.send(); //wyślij odpowiedź
    }
});

app.use(express.static('public')); //middleware(funkcja która ma dostęp do obiektu) z express który pozwala skorzystać z plików z folderu public
app.use(express.static('dist/client')); //tak samo jak wyżej tylko inne foldery

// setInterval(() => {
//     console.log('clear');
//     sids = sids.filter(
//         ({ lastVisit }) => Date.now() - lastVisit < 10 * 60 * 10
//     );
// }, 10 * 60 * 10); // uruchamia funkcję setInterval która czyści tablicę co określony czas

const activeUsers: { [key: string]: number } = {}; // przechowuje znaczniki czasu ostatniej aktywności użytkowników
export interface Game {
    state: number[];
    user1Id: string;
    user2Id?: string;
    currentTurn: string;
}

export interface PingResponse {
    message: string;
    game: Game;
    opponentName?: string;
    gameEnds: boolean;
}

const activeGames: Game[] = []; //tablica trzyma listę aktywnych gier

app.get('/ping', (req, res) => {
    const userId = req.cookies['SID'];
    activeUsers[userId] = Date.now();

    const myActiveGame = activeGames.find(
        (item) => item.user1Id === userId || item.user2Id === userId
    );
    const anyAvailableGame = activeGames.find(
        (item) => typeof item.user2Id === 'undefined'
    );

    let response: PingResponse;

    if (myActiveGame) {
        // Odpowiedź, jeśli gra dla danego użytkownika istnieje

        // Sprawdzamy wynik gry
        const gameResult = checkGameResult(myActiveGame);

        let opponentName: string | undefined;
        // Jeśli wynik jest dostępny, to gra się zakończyła
        if (myActiveGame.user2Id) {
            if (myActiveGame.user1Id === userId) {
                opponentName = nicks.find(
                    (item) => item.userId === myActiveGame.user2Id
                )?.nick;
            } else {
                opponentName = nicks.find(
                    (item) => item.userId === myActiveGame.user1Id
                )?.nick;
            }
        }

        if (gameResult) {
            response = {
                message: gameResult,
                game: myActiveGame,
                gameEnds: true
            };
        } else {
            response = {
                message: 'You are in the game',
                game: myActiveGame,
                opponentName,
                gameEnds: false
            };
        }
    } else {
        // Sprawdzamy, czy istnieje jakaś gra, w której jest tylko jeden gracz
        if (anyAvailableGame) {
            // Jeśli istnieje taka gra, dołączamy użytkownika do tej gry
            anyAvailableGame.user2Id = userId;
            anyAvailableGame.currentTurn = anyAvailableGame.user1Id; // Ustaw aktualny ruch na gracza 1
            const opponentName = nicks.find(
                (item) => item.userId === anyAvailableGame.user1Id
            )?.nick;
            response = {
                message: 'You joined an existing game',
                game: anyAvailableGame,
                opponentName,
                gameEnds: false
            };
        } else {
            // Jeśli nie ma dostępnej gry, tworzymy nową grę
            const newGame: Game = {
                state: [0, 0, 0, 0, 0, 0, 0, 0, 0], // Początkowy stan gry
                user1Id: userId,
                currentTurn: '' // Ustaw aktualny ruch na użytkownika, który dołączył
            };
            activeGames.push(newGame);
            response = {
                message: 'You created a new game',
                game: newGame,
                gameEnds: false
            };
        }
    }

    res.status(200).json(response);
});

app.get('/move', (req, res) => {
    const userId = req.cookies['SID']; // Pobiera identyfikator userId z ciasteczka
    const activeGame = activeGames.find(
        (item) => item.user1Id === userId || item.user2Id === userId
    );

    if (activeGame) {
        const xString = req.query.x as string;
        const yString = req.query.y as string;

        // Sprawdza, czy x i y są zdefiniowane
        if (xString !== undefined && yString !== undefined) {
            const x = parseInt(xString); // Pobiera współrzędną x z zapytania
            const y = parseInt(yString); // Pobiera współrzędną y z zapytania

            // Sprawdź, czy ruch jest możliwy i aktualizuj planszę
            if (
                activeGame.currentTurn === userId &&
                activeGame.state[x + y * 3] === 0
            ) {
                activeGame.state[x + y * 3] =
                    userId === activeGame.user1Id ? 1 : 2; // Ustaw pole na 1 (X) lub 2 (O)
                activeGame.currentTurn =
                    userId === activeGame.user1Id
                        ? activeGame.user2Id!
                        : activeGame.user1Id; // Zmień tura gracza

                // Przykład jak zwrócić planszę po ruchu
                res.status(200).json({
                    message: 'Move successful',
                    game: activeGame,
                    gameEnds: false
                });
            } else {
                res.status(400).json({
                    message: 'Invalid move',
                    game: activeGame,
                    gameEnds: false
                });
            }
        } else {
            // Zwróć błąd, jeśli x lub y są niezdefiniowane
            const response: PingResponse = {
                message: 'Invalid move - x or y is undefined',
                game: activeGame,
                gameEnds: false
            };
            res.status(400).json(response);
        }
    } else {
        // Brak aktywnej gry dla danego użytkownika
        const response: PingResponse = {
            message: 'No active game found for the user',
            game: {} as Game,
            gameEnds: false
        };
        res.status(400).json(response);
    }
});

// setInterval(() => {
//     //uruchamia funkcję która będzie odpalać się cyklicznie
//     const currentTime = Date.now(); //stała która mówi o tym jaki jest aktualny czas
//     for (const userId in activeUsers) {
//         //rozpocznij pętlę która iteruje(proces przechodzenia przez elementy) po kluczach użytkowników userId
//         if (currentTime - activeUsers[userId] > 10 * 60 * 1000) {
//             // Jeśli użytkownik nie był aktywny przez 10 minut, uznaj go za nieaktywnego
//             console.log(`Użytkownik ${userId} jest nieaktywny.`);
//             delete activeUsers[userId];
//         }
//     }
// }, 5 * 60 * 1000); // Sprawdzaj co 5 minut

app.get('*', async (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const file = await readFile('public/index.html');
    const fileContent = file.toString('utf-8');
    res.end(fileContent);
});
//aplikacja get express która obsługuje każde zaytanie http i zwraca zawartość pliku public/index.html jako odpowiedź stanu kodu 200

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//Ta funkcja uruchamia serwer na porcie 3001 i wypisuje w konsoli adres tego serwera

//wyrenderować userów i stan gry na gameboard
