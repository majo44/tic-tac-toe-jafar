import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import {
    Routes,
    Route,
    useNavigate,
    Router,
    Link,
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { NickContext } from './nick.context.js';
import { InputHandler } from 'concurrently';



export default function JoinForm() { //tworzymy funkcję Joinform 
    const navigate = useNavigate(); // tworzymy stałą navigate która używa funkcji useNavigate (Hook)
    const nickContext = useContext(NickContext); //stała NickContext z wartością string która używa funkcji nickContext
    const [inputValue, setInputValue] = useState(nickContext.nick);
    //deklarujemy stałą która destrukturyzują tablicę ustawiając 2 zmienne,useState jest Hookiem React,inputValue pobierane z nickContext 
    const [errorMessage, setErrorMesssage] = useState('');
    //analogicznie jak wyżej tylko że hook inicjalizuje errorMessege pustym ciągiem znaków
    const navigateGameStart =  async () => { // funkcja navigateGameStart jest asynchroniczna(Umożliwa korzystanie z konstrukcji await)
        
        if (inputValue.trim() === '') { //jeślu wartość inputValue jest puste 
            setErrorMesssage('Pole nie może być puste');//wyświetla komunikat o błędzie
        } else {
            await fetch(`/sn?nick=${inputValue}`);
            //wywołuję funkcję asynchroniczną fetch do wykonania żądania http endpoint /sn z parametrem nick który ma wartość input value
            nickContext.nick = inputValue.trim();
            //ustawia pole nick o nazwie nickContext na wartość inputValue bez białych znaków
            navigate('/gameboard.component');
            //funkcja navigate przenosi użytkownika do komponentu z podaną ścieżką 
        }
    };

    return  (//zwraca div 
        <div>
            <b> Enter your nickname!</b>
            <input //pole tekstowe
                type="text" //które jest typem tekstowym 
                required//jest wymagany aby coś było napisane
                value={inputValue} // wartość inputValue
                onChange={(event) => setInputValue(event.target.value)}
                //onChange(wykonuje coś gdy jest zmiana w polu tekstowym)
                //następnie setInputValue jest ustawiany za każdym razem gdy użytkownik coś tam zmienia
                //event reprezentuje onChange i zawiera informację dot. zmian 
           
           />
              <button type="submit" onClick={navigateGameStart}> 
                Join!
            </button>
               {/*button który jest typem submit i ma w sobie onClick(dzieje się coś podczas kliknięcia) które aktywuje funkcję navigateGamestart  */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {/* jest to warunek który sprawdza czy zmienna errorMessege jest prawdziwa(nie pusta/różna od null) jeśli warunek się spełni wyświetla się kommunikat o błędzie  */}
        </div>
    );
}
