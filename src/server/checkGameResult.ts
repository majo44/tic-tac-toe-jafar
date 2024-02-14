import { useNavigate } from 'react-router-dom';
import { Game } from './index.js';
import { PoleProps } from '../client/board.component.js';
import { PingResponse } from './index';

export const checkGameResult = (game: Game): string | null => {
    const { state, user1Id, user2Id } = game;
   // const navigate = useNavigate(); 

    // Sprawdzanie, czy któryś z graczy wygrał w poziomie, pionie lub na ukos
    const checkWinner = (userNo: number): boolean => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // Poziom
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // Pion
            [0, 4, 8],
            [2, 4, 6] // Ukos
        ];

        return winConditions.some((condition) =>
            condition.every((pos) => state[pos] === userNo)
        );
    };

    // Sprawdzanie, czy plansza jest pełna (remis)
    const isBoardFull = (state: number[]): boolean => state.every((cell) => cell !== 0);

    let winnerFound = false;
    // Sprawdzanie wyniku
    if (checkWinner(1)) {
        
        return `${user1Id}!`;
    } else if (user2Id && checkWinner(2)) {
        winnerFound = true;
        return `${user2Id}!`;
    } else if (isBoardFull(state)) {
        return 'DRAW';
    }

  
    return null; // Brak zakończenia gry
};