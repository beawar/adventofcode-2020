import fs from 'fs';
import { resolve } from 'path';
import readline from 'readline';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const rules = {};
        const messages = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => {
            if(line.includes(':')) {
                const rule = line.split(':');
                rules[parseInt(rule[0])] = rule[1];
            }
            else {
                messages.push(line);
            }
        });
        readInterface.on('close', () => resolve({ rules: rules, messages: messages }));
    });
}

function resolveRule(rules, number) {
    let rule = rules[number];
    //console.log(number, rule);
    // for part 2 replace rule itself inside rule
    const numberRegex = new RegExp('\\b' + number + '\\b', 'g');
    if ((rule.match(numberRegex) || []).length > 0) {
        const ruleWithoutNumberArr = rule.split(number);
        let ruleWithoutNumber = '';
        for (let rulePart of ruleWithoutNumberArr) {
            if (rulePart.trim().length > 0) {
                ruleWithoutNumber += ' ' + rulePart.trim() + ' + ';
            }  
        }
        console.log('before', rule);
        rule = rule.replace(numberRegex, '('+ruleWithoutNumber+')+');
        console.log('after', rule);
        //console.log(number, rule.replace(/\s+/g, ''));
    }
    let elements = rule.trim().split(' ');
    for (let i=0; i<elements.length; i++) {
        const element = elements[i];
        if (element && element.trim().length > 0 && !isNaN(element.trim())
            // for part 2 avoid replacement of rule itself
            && parseInt(element) !== number) {
            let extendedRule = resolveRule(rules, parseInt(element));
            if (extendedRule.includes('|')) {
                extendedRule = '(' + extendedRule +')';
            }
            rule = rule.replace(new RegExp('\\b' + element + '\\b', 'g'),  extendedRule);
            rules[number] = rule.replace(/\s+/g, ' ');
            elements = rule.trim().split(' ');
            //console.log(number, rules[number]);
        }
    }
    rule = rule.replace(/\"/g, '');
    
    //console.log('return', number, rule);
    return rule;
}

function main(rules, messages) {
    const extendedRule0 = resolveRule(rules, 0);
    const regexRule0 = '\\b' + extendedRule0.replace(/\s+/g, '') + '\\b';
    //console.log(regexRule0);
    const rule0Matches = messages.filter(msg => msg.match(new RegExp(regexRule0)));
    console.log(rule0Matches.length);
}

fillData('input.txt')
.then(({ rules, messages }) => {
    // part 1 
    main({...rules}, messages);
    // part 2
    const rules2 = {...rules, 8: ' 42 | 42 8', 11: ' 42 31 | 42 11 31'}
    main(rules2, messages); 
})