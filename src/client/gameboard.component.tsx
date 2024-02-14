import React, { useContext, useEffect, useState } from 'react';
import { NickContext } from './nick.context.js';
import { Board } from './board.component.js';
import type { Game, PingResponse } from '../server/index.js';

const Gameboard = () => {
    const [result, setResult] = useState<string | undefined>();
    const {nick, userId } = useContext(NickContext);
    const [game, setGame] = useState<Game | undefined>();
    const [active, setActive] = useState(false);

    const checkGameStatus = async () => {
        try {
            // Wysłanie żądania GET do serwera w celu sprawdzenia statusu gry
            const response = await fetch(`/ping`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Jeśli odpowiedź jest poprawna, parsuj odpowiedź jako obiekt PingResponse
                const gameStatus: PingResponse = await response.json();
                // Ustaw status gry i sprawdź, czy gracz jest aktywny
                setGame(gameStatus.game);
                setActive(
                    gameStatus.game.currentTurn === userId &&
                        !gameStatus.gameEnds
                );

                // Dodaj logikę tylko gdy gameEnds jest true
                if (gameStatus.gameEnds) {
                    if (gameStatus.message === userId) {
                        setResult("Wygrałeś");
                    } else if (gameStatus.message === "draw") {
                        setResult("Remis");
                    } else {
                        setResult("Przegrałeś");
                    }
                }
                   // setResult(gameStatus.message === userId ?"Wygrałeś")
                     //w tej samej linijce sprawdzić czy messege równa się sytuacji, sprawdzić 2 warunki jestli messege = user id to wygrales a jesli
                   // setResult(gameStatus.message === draw ?"Wygrałeś")
                
            } else {
                // Obsłuż błąd w przypadku niepoprawnej odpowiedzi
                console.error(
                    'Błąd podczas sprawdzania statusu gry:',
                    response.statusText
                );
            }
        } catch (error) {
            // Obsłuż błąd w przypadku wystąpienia wyjątku
            let message;
            if (error instanceof Error) message = error.message;
            else message = String(error);
            reportError({ message });
        }
    };

    useEffect(() => {
        // Ustaw interwał na 3001 milisekund (3 sekundy) do regularnego sprawdzania statusu gry
        const intervalId = setInterval(async () => {
            await checkGameStatus();
        }, 3001);

        // Zatrzymaj interwał po odmontowaniu komponentu
        return () => clearInterval(intervalId);
    }, [userId]); // Uruchom useEffect tylko po zmianie userId

    return (
        <div className="GameEngine">
            {/* Wyświetl nagłówek gry i powitanie */}
            <h1>
                Lets play a game!
                <p>Welcome: {nick}</p>{' '}
            </h1>
            {result && <div> {result} </div>}
            {/* Wyświetl planszę gry, jeśli istnieje, i przekaż odpowiednie dane do komponentu Board */}
            <div>
                {game && (
                    <Board
                        active={active}
                        game={game}
                        userId={userId}
                        setGame={function (
                            value: React.SetStateAction<Game>
                        ): void {}}
                    />
                )}
            </div>
        </div>
    );
};

export default Gameboard;

//lobby aktywnych graczy 
//dodać login hasło 
//zapisywać postęp graczy
//dodać że jeśli spełniony będzie warunek to otwiera okienko
