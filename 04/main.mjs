import readline from 'readline'
import fs from 'fs'

const REQUIRED_FIELD = ['byr', 'iyr','eyr','hgt','hcl','ecl','pid'];

function fillData(file) {
    return new Promise((resolve, reject) => {
        let jsonStr = '[';
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        let newEntry = true;
        readInterface.on('line', line => {
            if (line.trim().length > 0) {
                const items = line.split(' ');
                for (let i=0; i<items.length; i+=1) {
                    if (newEntry) {
                        jsonStr += '{';
                        newEntry = false;
                    }
                    const current = items[i].split(':');
                    jsonStr += '"' + current[0] + '":"' + current[1] + '",';
                }
            }
            else {
                jsonStr = jsonStr.substr(0, jsonStr.length-1) + '},';
                newEntry = true;
            }
        });
        readInterface.on('close', () => {
            jsonStr = jsonStr.substr(0, jsonStr.length-1);
            jsonStr += '}]';
            resolve(jsonStr);
        });
    });   
}

fillData('input.txt')
.then(jsonStr => {
    const data = JSON.parse(jsonStr);
    const validPass = data.filter(obj => {
        const hgtObj = {};
        if (obj.hgt) {
            hgtObj.num = parseInt(obj.hgt.replace(/^\D+/g, ''));
            hgtObj.str = obj.hgt.replace(/\d+/g, '');
        }


        return REQUIRED_FIELD.every(field => obj.hasOwnProperty(field))
        && parseInt(obj.byr) >= 1920 && parseInt(obj.byr) <= 2002
        && parseInt(obj.iyr) >= 2010 && parseInt(obj.iyr) <= 2020
        && parseInt(obj.eyr) >= 2020 && parseInt(obj.eyr) <= 2030
        && ((hgtObj.str === 'cm' && hgtObj.num >= 150 && hgtObj.num <= 193)
            || (hgtObj.str === 'in' && hgtObj.num >= 59 && hgtObj.num <= 76))
        && (obj.hcl.match(/#([0-9]|[a-f]){6}/g) || []).length === 1
        && (obj.ecl.match(/(amb|blu|brn|gry|grn|hzl|oth)/g) || []).length === 1
        && obj.pid.length === 9 && (obj.pid.match(/\d{9}/g) || []).length === 1;
    }) || [];
    
    console.log(validPass.length);
})
.catch(err => console.log(err));