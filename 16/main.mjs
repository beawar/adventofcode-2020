import fs from 'fs';
import readline from 'readline';
import lodash from 'lodash';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const fields = {};
        const myTicket = [];
        const nearbyTickets = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => {
            if (line.length > 0) {
                if (line.includes('or')) {
                    const field = line.split(':', 1)
                    fields[field] = [];
                    const ranges = line.split(':')[1].split(' or ').map(el => {
                        return el.split('-').map(num => parseInt(num));
                    });
                    fields[field].push(...ranges);
                }
                else if (line.split(',').length > 1) {
                    const ticketValues = line.split(',').map(el => parseInt(el));
                    if (myTicket.length === 0) {
                        myTicket.push(...ticketValues);
                    }
                    else {
                        nearbyTickets.push(ticketValues);
                    }
                }
            }
        });
        const data = {
            fields: fields,
            myTicket: myTicket,
            nearbyTickets: nearbyTickets
        };
        readInterface.on('close', () => resolve(data));
    })
}

function part1(fields, tickets) {
    const ranges = lodash.flatMap(Object.values(fields));
    const invalids = lodash.flatMap(tickets);
    lodash.remove(invalids, el => {
        return lodash.find(ranges, range => lodash.inRange(el, range[0], range[1]+1));
    });
    //console.log(lodash.sum(invalids));
    return lodash.filter(tickets, ticket => {
        return !lodash.find(invalids, invalid => ticket.includes(invalid));
    });
}

// return the field if the ranges are valid
function findField(ranges, ticket, index) {
    let result;
    for (let field in ranges) {
        const found = lodash.find(ranges[field], range => lodash.inRange(ticket[index], range[0], range[1]+1));
        if (found) {
            result = field;
            break;
        }
    }
    //console.log('FOUND', index, result, ranges);
    return result;
}

function checkIfIsOneValidField(ranges, tickets, position) {
    let result = [];
    for (let field in ranges) {
        let found = true;
        for (let t = 0; t < tickets.length && found; t++) {
            found = lodash.find(ranges[field], range => lodash.inRange(tickets[t][position], range[0], range[1]+1));
        }
        if (found) {
            result.push(field);
        }
    }
    //console.log('check if is only one valid', position, result);
    return result.length === 1;
}

function part2(fields, myTicket, tickets) {
    const ranges = { ...fields };
    const result = {};
    const positionsNotFound = lodash.range(0, myTicket.length, 1);
    //console.log(ranges, result);
    let position = 0;
    let rangesTemp = { ...ranges };
    while (positionsNotFound.length > 0) {
        
        if (!positionsNotFound.includes(position)) {
            // if current position is already processed, jump to the next one
            position += 1;
            if (position === myTicket.length) {
                position = 0;
            }
            continue;
        }

        //console.log(position, Object.keys(ranges), Object.keys(rangesTemp))
        
        let foundField = findField(rangesTemp, myTicket, position);
        let validForAll = true;
        // search in every other ticket if the range is valid
        for (let t = 0; t < tickets.length && validForAll; t++) {
            validForAll = lodash.find(rangesTemp[foundField], range => lodash.inRange(tickets[t][position], range[0], range[1]+1));
            //console.log('check others', tickets[t][position], foundField, ranges);
            if (rangesTemp[foundField] === undefined) {
                throw "UNDEFINED " + position + " " + foundField;
            }
        }

        if (validForAll) {
            const onlyOneValidField = checkIfIsOneValidField(rangesTemp, tickets, position);
            //console.log('found', position, foundField, onlyOneValidField);
            if (onlyOneValidField) {
                result[foundField] = position;
                delete ranges[foundField];
                positionsNotFound.splice(positionsNotFound.indexOf(position), 1);
                //console.log(positionsNotFound);
                //console.log('VALID FOR ALL', foundField, position, result);
            }
            rangesTemp = { ...ranges };
            position += 1;
            if (position === myTicket.length) {
                position = 0;
            }
        }
        else {
            // this field is not ok for all, remove it from the current searching ranges and check for another match
            //console.log('not valid for position', position, foundField);
            delete rangesTemp[foundField];
        }
    }
    console.log(result);
    return result;
}

fillData('input.txt')
    .then(({ fields, myTicket, nearbyTickets }) => {
        const valids = part1(fields, nearbyTickets);
        const fieldIndexes = part2(fields, myTicket, valids);
        const departureIndexes = lodash.filter(fieldIndexes, (index, key) => key.includes('departure'));
        const product = lodash.reduce(departureIndexes, (product, index) => myTicket[index] * product, 1);
        console.log(product);
        
    })
    .catch(err => console.error(err));