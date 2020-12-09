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
        // given the 25 elements before the current value, remove the values greater than current value because
        // they can't be useful for the sum
        const preamble = data.slice(i-preambleSize, i).filter(val => val < currentValue);
        // sort the array in a numerical way
        preamble.sort((a, b) => a-b);

        let found = false;
        let min = 0;
        let max = preamble.length - 1;

        // since the preamble is sorted, sum the max and the min value.
        // if sum is lower than current value, increase minIndex than try again with a greater min value
        // if sum is greater than current value, decrease maxIndex than try again with a lower max value
        // otherwise the sum is equal to the current value, so skip this current value and check next in data
        while(!found && min < max) {
            const sum = preamble[min] + preamble[max];
            if (sum < currentValue) {
                min += 1;
            }
            else if (sum > currentValue) {
                max -= 1;
            }
            else {
                found = true;
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