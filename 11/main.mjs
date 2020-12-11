import fs from 'fs';
import readline from 'readline';

String.prototype.replaceAt = function(index, char) {
    return this.substr(0, index) + char + this.substr(index+1);
}

const fillData = (file) => {
    return new Promise((resolve, reject) => {
        const data = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => data.push(line));
        readInterface.on('close', () => resolve(data));
    });
}

fillData('input.txt')
.then(data => {
    let stable = false;
    let firstRound = true;
    while(!stable) {
        const prevData = [...data];
        //console.log('-------------------------------------------------------------------------');
        //console.log('-------------------------------------------------------------------------');
        for(let i=0; i<data.length; i++) {
            const prevPrevLine = i>0 ? prevData[i-1] : null;
            const prevNextLine = i+1<prevData.length ? prevData[i+1] : null;
            const prevCurrLine = prevData[i];
            for(let j=0; j<data[i].length; j++) {
                // for every seat in the line, put in the array adjacent all the 8 adjacent seats
                const adjacent = [];
                if (j>0) {
                    adjacent.push(prevCurrLine[j-1]);
                }
                if (j+1<data[i].length){
                    adjacent.push(prevCurrLine[j+1]);
                }
                if (prevPrevLine) {
                    adjacent.push(prevPrevLine[j]);
                    if (j>0) {
                        adjacent.push(prevPrevLine[j-1]);
                    }
                    if (j+1<data[i].length){
                        adjacent.push(prevPrevLine[j+1]);
                    }
                }
                if (prevNextLine) {
                    adjacent.push(prevNextLine[j]);
                    if (j>0) {
                        adjacent.push(prevNextLine[j-1]);
                    }
                    if (j+1<data[i].length){
                        adjacent.push(prevNextLine[j+1]);
                    }
                }

                //console.log(i, j, data[i][j], '[', adjacent.join(','), ']', adjacent.filter(seat => seat === '#').length);
                if (data[i][j] === 'L') {
                    // if the seat is empty and there are no occupied seats adjacent to it, the seat becomes occupied
                    if(adjacent.filter(seat => seat === '#').length === 0) {
                        data[i] = data[i].replaceAt(j, '#');
                    }
                }
                else if (data[i][j] === '#') {
                    // if the seat is occupied and four or more seats adjacent to it are occupied, the seat becomes empty
                    if (adjacent.filter(seat => seat === '#').length >= 4) {
                        data[i] = data[i].replaceAt(j,'L');
                    }
                }
                // floor never changes
            }
            //console.log(i, data[i]);
        }
        // once done all the changes, check if current data equals to prev data. If so, state is stable
        if (!firstRound && data.join('') === prevData.join('')) {
            stable = true;
        }
        firstRound = false;
    }

    //console.log(data.join(''));
    console.log((data.join('').match(/#/g) || []).length);
})
.catch(err => console.log(err));