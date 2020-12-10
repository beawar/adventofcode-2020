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
    // PART 1

    // first, sort data in a numerical ascending order
    data.sort((a, b) => a-b);
    // second, add the charging outlet, which is 0, and the device's adapter, which is always the greatest +3
    data.unshift(0);
    data.push(data[data.length -1] + 3);
    // then find number of differences of 1, 2 and 3
    const differences = {1: 0, 2: 0, 3: 0}
    for (let i=1; i<data.length; i++) {
        const diff = data[i] - data[i-1];
        differences[diff] += 1;
    }

    console.log(differences[1] * differences[3]);

    // PART 2

    // combinations contains the number of available combinations for every value of the input,
    // incrementally. At index 0 I will always have 1 possible combination, because even if
    // my input had just 1 value, than the one and only combination is just the value itself (i.e. the input)
    const combinations = [1];
    for(let i=1; i<data.length; i++) {
        const currentValue = data[i];
        // validLinks is the number of possible path which current value can link to.
        // From the input data, extract only the previous 3 value, the only ones that
        // can be equals or greater than currentValue - 3, than count of this 3 values
        // how many are valid (really are >= currentValue -3)
        const validLinks = data.slice(i-3 > 0 ? i-3 : 0, i)
            .filter(prevValue => prevValue >= currentValue-3).length;
        // now, I can found the number of combinations that I would have adding current value to all its valid
        // links summing the combinations found previously, starting from current index minus the number
        // of valid links found above
        let sumOfPrevCombinations = 0;
        for (let j=i-validLinks; j<i; j++) {
            sumOfPrevCombinations += combinations[j];
        }
        // finally, I can put in combinations array, for current value index, the number of combinations found
        combinations[i] = sumOfPrevCombinations;
    }

    console.log(combinations[combinations.length-1]);
})
.catch(err => console.log(err));