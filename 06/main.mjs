const fs = require('fs');
const readline = require('readline');
const lodash = require('lodash');

const fillData = (file) => {
    return new Promise((resolve, reject) => {
        const data = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        let newGroup = true;
        let groupArray = [];
        readInterface.on('line', line => {
            if (line.length > 0) {
                if (newGroup) {
                    data.push(groupArray);
                    newGroup = false;
                }
            
                groupArray.push(line);
            }
            else {
                groupArray = [];
                newGroup = true;
            }
        });
        readInterface.on('close', () => resolve(data));
    });
}

fillData('input.txt')
.then(data => {
    const dataStr = lodash.map(data, group => {
        return lodash.reduce(group, (groupStr, personStr) => groupStr += personStr);
    }, '');

    const uniqData = lodash.map(dataStr, str => lodash.uniq(str.split('')).sort().join(''));
    console.log(lodash.reduce(uniqData, (sum, str) => sum += str.length, 0));

    const groupStringArr = lodash.map(data, group => lodash.map(group, str => str.split('')));
    const sumCommon = lodash.reduce(groupStringArr, (sum, group) => {
        const intersection = lodash.reduce(group, (commonChars, strArr) => commonChars.filter(char => strArr.includes(char)));
        return sum += intersection.join('').length;
    }, 0);
    console.log(sumCommon);
})