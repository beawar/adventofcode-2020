import fs from 'fs';
import readline from 'readline';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => {
            data.push(line);
        });
        readInterface.on('close', () => {
            resolve(data)
        });
    });
}

function part1(data) {
    const arrivalTime = data[0];
    // take only valid ids
    const busArray = data[1].match(/\d+/g).map(el => parseInt(el));
    let maxDecimals = 0;
    let closestBus;
    let closestTime = 0;
    // check which bus has the greatest decimals resulting from arrivalTime / bus id
    for (let bus of busArray) {
        let busArrival = arrivalTime / bus;
        let decimals = busArrival % 1;
        if (decimals > maxDecimals) {
            maxDecimals = decimals;
            closestBus = bus;
            // the bus will arrive at next integer * bus id
            closestTime = Math.ceil(busArrival) * bus;
        }
    }
    console.log(closestBus, (closestTime - arrivalTime) * closestBus);
}


function part2(data) {
    // in part 2 I care about bus ids only
    const busArray = data[1].split(',');
    let earliestTimestamp = 100000000000000;
    let found = false;
    while (!found) {
        earliestTimestamp += parseInt(busArray[0]);
        let allOffsetsOk = true;
        for (let i=1; i<busArray.length && allOffsetsOk; i++) {
            if (busArray[i] !== 'x') {
                const timestampWithOffset = earliestTimestamp + i;
                const busArrival = timestampWithOffset / parseInt(busArray[i]);
                allOffsetsOk = busArrival % 1 === 0;
            }
        }
        found = allOffsetsOk;
        console.log(earliestTimestamp);
    }
    console.log(earliestTimestamp)
}

fillData('input.txt')
.then(data => {
    part1(data);
    part2(data);
})
.catch(err => console.error(err));