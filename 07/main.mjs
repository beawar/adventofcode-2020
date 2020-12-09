// read input and spilt each rule in order to have an object like this:
/*
rule = {
    bagColor: <color>,
    <inner bag color>: <number of inner bags>
    <inner bag 2 color>: <number of inner bags 2>
}
*/

const fs = require('fs');
const readline = require('readline');

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const ri = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        ri.on('line', line => {
            const lineWithoutDot = line.replace('.', '');
            const bagColor = lineWithoutDot.split('bags', 1)[0].trim();
            const innerBags = lineWithoutDot.split('contain')[1].split(',');
            const bag = {
                bagColor: bagColor
            }
            for(innerBag of innerBags) {
                if (!innerBag.includes('no other bags')) {
                    const qty = parseInt(innerBag.match(/\d+/g)[0]);
                    const color = innerBag.trim().match(/\D+/g)[0].replace(/bag(s)*/, '').trim();
                    bag[color] = qty;
                }
            }
            data.push(bag);
        });
        ri.on('close', () => resolve(data));
    })
}

function searchColor(searchedColor, currentBag, rules) {
    if (currentBag.bagColor === searchedColor) {
        return false;
    }
    if (currentBag.hasOwnProperty(searchedColor)) {
        return true;
    }

    for (innerColor in currentBag) {
        if (innerColor !== 'bagColor') {
            const innerBag = rules.filter(rule => rule.bagColor === innerColor);
            const found = searchColor(searchedColor, innerBag[0], rules);
            if (found) {
                return true;
            }
        }
    }
    return false;
}


function calculateInnerBagsSum(currentBag, rules) {
    let innerBagsQty = 0;
    
    for (innerColor in currentBag) {
        if (innerColor != 'bagColor') {
            const innerColorQty = currentBag[innerColor];
            const innerBag = rules.filter(rule => rule.bagColor === innerColor)[0];
            const innerColorQtySum = calculateInnerBagsSum(innerBag, rules);
            innerBagsQty += innerColorQty + innerColorQty * innerColorQtySum;
        }
    }
    return innerBagsQty;


}

fillData('input_sabrina.txt')
.then(rules => {
    const resultList = [];
    let shinyInnerBags = 0;
    for (rule of rules) {
        const found = searchColor('shiny gold', rule, rules);
        if (found) {
            resultList.push(rule.bagColor);
        }

        if (rule.bagColor === 'shiny gold') {
            shinyInnerBags = calculateInnerBagsSum(rule, rules);
        }
    }
    console.log(resultList.length);
    console.log(shinyInnerBags);
})
.catch(err => console.log(err));