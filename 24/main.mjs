import fs from 'fs';
import rl from 'readline';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const ri = rl.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        ri.on('line', line => data.push(line));
        ri.on('close', () => resolve(data));
    });
}

function part1(data) {
    let blackFloor = [];

    for (let istruction of data) {
        let i=0;
        let x = 0, y = 0;
        while (i<istruction.length) {
            if (istruction[i] === 'e') {
                x += 2;
                i += 1;
            }
            else if (istruction[i] === 'w') {
                x -= 2;
                i += 1;
            }
            else {
                if (istruction[i] === 's') {
                    y -= 1;
                }
                else if (istruction[i] === 'n') {
                    y += 1;
                }

                if(istruction[i+1] === 'e') {
                    x += 1;
                }
                else if (istruction[i+1] === 'w') {
                    x -= 1;
                }
                i += 2;
            }
        }
        //console.log({x, y});
        //console.log(blackFloor);
        const index = blackFloor.findIndex(el => el.x === x && el.y === y)
        if (index >= 0) {
            blackFloor.splice(index, 1);
        }
        else {
            blackFloor.push({x, y});
        }
    }

    console.log(blackFloor.length);
    return blackFloor;
}

function part2(floor) {
    for (let day=0; day<100; day++) {
        const prevFloor = [...floor];
        // change blacks to white rule
        //console.log('prevFloor', prevFloor);
        for (let tile of prevFloor) {
            const blackAdjacents = prevFloor.filter(el => (el.x !== tile.x || el.y !== tile.y)
                && Math.abs(tile.x - el.x) <= 2 && Math.abs(tile.y-el.y) <= 1);
            //console.log('tile', tile);
            //console.log('blackAdjacents', blackAdjacents);
            if (blackAdjacents.length === 0 || blackAdjacents.length > 2) {
                floor.splice(floor.findIndex(el => el.x===tile.x && el.y===tile.y), 1);
            }
            // change whites to black rule
            // search all whites neighbors
            const neighbors = [
                {x: tile.x-2, y: tile.y},
                {x: tile.x-1, y: tile.y-1},
                {x: tile.x+1, y: tile.y-1},
                {x: tile.x+2, y: tile.y},
                {x: tile.x+1, y: tile.y+1},
                {x: tile.x-1, y: tile.y+1}
            ];
            // white adjacents are all neighbors that are not in the black adjacents list 
            const whiteAdjacents = neighbors.filter(el => blackAdjacents.findIndex(ad => el.x === ad.x && el.y === ad.y) < 0);
            //console.log('whiteAdjacents', whiteAdjacents);
            // for every white adjacent, if it has 2 black tiles adjacent to it, it becomes black
            for (let whiteTile of whiteAdjacents) {
                //console.log('whiteTile', whiteTile);
                const whiteBlackAdjacents = prevFloor.filter(el => (el.x !== whiteTile.x || el.y !== whiteTile.y)
                && Math.abs(whiteTile.x - el.x) <= 2 && Math.abs(whiteTile.y-el.y) <= 1);
                //console.log('whiteBlackAdjacents', whiteBlackAdjacents);
                if (whiteBlackAdjacents.length === 2) {
                    // add it to floor if not already added from a previous tile inspection
                    if (floor.findIndex(el => el.x === whiteTile.x && el.y === whiteTile.y) < 0) {
                        floor.push({x: whiteTile.x, y: whiteTile.y});
                        //console.log('white becomes black');
                    }
                }
            }
        }
        
        //console.log('floor', floor);
    }
    console.log(floor.length);
}

fillData('input.txt')
.then(data => {
    let floor = part1(data);
    part2(floor);

})
.catch(err => console.error(err));