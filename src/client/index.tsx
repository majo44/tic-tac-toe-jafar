import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import {
    Route,
    RouterProvider,
    Routes,
    createBrowserRouter,
    useNavigate
} from 'react-router-dom';

import { NickContext } from './nick.context.js';
import Gameboard from './gameboard.component.js';
import JoinForm from './join.form.component.js';
import { parseCookie } from './utils/parse-cookie.js';

const cookies = parseCookie(document.cookie);
//parseCookie służy do przetworzenia ciasteczek znajdujących się w document.cookie  

export let element = ( //export zmienna element
    <h1 className="greeting"> 
        Walcome in Jafar's Tic-Tac-Toe!
        <JoinForm />
    </h1>
);
//tworzy nagłówek z klasą css 'greeting'
//wywołuje komponent JoinForm
const router = createBrowserRouter([ //tworzymy stałą router z funkcją createBrowserRouter który tworzy nowy router 
    {
        path: '/gameboard.component', //definiuje ściężkę dla routera 
        element: <Gameboard /> //wstawia element Gameboard w miejsce do którego pasuje
    },
    {
        path: '/', //natomiast tutaj definiujemy ściężkę dla głównej strony 
        element
    }
]);

const main = (
  <NickContext.Provider value={{ nick: cookies['Nick'] || ''}}>  
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </NickContext.Provider>
); 
//1 linijka
// Wykorzystuje kontekst React zdefiniowany wcześniej (`NickContext`). 
//`NickContext.Provider` jest używany do dostarczenia wartości kontekstu, która obejmuje pole 
//`nick`. Wartość tego pola jest pobierana z ciasteczka o nazwie 'Nick' lub ustawiana na pusty ciąg znaków, jeśli ciasteczko nie istnieje.
//2 linijka
//`React.StrictMode` to narzędzie do pomocy w wykrywaniu potencjalnych problemów w aplikacji React.
// Jest to komponent, który wprowadza dodatkowe sprawdzanie poprawności i ostrzeżenia w czasie kompilacji.
//RouterProvider` jest komponentem, który integruje router z aplikacją React. Przyjmuje on `router` jako parametr,
// który zawiera konfigurację tras i komponentów do renderowania w zależności od ścieżki URL.


const root = createRoot(document.getElementById('root') as HTMLElement);
//createRoot` to funkcja, która tworzy nowy "korzeń" dla aplikacji React. W tym przypadku korzeń jest utworzony w elemencie o identyfikatorze 'root'.
// Jest to zazwyczaj główny punkt wejścia dla całej aplikacji React.

root.render(main);
//Metoda `render` jest używana do zamocowania głównego komponentu (`main`) w drzewie DOM. Ten komponent będzie teraz renderowany w elemencie o identyfikatorze 'root'.