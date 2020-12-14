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

fillData('input.txt')
.then(input => {
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
            //console.log('before', value, parseInt(value, 2));
            for (let maskElement of currentMask) {
                value = value.replaceAt(maskElement.index, maskElement.value);
            }
            //console.log('after ', value, parseInt(value, 2));
            const newData = data.filter(el => el.position !== position);
            data = [...newData, {position: position, value: parseInt(value, 2)}];
        }
    }

    data.sort((a, b) => a.position - b.position);
    const sum = lodash.reduce(data, (sum, obj) => sum + obj.value, 0);
    console.log(sum);
})
.catch(err => console.log(err));