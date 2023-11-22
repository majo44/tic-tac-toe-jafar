import React, { MouseEventHandler, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';


interface Pole { //deklaracja interface pole
    value: string; //nadajemy wartosc string
    onSquareClick: MouseEventHandler; //definiiuje pole onSquareClick żeby po kliknięciu był wykonywany MouseEvent Handler
}

function Pole({ value, onSquareClick }: Pole) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

export default function Board() {
    const [xIsNext, setXIsNext] = useState(true);
    const [pola, setPola] = useState(Array(9).fill(null));

    function handleClick(i: number) {
        if (pola[i] || calculateWinner(pola)) {
            return;
        }
        const nextPola = [...pola];
        if (xIsNext) {
            nextPola[i] = 'O';
        } else {
            nextPola[i] = 'X';
        }
        setPola(nextPola);
        setXIsNext(!xIsNext);
    }

    function calculateWinner(pola: string[]) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (pola[a] && pola[a] === pola[b] && pola[a] === pola[c]) {
                return pola[a];
            }
        }
        return null;
    }
    const winner = calculateWinner(pola);
    let status;

    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        const isTie = pola.every((pole) => pole != null);

        if (isTie) {
            status = 'Tie!';
        } else {
            status = 'Next player: ' + (xIsNext ? 'O' : 'X'); //zrobić nick
        }
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Pole value={pola[0]} onSquareClick={() => handleClick(0)} />
                <Pole value={pola[1]} onSquareClick={() => handleClick(1)} />
                <Pole value={pola[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Pole value={pola[3]} onSquareClick={() => handleClick(3)} />
                <Pole value={pola[4]} onSquareClick={() => handleClick(4)} />
                <Pole value={pola[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Pole value={pola[6]} onSquareClick={() => handleClick(6)} />
                <Pole value={pola[7]} onSquareClick={() => handleClick(7)} />
                <Pole value={pola[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}
