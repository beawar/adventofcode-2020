const fs = require('fs');
const readline = require('readline');
const lodash = require('lodash');

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => data.push({ string: line }));
        readInterface.on('close', () => resolve(data));
    });
}

fillData('input.txt')
    .then(data => {
        console.log('start');
        let maxId = 0;
        for (let i = 0; i < data.length; i += 1) {
            const element = data[i];
            let minRow = 0;
            let maxRow = 127;
            let minCol = 0;
            let maxCol = 7;
            const chars = element.string.split('');

            for (let j = 0; j < chars.length; j += 1) {
                const char = chars[j];
                switch (char) {
                    case 'F':
                        maxRow = maxRow - Math.ceil((maxRow - minRow) / 2);
                        element.string === '' && console.log('row: ', minRow, maxRow);
                        break;
                    case 'B':
                        minRow = minRow + Math.ceil((maxRow - minRow) / 2);
                        element.string === '' && console.log('row: ', minRow, maxRow);
                        break;
                    case 'L':
                        maxCol = maxCol - Math.ceil((maxCol - minCol) / 2);
                        element.string === '' && console.log('col: ', minCol, maxCol);
                        break;
                    case 'R':
                        minCol = minCol + Math.ceil((maxCol - minCol) / 2);
                        element.string === '' && console.log('col: ', minCol, maxCol);
                        break;
                    default:
                        break;
                }
            }

            const id = minRow * 8 + minCol;
            data[i] = {
                ...element,
                row: minRow,
                col: minCol,
                id: id
            }

            if (id > maxId) {
                maxId = id;
            }
        }

        const orderedId = lodash.map(data, 'id').sort();

        for (let i = 1; i < orderedId.length - 1; i += 1) {
            const prev = orderedId[i - 1];
            const curr = orderedId[i];

            if (prev === curr - 2) {
                console.log(curr - 1);
            }
        }
    })
    .catch(err => console.log(err));