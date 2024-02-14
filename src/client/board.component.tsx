import React, { MouseEventHandler, useState } from 'react';
import { Game } from '../server';





export interface PoleProps {
    disabled:boolean;
    value: number; // Wartość pola planszy
    onSquareClick: MouseEventHandler; // Funkcja obsługująca kliknięcie na pole
}

// Komponent reprezentujący pojedyncze pole na planszy
function Pole({ value, onSquareClick, disabled }: PoleProps) {
    return (
        <button className="square" onClick={onSquareClick} disabled={disabled}>
            {value === 1 ? 'X' : value === 2 ? 'O' : ''}
        </button>
    );
}

// Interfejs definiujący propsy dla komponentu Board
interface BoardProps {
    active: boolean;
    game: Game; // Obiekt gry
    setGame: React.Dispatch<React.SetStateAction<Game>>;
    userId: string;
}

// Funkcja komponentu Board
export function Board({ game, userId, active }: BoardProps) {
    
    // Funkcja obsługująca kliknięcie na pole planszy
    const handleClick = (i: number) => {
        if (game.state[i] !== 0) {
            return; // Przerywa, jeśli pole jest już zajęte
        }

        // Wysyła żądanie do endpointu /move z współrzędnymi x i y
        fetch(`/move?x=${i % 3}&y=${Math.floor(i / 3)}&playerId=${userId}`)
            .then((response) => response.json())
            .then((data) => {
                // Aktualizuj stan planszy po udanym ruchu
               
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // Renderuje komponent planszy
    return (
        <>
            <div className="board-row">
                {/* Rząd z trzema polami planszy */}
                <Pole value={game.state[0]} onSquareClick={() => handleClick(0)} disabled={!active}/>
                <Pole value={game.state[1]} onSquareClick={() => handleClick(1)} disabled={!active} />
                <Pole value={game.state[2]} onSquareClick={() => handleClick(2)} disabled={!active} />
            </div>
            <div className="board-row">
                {/* Rząd z trzema polami planszy */}
                <Pole value={game.state[3]} onSquareClick={() => handleClick(3)} disabled={!active} />
                <Pole value={game.state[4]} onSquareClick={() => handleClick(4)} disabled={!active} />
                <Pole value={game.state[5]} onSquareClick={() => handleClick(5)} disabled={!active} />
            </div>
            <div className="board-row">
                {/* Rząd z trzema polami planszy */}
                <Pole value={game.state[6]} onSquareClick={() => handleClick(6)} disabled={!active} />
                <Pole value={game.state[7]} onSquareClick={() => handleClick(7)} disabled={!active} />
                <Pole value={game.state[8]} onSquareClick={() => handleClick(8)} disabled={!active} />
            </div>
        </>
    );
}