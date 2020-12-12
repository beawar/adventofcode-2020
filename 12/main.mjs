import fs from 'fs';
import readline from 'readline';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const readInterface = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        readInterface.on('line', line => data.push({action: line[0], value: parseInt(line.substr(1))}));
        readInterface.on('close', () => resolve(data));
    });
}

fillData('input.txt')
.then(data => {
    // coordinates contains current position in the cartesian system
    const coordinates = {x: 0, y: 0};
    // starting direction is east
    let axis = 'x';
    let axisDirection = 1;
    for (let el of data) {
        let currentMoveAxis = axis;
        let currentMoveAxisDirection = axisDirection;
        let currentMoving = true;
        // move actions changes only this this move, not the 
        if (el.action === 'N' || el.action === 'E') {
            currentMoveAxisDirection = 1;
            if (el.action === 'N') {
                currentMoveAxis = 'y'
            }
            else {
                currentMoveAxis = 'x';
            }
        }
        else if (el.action === 'S' || el.action === 'W') {
            currentMoveAxisDirection = -1;
            if (el.action === 'S') {
                currentMoveAxis = 'y'
            }
            else {
                currentMoveAxis = 'x';
            }
        }
        // turn actions do not produce a movement, they just change global axis and direction
        else if (el.action === 'R') {
            currentMoving = false;
            if (el.value === 90) {
                if (axis === 'x') {
                    axis = 'y';
                    axisDirection = axisDirection * (-1);
                }
                else {
                    axis = 'x';
                }
            }
            else if (el.value === 180) {
                axisDirection = axisDirection * (-1);
            }
            else if (el.value === 270) {
                if (axis === 'y') {
                    axis = 'x';
                    axisDirection = axisDirection * (-1);
                }
                else {
                    axis = 'y';
                }
            }
        }
        else if (el.action === 'L') {
            currentMoving = false;
            if (el.value === 90) {
                if (axis === 'y') {
                    axis = 'x';
                    axisDirection = axisDirection * (-1);
                }
                else {
                    axis = 'y';
                }
            }
            else if (el.value === 180) {
                axisDirection = axisDirection * (-1);
            }
            else if (el.value === 270) {
                if (axis === 'x') {
                    axis = 'y';
                    axisDirection = axisDirection * (-1);
                }
                else {
                    axis = 'x';
                }
            }
        }

        // now that I know where I should move, I can add the value of the action to the current position
        if (currentMoving) {
            coordinates[currentMoveAxis] = coordinates[currentMoveAxis] + (currentMoveAxisDirection * el.value);
        }
        //console.log(el, coordinates);
    }

    console.log(coordinates.x, coordinates.y, Math.abs(coordinates.x) + Math.abs(coordinates.y));

})
.catch(err => console.log(err));