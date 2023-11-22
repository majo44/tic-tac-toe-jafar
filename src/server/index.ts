import * as http from 'http';
import express, { Response } from 'express';
import { readFile } from 'node:fs/promises';
import cookieParser from 'cookie-parser';

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
    res.cookie('SID', sid, {
        maxAge: 60 * 60 * 24
    });
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
            //jeśli existing ma wartość false itp to warunek jest spełniony
            sid = assignSid(res);
            //odpowiedź od serwera żeby przypisał zmienna sid 
        }
    }
    next();
    //wywołanie nastepnej funkcji 
});

let nicks: Array<{
    nick: string;
    lastVisit: number;
}> = [];
//zmienna nicks która jest tablicą i przechowuje wartości nick:string oraz lastvisit:number

function assignNick(nick: string, res: Response) {
    //funkcja assignNick która ma parametry nick: string oraz res: response 
    nicks.push({
        
        nick,
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
        nick = assignNick(nick, res);
        res.writeHead(200);
        res.send();
        //Jeśli 'nick' istnieje, przypisuje mu nową wartość za pomocą funkcji 'assignNick', a następnie wysyła odpowiedź HTTP z kodem stanu 200
    } else { //jeśli nie zostanie spełniona funkcja powyżej
        res.writeHead(400); //odpowiedź z błędem 400
        res.send(); //wyślij odpowiedź
    }
});

app.use(express.static('public'));//middleware(funkcja która ma dostęp do obiektu) z express który pozwala skorzystać z plików z folderu public
app.use(express.static('dist/client'));//tak samo jak wyżej tylko inne foldery 

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
setInterval(() => {
    console.log('clear');
    sids = sids.filter(
        ({ lastVisit }) => Date.now() - lastVisit < 10 * 60 * 10
    );
}, 10 * 60 * 10); // uruchamia funkcję setInterval która czyści tablicę co określony czas  

//zapis stanu gry
//zrobić set interval
//zrobić handler który mówi który użytkownik gra co sekunde każdy gracz musi się oddzywać



