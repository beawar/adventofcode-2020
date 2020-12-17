import fs from 'fs';
import readline from 'readline';
import lodash from 'lodash';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => data.push(lodash.map(line.split(''), element => [element])));
        readInterface.on('close', () => resolve(data));
    });
}

function getNeighbors(data, x, y, z) {
    const result = [];
    for (let xx=x-1; xx<=x+1; xx++) {
        for (let yy=y-1; yy<=y+1; yy++) {
            for (let zz=z-1; zz<=z+1; zz++) {
                if (xx>=0 && yy>=0 && zz>=0 && xx<data.length && yy<data[0].length && zz<data[0][0].length) {
                    if (xx !== x || yy !== y || zz !== z) {
                        result.push(data[xx][yy][zz]);
                    }
                }
            }
        }
    }
    return result;
}

function part1(data) {
    // current start as data, but after that is rebuild at every cycle
    let current = lodash.cloneDeep(data);
    for (let i=0; i<6; i++) {
        //console.log('cycle', i);
        // clone current in prev before resetting current
        const prev = lodash.cloneDeep(current);
        current = [];
        // check every layer from the index before the first to the layer after the last
        for (let x=-1; x<=prev.length; x++) {
            current.push([]);
            for (let y=-1; y<=prev[0].length; y++) {
                current[x+1].push([]);
                for (let z=-1; z<=prev[0][0].length; z++) {
                    const neighbors = getNeighbors(prev, x, y, z);
                    const activeNeighbors = lodash.filter(neighbors, value => value === '#').length;
                    let currentValue = '.';
                    if (x>=0 && y>=0 && z>=0 && x<prev.length && y<prev[0].length && z<prev[0][0].length) {
                        currentValue = prev[x][y][z];
                    }
                    if (activeNeighbors === 3 || (activeNeighbors === 2 && currentValue === '#')) {
                        current[x+1][y+1].push('#');
                    } 
                    else {
                        current[x+1][y+1].push('.');
                    }
                    //console.log('[', x+1, y+1, z+1, ']', activeNeighbors, currentValue, current[x+1][y+1][z+1]);
                }
                //console.log(current[x+1][y+1]);
            }
            //console.log(x+1, current[x+1]);
        }
    }
    const sumActive = lodash.flatMapDeep(current).filter(el => el === '#').length;
    console.log('sum active', sumActive);
}

fillData('input.txt')
.then(data => {
    part1(data);
})
.catch(err => console.error(err));