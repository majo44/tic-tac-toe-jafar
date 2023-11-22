import React, { useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import {
    Route,
    RouterProvider,
    Routes,
    createBrowserRouter,
    useNavigate
} from 'react-router-dom';

import { element } from './index.js';
import Square from './game.engine.component.js';
import { NickContext } from './nick.context.js';
import GameEngine from './game.engine.component.js';

export default function Gameboard() {
   //Eksportuje domyślnie funkcję, `Gameboard`. 
    const { nick } = useContext(NickContext);
    //Wykorzystuje hook kontekstu React, `useContext`, do pobrania wartości `nick` z kontekstu o nazwie `NickContext`. 
    //Dzięki temu komponent `Gameboard` ma dostęp do nicku użytkownika przekazanego przez kontekst.

    
    return (
        
        <h1 className="GameEngine">
            Lets play a game {nick} !<br></br>
            Your opponent: {}
            <div>
                <GameEngine />
            </div>
        </h1>
    );
}
