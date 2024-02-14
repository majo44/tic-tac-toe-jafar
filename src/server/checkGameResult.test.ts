import { describe, it } from "node:test";
import { checkGameResult } from './checkGameResult.js';
import assert from "node:assert";

describe("checkGameResult function", ()=>{
    it("should return draw when the board is full and there is no 3 simbols in a row", () => {
        // when
        const result = checkGameResult({
            currentTurn: '',
            state: [
                1, 2, 1,
                2, 2, 1,
                1, 1, 2

            ],
            user1Id: ''
        });
        // then
        assert.equal(result, 'DRAW') 
    });

    it("should return user1Id Win when the 3 simbols in the row", ()=>{
        //when
        const result = checkGameResult({
            currentTurn: '',
            state: [
                1, 1, 1,
                2, 0, 2,
                0, 2, 0
            ],
            user1Id: '1'
        })
        //then
        assert.equal(result, `1!`)
    })

    it("should return user2Id Win when the 3 simbols in the row", ()=>{
        //when
        const result = checkGameResult({
            currentTurn: '',
            state: [
                2, 2, 2,
                1, 0, 1,
                1, 2, 1
            ],
            user1Id: '1',
            user2Id: '2'
        })
        //then
        assert.equal(result, `2!`)
    })

    it("should return null when the game is still going", ()=>{
        //when
        const result = checkGameResult({
            currentTurn: '',
            state: [
                2, 0, 0,
                0, 1, 0,
                0, 1, 2
            ],
            user1Id: ''
        })
        //then
        assert.equal(result, null)
    })

}) 
