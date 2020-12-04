const { match } = require('assert');
const fs  = require('fs');
const readline = require('readline');

function checkValidPasswords(line, result) {
    const entry = {
        password: line.split(':')[1].trim(),
        minOcc: parseInt(line.split('-')[0]),
        maxOcc: parseInt(line.split(' ')[0].split('-')[1]),
        char: line.split(':')[0].split(' ')[1].trim()
    }
    const policy1 = entry.password.match(new RegExp(entry.char, 'g'));
    if (policy1 != null && policy1.length >= entry.minOcc && policy1.length <= entry.maxOcc) {
        result.result1.push(entry);
    } 
    const policy2 = entry.password.split('');
    const char1match = policy2.length >= entry.minOcc && policy2[entry.minOcc-1] === entry.char;
    const char2match = policy2.length >= entry.maxOcc && policy2[entry.maxOcc-1] === entry.char;
    if ((char1match && !char2match) || (!char1match && char2match)) {
        result.result2.push(entry);
    }
}

function fillArrayResult(file) {
    return new Promise((resolve, reject) => {
        const result = {result1: [], result2: []}
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => checkValidPasswords(line, result));
        readInterface.on('close', ()=>{
            return resolve(result);
        });
    });
}

fillArrayResult('input.txt').then((result) => {
    //console.log('Valid passwords 1:', result.result1);
    console.log('Valid passwords 2:', result.result2);
    console.log('Number of valid passwords 1:', result.result1.length);
    console.log('Number of valid passwords 1:', result.result2.length);
} );

