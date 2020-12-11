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

// return the number of adjacent seats occupied around current one, with a range limit to look around equals to limit param.
// if no limit is given, than there is no range, and adjacent could be any seat visible
const getAdjacentOccupiedSeats = (fromData, currentCol, currentRow, limit) => {
    // save the visible seat for every direction
    let adjacent = {
        upLeft: undefined,
        up: undefined,
        upRight: undefined,
        left: undefined,
        right: undefined,
        downLeft: undefined,
        down: undefined,
        downRight: undefined
    };

    // look around at most for limit seats around current
    // if limit is undefined, it is equal to the max dimension between rows and column
    if (limit == null) {
        limit = Math.max(fromData.length, fromData[currentRow].length);
    }
    
    for (let i=1; i<=limit; i++) {
        // check elements to the left, if not already found
        if (adjacent.left === undefined && currentCol-i>=0 && fromData[currentRow][currentCol-i] !== '.') {
            adjacent = {...adjacent, left: fromData[currentRow][currentCol-i]};
        }
        // check elements to the right, if not already found
        if (adjacent.right === undefined && currentCol+i<fromData[currentRow].length && fromData[currentRow][currentCol+i] !== '.'){
            adjacent = {...adjacent, right: fromData[currentRow][currentCol+i]};
        }
        // check elements above
        if (currentRow - i >= 0) {
            // directly above
            if (adjacent.up === undefined && fromData[currentRow-i][currentCol] !== '.') {
                adjacent = {...adjacent, up: fromData[currentRow-i][currentCol]};
            }
            
            // diagonally to left
            if (adjacent.upLeft === undefined && currentCol-i>=0 && fromData[currentRow-i][currentCol-i] !== '.') {
                adjacent = {...adjacent, upLeft: fromData[currentRow-i][currentCol-i]};
            }
            
            // diagonally to right
            if (adjacent.upRight === undefined && currentCol+i<fromData[currentRow-i].length && fromData[currentRow-i][currentCol+i] !== '.') {
                adjacent = {...adjacent, upRight: fromData[currentRow-i][currentCol+i]};
            }
        }

        // check elements under
        if (currentRow + i < fromData.length) {
            // directly under
            if (adjacent.down === undefined && fromData[currentRow+i][currentCol] !== '.') {
                adjacent = {...adjacent, down: fromData[currentRow+i][currentCol]};
            }
            
            // diagonally to left
            if (adjacent.downLeft === undefined && currentCol-i>=0 && fromData[currentRow+i][currentCol-i] !== '.') {
                adjacent = {...adjacent, downLeft: fromData[currentRow+i][currentCol-i]};
            }
            
            // diagonally to right
            if (adjacent.downRight === undefined && currentCol+i<fromData[currentRow+i].length && fromData[currentRow+i][currentCol+i] !== '.') {
                adjacent = {...adjacent, downRight: fromData[currentRow+i][currentCol+i]};
            }
        }
    }

    return Object.values(adjacent).filter(seat => seat === '#').length;
    
}

const movePeople = (data, occupiedToFreeLimit, rangeLimit) => {
    let stable = false;
    let firstRound = true;
    let i=0;
    while(!stable) {
        const prevData = [...data];
        
        for(let i=0; i<data.length; i++) {
            for(let j=0; j<data[i].length; j++) {
                // for every seat in the line, put in the array adjacent all the 8 adjacent seats
                const adjacent = getAdjacentOccupiedSeats(prevData, j, i, rangeLimit);

                if (prevData[i][j] === 'L') {
                    // if the seat is empty and there are no occupied seats adjacent to it, the seat becomes occupied
                    if(adjacent === 0) {
                        data[i] = data[i].replaceAt(j, '#');
                    }
                }
                else if (prevData[i][j] === '#') {
                    // if the seat is occupied and four or more seats adjacent to it are occupied, the seat becomes empty
                    if (adjacent >= occupiedToFreeLimit) {
                        data[i] = data[i].replaceAt(j,'L');
                    }
                }
                // floor never changes
            }
        }
        // once done all the changes, check if current data equals to prev data. If so, state is stable
        if (!firstRound && data.join('') === prevData.join('')) {
            stable = true;
        }
        firstRound = false;
    }

    return (data.join('').match(/#/g) || []).length;
}

fillData('input.txt')
.then(data => {
    const totOccupiedSeats1 = movePeople([...data], 4, 1);
    const totOccupiedSeats2 = movePeople([...data], 5);


    console.log(totOccupiedSeats1, totOccupiedSeats2);
})
.catch(err => console.log(err));