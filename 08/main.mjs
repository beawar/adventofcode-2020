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
            data.push({
                type: line.split(' ')[0],
                value: parseInt(line.split(' ')[1]),
                exec: false,
            });
        });
        readInterface.on('close', () => resolve(data));
    });
}

fillData('input.txt')
.then(instructions => {
    let accumulator = 0, accumulator2 = 0;
    let i=0, j=0;
    const jmpAndNopIndexes = [];
    let firstLoop = true;
    while(j>=0 && i<instructions.length) {
        const tryInstructions = [...instructions];
        if (jmpAndNopIndexes.length > 0) {
            const indexToReplace = jmpAndNopIndexes[j];
            if (instructions[indexToReplace].type === 'jmp') {
                tryInstructions[indexToReplace] = {...tryInstructions[indexToReplace], type: 'nop'};
            }
            else if (instructions[indexToReplace].type === 'nop') {
                tryInstructions[indexToReplace] = {...tryInstructions[indexToReplace], type: 'jmp'};
            }
        }
        i = 0;
        accumulator2 = 0;
        while(i<tryInstructions.length && !tryInstructions[i].exec) {
            tryInstructions[i] = {...tryInstructions[i], exec: true};
            switch (tryInstructions[i].type) {
                case 'acc':
                    if (firstLoop) {
                        accumulator += tryInstructions[i].value;
                    }
                    accumulator2 += tryInstructions[i].value;
                    i += 1;
                    break;
                case 'jmp':  
                    if(!jmpAndNopIndexes.includes(i)) {
                        jmpAndNopIndexes.unshift(i);
                        j += 1;
                    }
                    i += tryInstructions[i].value;
                    break;
                case 'nop':
                    if(!jmpAndNopIndexes.includes(i)) {
                        jmpAndNopIndexes.unshift(i);
                        j += 1;
                    }
                    i += 1;
                    break;
                default:
                    i += 1;
                    break;
            }
        }
        firstLoop = false;
        j -= 1;
    }

    console.log(accumulator, accumulator2);
})
.catch(err => console.log(err));