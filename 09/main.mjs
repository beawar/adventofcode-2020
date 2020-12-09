import fs from 'fs';
import readline from 'readline';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => data.push(parseInt(line)));
        readInterface.on('close', () => resolve(data));
    });
}

fillData('input.txt')
.then(data => {
    let notSum;
    const preambleSize = 25;
    for (let i=preambleSize; i<data.length; i++) {
        const currentValue = data[i];
        const preamble = data.slice(i-preambleSize, i);

        let found = false;
        for(let min=0; min<preamble.length && !found; min++){
            for(let max=0; max < preamble.length && !found; max++) {
                found = min != max && preamble[min] + preamble[max] === currentValue;
            }
        }

        if (!found) {
            notSum = data[i];
        }
    }
    console.log(notSum);

    let found = false;

    let i=0;
    const values = [];
    while(i<data.length && !found) {
        const sum = values.reduce((sum, val) => sum + val, 0);
        if (sum > notSum) {
            values.shift();
        }
        else if (sum < notSum) {
            values.push(data[i]);
            i++;
        }
        else {
            found = true;
        }
    }
    if (found) {
        values.sort((a, b) => a-b);
        console.log(values[0] + values[values.length-1]);
    }
    else {
        console.log('Sum not found');
    }
})
.catch(err => console.log(err));