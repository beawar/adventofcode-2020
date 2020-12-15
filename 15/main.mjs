
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function main(limit) {
    const input = "8,13,1,0,18,9".split(',');
    //const input = "0,3,6".split(',');
    // in the oject of indexes save all but last values as keys and indexes as values.
    const indexByValue = input.reduce((map, value, index) => {
        if (index < input.length-1) {
            //console.log(parseInt(value));
            const intValue = parseInt(value);
            map[intValue] = index;
        }
        return map;
    }, {});
    const data = input.map(el => parseInt(el));
    let i = input.length - 1;
    let lastValue = parseInt(input[i]);
    console.log(indexByValue);
    let lastTime = Date.now();
    while (i<limit-1) {
        if (i % 10000000 === 0) {
            const now = Date.now();
            console.log(i, now - lastTime);
            lastTime = now;
        }
        const lastIndex = indexByValue[lastValue];
        indexByValue[lastValue] = i;
        //console.log(i, 'lastIndex', lastIndex, 'lastValue', lastValue);
        if (lastIndex != null) {
            lastValue = i - lastIndex; 
        } else {
            lastValue = 0;
        }
        //console.log(indexByValue)
        i += 1
    }

    //console.log(indexByValue);
    console.log(lastValue);
}

main(2020);
main(30000000);