import fs from 'fs';
import readline from 'readline';


String.prototype.replaceAt = function(index, char) {
    return this.substring(0, index) + char + this.substring(index + 1);
}
/*
This is a monster
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   
*/
const MONSTER = [[1], [2], [], [], [2], [1], [1], [2], [], [], [2], [1], [1], [2], [], [], [2], [1], [0,1], [1]];

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];

        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => {
            if (line.trim().length > 0) {
                if (line.includes('Tile')) {
                    data.push({
                        id: parseInt(line.split(' ')[1].replace(':', '')),
                        tile: []
                    });
                }
                else {
                    data[data.length - 1].tile.push(line);
                }
            }
        });
        readInterface.on('close', () => resolve(data));
    });
}

function defineBorders(tileObj) {
    const top = tileObj.tile[0];
    const bottom = tileObj.tile[tileObj.tile.length - 1];
    const left = tileObj.tile.map(line => line[0]).join('');
    const right = tileObj.tile.map(line => line[line.length - 1]).join('');
    return { ...tileObj, borderTop: top, borderBottom: bottom, borderLeft: left, borderRight: right };
}

function searchCorner(index, pieces) {
    let matchingPieces = [];
    const piece = pieces[index];
    for (let field in piece) {
        if (!field.includes('border')) {
            continue;
        }
        let border = piece[field];
        let borderFlip = border.split('').reverse().join('');
        for (let i = 0; i < pieces.length; i++) {
            const p = pieces[i];
            if (p.id !== piece.id) {
                for (let fp in p) {
                    if (!fp.includes('border')) {
                        continue;
                    }
                    const borderP = p[fp];
                    const borderPFlip = borderP.split('').reverse().join('');
                    if (border === borderP || border === borderPFlip
                        || borderFlip === borderP || borderFlip === borderPFlip) {
                        if (!matchingPieces.includes(p.id)) {
                            matchingPieces.push(p.id);
                        }
                    }
                }
            }
        }
    }
    pieces[index] = { ...piece, match: matchingPieces };
    //console.log(piece.id, 'matcha con', matchingPieces, matchingPieces.length <= 2 && 'CORNER!!');
    if (matchingPieces.length <= 2) {
        return piece.id;
    }
    return 1;
}

function buildBorder(id, borderPieces) {
    const piece = borderPieces.filter(el => el.id === id)[0];
    const border = [piece];
    borderPieces.splice(borderPieces.indexOf(piece), 1);
    const nextPiece = borderPieces.filter(el => el.match.includes(piece.id));
    //console.log('build border', piece.id, piece.match, nextPiece.map(el => el.id));
    if (nextPiece.length > 0 && piece.match.length > 2) {
        border.push(...buildBorder(nextPiece[0].id, borderPieces));
    }
    return border;
}

function buildCenter(puzzle, piecesToPlace) {
    for (let i = 1; i < puzzle.length; i++) {
        for (let j = 1; j < puzzle[0].length; j++) {
            const piece = piecesToPlace.filter(el => {
                return el.match.includes(puzzle[i - 1][j].id)
                    && el.match.includes(puzzle[i][j - 1].id);
            })[0];
            puzzle[i][j] = piece;
            piecesToPlace.splice(piecesToPlace.indexOf(piece), 1);
        }
    }
}

function buildBorders(puzzle, piecesToPlace) {
    // put first corner in the puzzle
    const corner = piecesToPlace[0];
    puzzle.push([corner]);
    piecesToPlace.splice(piecesToPlace.indexOf(corner), 1);
    //console.log('CORNER', corner.match);
    //console.log('BORDER 1');
    const border1 = buildBorder(corner.match[0], piecesToPlace.filter(el => el.match.length <= 3));
    border1.forEach(el => {
        puzzle[0].push(el);
        piecesToPlace.splice(piecesToPlace.indexOf(el), 1);
    });
    //console.log('BORDER 2');
    const border2 = buildBorder(corner.match[1], piecesToPlace.filter(el => el.match.length <= 3));
    border2.forEach(el => {
        const row = new Array(puzzle[0].length).fill(null);
        row[0] = el;
        puzzle.push(row);
        piecesToPlace.splice(piecesToPlace.indexOf(el), 1);
    });
}

function putTileInImage(image, tile) {
    // exclude borders
    const tileWithoutBorders = [];
    for (let i=1; i<tile.length-1; i++) {
        tileWithoutBorders.push(tile[i].substring(1, tile[i].length-1));
    }
    for (let i = 0; i < tileWithoutBorders.length; i++) {
        if (i === image.length) {
            image.push(tileWithoutBorders[i]);
        }
        else {
            image[i] += tileWithoutBorders[i];
        }
    }
}

function flipTile(piece) {
    const tileFlipped = flipImage(piece.tile);
    return defineBorders({ ...piece, tile: tileFlipped });
}

function flipImage(image) {
    return image.map(row => row.split('').reverse().join(''));
}

function rotateTile(piece) {
    const rotatedTile = rotateImage(piece.tile);
    return defineBorders({ ...piece, tile: rotatedTile });
}

function rotateImage(image) {
    const matrix = image.map(el => el.split(''));
    const rotatedMatrix = matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
    return rotatedMatrix.map(el => el.join(''));
}

function elaboratePieceToMatchBorder(piece, borderToMatch, field) {
    let match = false;
    //console.log('elaborate', piece.id, borderToMatch);
    while(!match) {
        const flippedBorder = piece[field].split('').reverse().join('');
        //console.log('checking', piece[field], borderToMatch);
        //piece.tile.forEach(el => console.log(el));
        if (piece[field] === borderToMatch) {
            match = true;
        }
        else if (flippedBorder === borderToMatch) {
            piece = flipTile(piece);
        }
        else {
            piece = rotateTile(piece);    
        }
    }
    return piece;
}

function flipAndRotate180(piece) {
    let result = flipTile(piece);
    result = rotateTile(result);
    result = rotateTile(result);
    return result;
}

function buildImage(puzzle) {
    const image = [];

    // first of all I need to orient the first corner based on match with its neighbors
    let corner = puzzle[0][0];
    let pieceRight = puzzle[0][1];
    let pieceUnder = puzzle[1][0];

    // I want to have corner right border matching pieceRight left border.
    let oriented = false;
    while (!oriented) {
        const flippedBorderRight = corner.borderRight.split('').reverse().join('');
        for (let field in pieceRight) {
            if (field.includes('border')) {
                if (corner.borderRight === pieceRight[field]) {
                    oriented = true;
                }
                else if (flippedBorderRight === pieceRight[field]) {
                    puzzle[0][0] = flipAndRotate180(corner);
                    corner = puzzle[0][0];
                    
                    // check if also the bottom border match with the piece under
                    let reallyOriented = false;
                    pieceUnder = puzzle[1][0];
                    for (let i=0; i<4; i++) {
                        if (field.includes('border')) {
                            const flippedBorder = pieceUnder.borderTop.split('').reverse().join('');
                            if (corner.borderBottom === pieceUnder.borderTop) {
                                reallyOriented = true;
                            } else if (corner.borderBottom === flippedBorder) {
                                // flip the piece under
                                puzzle[1][0] = flipTile(pieceUnder);
                                reallyOriented = true;
                            }
                            if (!reallyOriented) {
                                puzzle[1][0] = rotateTile(puzzle[1][0]);
                                pieceUnder = puzzle[1][0];
                            }
                        }
                    }
                    if (!reallyOriented) {
                        // flip back the corner, and flip pieceRight, than check again
                        puzzle[0][0] = flipTile(puzzle[0][0]);
                        puzzle[0][1] = flipTile(puzzle[0][1]);
                        oriented = false;
                    }
                    else {
                        oriented = true;
                    }
                }
            }
        }
        if (!oriented) {
            puzzle[0][0] = rotateTile(corner);
        }
        corner = puzzle[0][0];
        pieceRight = puzzle[0][1];
        pieceUnder = puzzle[1][0];
    }

    // now check if this orientation of corner is ok, checking if bottom border match with the piece under the corner.

    let imageBand = [];
    putTileInImage(imageBand, corner.tile);
    
    let i = 0;
    let j = 1;
    
    while (i<puzzle.length) {
        while (j<puzzle[0].length) {
            // check each puzzle element to match border with piece left and piece above
            const pieceLeft = j > 0 ? puzzle[i][j-1] : null;
            const pieceAbove = i > 0 ? puzzle[i-1][j] : null;
            if (pieceLeft !== null) {
                puzzle[i][j] = elaboratePieceToMatchBorder(puzzle[i][j], pieceLeft.borderRight, 'borderLeft');
            }
            if (pieceAbove !== null) {
                if (pieceLeft !== null) {
                    if (puzzle[i][j].borderTop !== pieceAbove.borderBottom) {
                        throw "ERROR! Piece NOT matching all borders!";
                    }
                }
                else {
                    puzzle[i][j] = elaboratePieceToMatchBorder(puzzle[i][j], pieceAbove.borderBottom, 'borderTop');
                }
            }
            putTileInImage(imageBand, puzzle[i][j].tile);
            j += 1
        }
        j = 0;
        i += 1;
        image.push(...imageBand);
        imageBand = [];
    }
    

    return image;
}

function searchMonsters(image) {
    let monsters = 0;
    for (let i=0; i<image.length-2; i++) {
        for (let j=0; j<image[i].length-MONSTER.length; j++) {
            let monsterMatch = true;
            const imageTemp = image.map(l => l.split(''));
            for (let mj=0; mj<MONSTER.length && monsterMatch; mj++) {
                const monsterPart = MONSTER[mj];
                for (let mk=0; mk<monsterPart.length && monsterMatch; mk++) {
                    const posSum = monsterPart[mk];
                    if (imageTemp[i+posSum][j+mj] !== '#') {
                        monsterMatch = false;
                    }
                    else {
                        imageTemp[i+posSum][j+mj] = 'O';
                        //console.log('MATCH FOUND AT', i+posSum, j+mj);
                    }
                }
            }
            if (monsterMatch) {
                monsters += 1;
                //console.log('NEW MONSTER FOUND');
                //console.log(imageTemp[i].join(''));
                //console.log(imageTemp[i+1].join(''));
                //console.log(imageTemp[i+2].join(''));
                image = imageTemp.map(l => l.join(''));
                //break;
            }
            //if (j === 43) throw new 'STOP';
        }
    }
    return {count: monsters, image: image};
}

function solvePuzzle(pieces) {
    const puzzle = [];
    let piecesToPlace = [...pieces];
    buildBorders(puzzle, piecesToPlace);
    buildCenter(puzzle, piecesToPlace);
    //puzzle.forEach(el => console.log(el.map(obj => obj ? obj.id : 'null').join(' ')));

    let image = buildImage(puzzle);

    let monsters = 0;
    let imageWithMonsters;
    let forceStop = 0;
    while (monsters === 0 && forceStop <4) {
        let res = searchMonsters(image);
        if(res.count === 0) {
            let flippedImage = flipImage(image);
            monsters = searchMonsters(flippedImage);
        }
        if (res.count === 0) {
            image = rotateImage(image);
        }

        monsters = res.count;
        imageWithMonsters = res.image;
        forceStop += 1;
    }

    imageWithMonsters.forEach(l => console.log(l));
    console.log();
    console.log('NUMBER OF MONSTERS:', monsters);
    console.log('NUMBER OF #:', imageWithMonsters.reduce((sum, line) => sum + (line.match(/#/g) || []).length, 0));
    console.log('double check', imageWithMonsters.reduce((str, line) => str += line.replace(/[\.O]/g, ''), '').length);

}

fillData('input_sabri.txt')
    .then(data => {
        const dataFull = [];
        for (let tileObj of data) {
            dataFull.push(defineBorders(tileObj));
        }
        //console.log(dataFull);
        let cornerProduct = 1;
        for (let i = 0; i < dataFull.length; i++) {
            cornerProduct *= searchCorner(i, dataFull);
        }
        console.log('corner product', cornerProduct);

        dataFull.sort((a, b) => a.match.length - b.match.length);
        //dataFull.filter(el => el.match.length <= 3).forEach(piece => console.log(piece.id, 'matcha con', piece.match));
        solvePuzzle(dataFull);
    })
    .catch(err => console.log(err));