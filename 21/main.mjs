import fs from 'fs';
import readline from 'readline';
import lodash from 'lodash';

function fillData(file) {
    return new Promise((resolve, reject) => {
        const data = [];
        const ri = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        ri.on('line', line => data.push(line));
        ri.on('close', () => resolve(data));
    });
}

fillData('input.txt')
    .then(data => {
        // array of all ingredients (not distinct)
        const ingredients = [];
        // map of allergenes. Each allergene is an object with field 
        // - count: number of occurences required to an ingredient to possibly contain the allergene
        // - ingredients: all ingredients of foods that contain the allergene
        const allergens = data.reduce((allergensMap, food) => {
            let ingredientsArr = food.substring(0, food.indexOf('(')).trim().split(' ');
            ingredients.push(...ingredientsArr);
            let allergensArr = food.substring(food.indexOf('(')).replace(/[\(\)]/g, '').replace('contains', '').split(',');
            for (let allergene of allergensArr) {
                allergene = allergene.trim();
                if (!allergensMap.hasOwnProperty(allergene)) {
                    allergensMap[allergene] = { ingredients: [], count: 0 };
                }
                allergensMap[allergene].ingredients.push(...ingredientsArr);
                allergensMap[allergene].count += 1;
            }
            return allergensMap;
        }, {});

        let ingredientsUnique = lodash.uniq(ingredients);

        // contains all ingredients that can't possibly contain any of the allergens and the count of global occurencies
        const ingredientsWithoutAllergene = [];
        for (let ingredient of ingredientsUnique) {
            let validAllergeneFound = false;
            for (let allergene in allergens) {
                let occurencies = allergens[allergene].ingredients.filter(i => i === ingredient).length
                //console.log('CHECKING INGREDIENT', ingredient, 'FOR ALLERGENE', allergene, occurencies);
                if (occurencies === allergens[allergene].count) {
                    validAllergeneFound = true;
                }
            }
            if (!validAllergeneFound) {
                ingredientsWithoutAllergene.push(ingredient);
            }
        }

        //console.log(ingredientsWithoutAllergene);

        console.log(lodash.filter(ingredients, i => ingredientsWithoutAllergene.includes(i)).length);


        // PART 2
        let result = [];
        let allergensTemp = { ...allergens };
        while (Object.keys(allergensTemp).length > 0) {
            for (let allergene in allergensTemp) {
                let ingrCount = lodash.map(lodash.countBy(allergensTemp[allergene].ingredients), (count, key) => ({ ingredient: key, count: count }));
                ingrCount = lodash.filter(ingrCount, obj => obj.count === allergensTemp[allergene].count)
                //console.log(allergene, allergensTemp[allergene].count, ingrCount)
                if (ingrCount.length === 1) {
                    delete allergensTemp[allergene];
                    const ingredient = ingrCount[0].ingredient;
                    lodash.forEach(allergensTemp, allergene => lodash.remove(allergene.ingredients, ingr => ingr === ingredient));
                    result.push({ ingredient: ingredient, allergene: allergene });
                    //console.log('FOUND', ingredient, allergene);
                }
            }
        }
        console.log(result);

        result = lodash.sortBy(result, 'allergene');
        console.log(lodash.reduce(result, (arr, obj) => {
            arr.push(obj.ingredient);
            return arr;
        }, []).join(','));

    })
    .catch(err => console.error(err));