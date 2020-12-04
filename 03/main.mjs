import fs  from 'fs';
import readline from 'readline';
import lodash from 'lodash';

function fillMap(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => data.push(line.split('')));
        readInterface.on('close', () => resolve(data));
    });
}

fillMap('input.txt')
.then((data) =>{
    const slopes = [
        { right: 1, down: 1, path: [] },
        { right: 3, down: 1, path: [] },
        { right: 5, down: 1, path: [] },
        { right: 7, down: 1, path: [] },
        { right: 1, down: 2, path: [] }
    ];

    slopes.forEach(slope => {
        let rowIndex = 0;
        let columnIndex = 0;
        while (rowIndex < data.length) {
            let currRow = data[rowIndex];
            while (columnIndex >= currRow.length) {
                data = lodash.map(data, row => [...row, ...row]);
                currRow = data[rowIndex];
            }

            slope.path.push(currRow[columnIndex]);

            rowIndex += slope.down;
            columnIndex += slope.right;
        }

        slope.result = lodash.filter(slope.path, item => item === '#').length
    });

    slopes.forEach(slope => console.log(slope.right, slope.down, slope.result, slope.path.join(' ')));
    console.log(lodash.reduce(slopes, (res, s) => res*s.result, 1));
})
.catch(err => console.log(err));