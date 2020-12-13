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
    
    let found = false;
    const busArraySorted = busArray.map((el,index) => {
        return {
            id: (isNaN(el) ? 0 : parseInt(el)),
            offset: index
        };
    })
    .filter(el => el.id > 0)
    .sort((a, b) => b.id - a.id);
    
    let timestamp = Math.floor(100000000000000/busArraySorted[0].id)*busArraySorted[0].id;
    console.log('Start from:', timestamp);

    while (!found) {
        timestamp += busArraySorted[0].id;
        let allOffsetsOk = true;
        if(timestamp % 1000000000 === 0) {
            console.log(timestamp);
        }
       
        for (let i=1; i<busArraySorted.length && allOffsetsOk; i++) {
            const timestampWithOffset = timestamp - busArraySorted[0].offset + busArraySorted[i].offset;
            const busArrival = timestampWithOffset / busArraySorted[i].id;
            allOffsetsOk = busArrival % 1 === 0;
            if (allOffsetsOk) {
                //console.log(i, busArraySorted[i].id, timestamp);
            }
        }
        found = allOffsetsOk;
    }
    console.log('Result', timestamp-busArraySorted[0].offset);
}

fillData('input.txt')
.then(data => {
    //part1(data);
    part2(data);
})
.catch(err => console.error(err));