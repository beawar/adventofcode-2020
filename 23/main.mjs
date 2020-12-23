import lodash from 'lodash';

function part1(input) {
    let data = input.split('').map(el => parseInt(el));
    for (let i=0; i<100; i++) {
        const pickup = data.splice(1, 3);
        //console.log('PICKUP', pickup);
        //console.log('DATA', data);
        let destination = -1;
        while (destination < 0) {
            if (data[0] + destination < Math.min(...data)) {
                destination = data.indexOf(Math.max(...data));
            }
            else if (data.includes(data[0] + destination)) {
                destination = data.indexOf(data[0] + destination);
            }
            else {
                destination -= 1;
            }
        }
        //console.log('DESTINATION', destination);
        data = [...data.slice(1, destination+1), ...pickup, ...data.slice(destination+1), data[0]];
    }
    data = [...data.slice(data.indexOf(1)), ...data.slice(0, data.indexOf(1))];
    data.shift();
    console.log(data.join(''));
}

// SUUUUUUUUPER SLOW, I NEVER REACH THE END OF THIS FUNCTION EXECUTION
function part2(input) {
    let data = input.split('').map(el => parseInt(el));
    const max = lodash.max(data);
    data = lodash.concat(data, lodash.range(max+1, 1000000+1));
    const sortedAllData = [...data].sort((a, b) => a - b);
    let i=0;
    
    for (; i<10000000; i++) {
        if (i % 100000 === 0) console.log(i/100000);
        const currentValue = data[0];
        const pickup = [data[1], data[2], data[3]];
        data = lodash.drop(data, 4);
        //console.log('CURRENT VALUE', currentValue, 'PICKUP', pickup);
        //console.log('DATA', data);
        //const dataSort = lodash.difference(sortedAllData, pickup);
        //if (i % 1 === 0) console.log(i, 'difference', dataSort);
        
        let destination = lodash.nth(sortedAllData, lodash.findLastIndex(sortedAllData, el => !pickup.includes(el), lodash.sortedIndexOf(sortedAllData, currentValue - 1)));
        //console.log('destination before', destination);
        if (pickup.includes(destination)) {
            const dataSort = lodash.difference(sortedAllData, pickup);
            destination = lodash.indexOf(data, dataSort[dataSort.length-1])
        }
        else {
            destination = lodash.indexOf(data, destination);
        }
        //if (i % 100000 === 0) console.log(i, 'destination', destination);
        const firstPart = lodash.slice(data, 0, destination+1);
        //console.log('FIRST PART', firstPart);
        const secondPart = lodash.slice(data, destination+1);
        //console.log('SECOND PART', secondPart);

        data = lodash.concat(firstPart, pickup, secondPart, currentValue);
        //console.log('DATA END', data);
        //if (i % 100000 === 0) console.log(i, 'replace');
    }

    const index1 = lodash.indexOf(data, 1);
    
    if (index1+2 < data.length) {
        console.log(data[index1+1], data[index1+2], data[index1+1]*data[index1+2]);
    }
    else if (index1+1 < data.length) {
        console.log(data[index1+1], data[0], data[index1+1]*data[0]);
    }
    else {
        console.log(data[0], data[1], data[0]*data[1]);
    }

}

function part2_2(input) {
    let dataArr = input.split('').map(el => parseInt(el));
    let data = dataArr.reduce((obj, value, index) => {
        obj[value] = index === dataArr.length-1 ? lodash.max(dataArr)+1 : dataArr[index+1];
        return obj;
    }, {});
    for (let i=lodash.max(dataArr)+1; i< 1000000; i++) {
        data[i] = i+1;

    }
    data[1000000] = dataArr[0];
    
    let current = dataArr[0];
       
    for (let i=0; i<10000000; i++) {

        const p1 = data[current];
        const p2 = data[p1];
        const p3 = data[p2];
        const next = data[p3];

        let destination = current-1;
        let found = false;
        while (!found) {
            if (destination === 0) {
                destination = 1000000;
            }
            if (destination === p1 || destination === p2 || destination === p3) {
                destination -= 1;
            }
            else {
                found = true;
            }
        }
        //console.log(current, p1, p2, p3, next, destination);

        data[p3] = data[destination];
        data[destination] = p1;
        data[current] = next;

        current = next;
    }

    const next = data[1];
    const next2 = data[next]; 
    console.log(next, next2, next*next2);

}

//part1('389125467'); // example
console.log('PART 1');
part1('538914762');
//console.log('PART 2 EXAMPLE');
//part2_2('389125467'); // example
console.log('PART 2');
part2_2('538914762');