import fs from 'fs';
import readline from 'readline';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const readInterface = new readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        const data = [];
        readInterface.on('line', line => data.push(line));
        readInterface.on('close', () => resolve(data));
    });
}

function extractInnerExpression(expr) {
    return expr.match(/\((\d|\+|\+|\*|\s)+\)/g);
}

function extractSums(expr) {
    return expr.match(/[0-9]+(\s\+\s[0-9]+)+/g);
}

function resolveSimpleExpression(expr, advance) {
    let workExpr = expr.replace(/\(|\)/g, '');
    if (advance) {
        workExpr = resolveSums(workExpr);
    }
    let symbols = workExpr.split(' ');
    let result = parseInt(symbols[0]);
    for (let i=2; i<symbols.length; i+=2) {
        if (!isNaN(symbols[i])) {
            const prevRes = result;
            result = eval(`${result}${symbols[i-1]}${symbols[i]}`);
            //console.log(`${prevRes} ${symbols[i-1]} ${symbols[i]}`, result);
            
        }
    }
    return result;
}

function resolveSums(expr) {
    let workExpr = expr;
    let innerExpr = extractSums(workExpr);
    while (innerExpr) {
        for (let match of innerExpr) {
            const res = resolveSimpleExpression(match);
            //console.log(match, res);
            workExpr = workExpr.replace(new RegExp(match.replace(/[^0-9\s]/g, '\\$&'), 'g'), res);
        }
        innerExpr = extractSums(workExpr);
    }
    return workExpr;
}

function resolveExpression(expr, advance) {
    let workExpr = expr;
    let innerExpr = extractInnerExpression(workExpr);
    //console.log('-------- new expression ---------');
    while (innerExpr) {
        //console.log(workExpr);
        for (let match of innerExpr) {
            const res = resolveSimpleExpression(match, advance);
            //console.log(match, res);
            workExpr = workExpr.replace(new RegExp(match.replace(/[^0-9\s]/g, '\\$&'), 'g'), res);
        }
        innerExpr = extractInnerExpression(workExpr);
    }
    //console.log(workExpr);
    const result = resolveSimpleExpression(workExpr, advance);
    //console.log('final result:', expr, result);
    return result;
}

fillData('input.txt')
.then(data => {
    
    const sumPart1 = data.reduce((sum, expr) => sum + parseInt(resolveExpression(expr)), 0);
    console.log(sumPart1);

    const sumPart2 = data.reduce((sum, expr) => sum + parseInt(resolveExpression(expr, true)), 0);
    console.log(sumPart2);
    
})
.catch(err => console.error(err));