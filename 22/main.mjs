import fs from 'fs';
import readline from 'readline';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = {player1: [], player2: []};
        let player1 = true;
        const ri = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        ri.on('line', line => {
            if (line.trim().length > 0) {
                if (line.includes('Player 1')) {
                    player1 = true; // reduntant but i need to skip the line
                }
                else if (line.includes('Player 2')) {
                    player1 = false;
                }
                else if (player1) {
                    data.player1.push(parseInt(line));
                }
                else {
                    data.player2.push(parseInt(line));
                }
            }
        });
        ri.on('close', () => resolve(data));
    });
}

let globalGame = 1;
function playRecursiveCombat(player1, player2) {
    const prevRound = [];
    const thisgame = globalGame;
    let round = 0;
    //console.log();
    //console.log('===  NEW GAME', thisgame, '===');
    while (player1.length > 0 && player2.length > 0) {
        round += 1;
        //console.log();
        //console.log('GAME', thisgame, 'ROUND', round);
        //console.log('PLAYER 1', player1.join());
        //console.log('PLAYER 2', player2.join());
        //console.log('PREV ROUND', prevRound);
        let roundWinner;
        // check previus rounds to avoid loops
        for (let r of prevRound) {
            if (r.player1 === player1.join() && r.player2 === player2.join()) {
                //console.log('EXIT GAME', globalGame, 'PLAYER 1 WIN');
                return 1; // win player 1
            }
        }

        prevRound.push({ player1: player1.join(), player2: player2.join() });
        
        
        const card1 = player1[0];
        const card2 = player2[0];
        
        if (card1 <= player1.length-1 && card2 <= player2.length-1) {
            // play a subgame
            const subPlayer1 = [...player1].slice(1, 1 + card1);
            const subPlayer2 = [...player2].slice(1, 1 + card2);
            globalGame += 1;
            forceStop -= 1;
            roundWinner = playRecursiveCombat(subPlayer1, subPlayer2);
            
            //console.log();
            //console.log('SUBGAME END WITH WINNER', roundWinner);
            
        }
        else if (card1 > card2) {
            roundWinner = 1;
        }
        else {
            roundWinner = 2;
        }

        if (roundWinner === 1) {
            player1.push(card1, card2);
        }
        else if (roundWinner === 2) {
            player2.push(card2, card1);
        }
        else {
            console.log("ERROR No winner found!");
            throw "ERROR No winner found!";
        }

        player1.shift();
        player2.shift();

    }

    return player1.length > 0 ? 1 : 2;
}

function playCombat(player1, player2) {
    while (player1.length > 0 && player2.length > 0) {
        //console.log(round++, player1, player2);
        if (player1[0] > player2[0]) {
            player1.push(player1[0], player2[0]);
        }
        else {
            player2.push(player2[0], player1[0]);
        }
        player1.shift();
        player2.shift();
    }
}

fillData('input.txt')
.then(data => {
    // PART 1
    let round = 0;
    const player1 = [...data.player1];
    const player2 = [...data.player2];
    
    playCombat(player1, player2);

    console.log(player1.reduce((sum, value, index) => sum + (value * (player1.length - index)), 0));
    console.log(player2.reduce((sum, value, index) => sum + (value * (player2.length - index)), 0));


    // PART 2
    const playerR1 = [...data.player1];
    const playerR2 = [...data.player2];
    const now = Date.now();
    console.log('start at', now);
    const winner = playRecursiveCombat(playerR1, playerR2);
    const end = Date.now();
    console.log('end at', end);
    console.log('TOTAL', end - now, 'ms');
    console.log('WINNER IS', winner);
    console.log(playerR1.reduce((sum, value, index) => sum + (value * (playerR1.length - index)), 0));
    console.log(playerR2.reduce((sum, value, index) => sum + (value * (playerR2.length - index)), 0));
})
.catch(err => console.error(err));