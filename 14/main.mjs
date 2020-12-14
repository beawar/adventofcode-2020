import fs from 'fs';
import readline from 'readline';
import lodash from 'lodash';

String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index+replacement.length);
}

function fillData(file) {
    return new Promise((resolve, reject) => {
        const input = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => input.push(line));
        readInterface.on('close', () => resolve(input));
    });
}

function part1(input) {
    let data = [];
    let currentMask = [];
    for (let inputLine of input) {
        if (inputLine.includes('mask')) {
            currentMask = [];
            const mask = inputLine.split('=')[1].trim();
            for(let i=0; i<mask.length; i++) {
                if (!isNaN(mask[i])) {
                    currentMask.push({index: i, value: mask[i]});
                }
            }
        }
        else {
            const inputSplit = inputLine.split('=');
            const position = parseInt(inputSplit[0].match(/\d+/g, '')[0]);
            let value = parseInt(inputSplit[1].trim());
            value = value.toString(2).padStart(36, '0');
            for (let maskElement of currentMask) {
                value = value.replaceAt(maskElement.index, maskElement.value);
            }
            const newData = data.filter(el => el.position !== position);
            data = [...newData, {position: position, value: parseInt(value, 2)}];
        }
    }

    data.sort((a, b) => a.position - b.position);
    const sum = lodash.reduce(data, (sum, obj) => sum + obj.value, 0);
    console.log(sum);
}


function part2(input) {
    let data = [];
    let currentMask;
    let xSums;
    let i = 0;
    for (let inputLine of input) {
        if (inputLine.includes('mask')) {
            currentMask = [];
            const mask = inputLine.split('=')[1].trim();
            for(let i=0; i<mask.length; i++) {
                if (mask[i] !== '0') {
                    currentMask.push({index: i, value: mask[i]});
                }
            }
            // search all values to sum to min memory slot
            const currentMaskXs = currentMask.filter(el => el.value === 'X').map(el => mask.length - 1 - el.index).sort((a, b) => a-b);
            
            xSums = [0];
            for (let xEl of currentMaskXs) {
                const currentPow = Math.pow(2, xEl);
                const newSums = xSums.map((prevSum) => prevSum + currentPow);
                xSums = [...xSums, ...newSums];
            }
        }
        else {
            const inputSplit = inputLine.split('=');
            const value = parseInt(inputSplit[1].trim());
            let minPosition = parseInt(inputSplit[0].match(/\d+/g, '')[0]);
            minPosition = minPosition.toString(2).padStart(36, '0');

            for (let maskElement of currentMask) {
                // replace X with zero to get the min memory slot
                minPosition = minPosition.replaceAt(maskElement.index, maskElement.value === '1' ? '1' : '0');
            }
            minPosition = parseInt(minPosition, 2);
            
            for(let xSum of xSums) {
                const position = minPosition + xSum;
                lodash.remove(data, el => el.position === position);
                data.push({position: position, value: value});
            }
            
        }
    }

    data.sort((a, b) => a.position - b.position);
    const sum = lodash.reduce(data, (sum, obj) => sum + obj.value, 0);
    console.log(sum);
}

fillData('input.txt')
.then(input => {
    part1(input);
    part2(input);
    
})
.catch(err => console.log(err));