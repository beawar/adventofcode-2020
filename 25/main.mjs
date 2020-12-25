
function main(cardPublicKey, doorPublicKey) {
    let cardLoopSize = 1;
    let doorLoopSize = 1;
    let cardSubject = 7;
    let doorSubject = 7;
    let cardTempKey = cardSubject;
    let doorTempKey = doorSubject;
    
    while (cardTempKey !== cardPublicKey || doorTempKey !== doorPublicKey) {
        if (cardTempKey !== cardPublicKey) {
            cardTempKey = cardTempKey * cardSubject;
            cardTempKey = cardTempKey % 20201227;
            cardLoopSize += 1;
            //console.log(cardLoopSize, 'card temp key', cardTempKey);
        }
        if (doorTempKey !== doorPublicKey) {
            doorTempKey = doorTempKey * doorSubject;
            doorTempKey = doorTempKey % 20201227;
            doorLoopSize += 1;
            //console.log(doorLoopSize, 'door temp key', doorTempKey);
        }
    }

    console.log('card loop', cardLoopSize, 'door loop', doorLoopSize);

    let cardEncryptionKey = cardPublicKey;
    let doorEncryptionKey = doorPublicKey;
    let cardTempLoop = 1;
    let doorTempLoop = 1;

    while (cardTempLoop !== cardLoopSize || doorTempLoop != doorLoopSize) {
        if (cardTempLoop !== cardLoopSize) {
            doorEncryptionKey = doorEncryptionKey * doorPublicKey;
            doorEncryptionKey = doorEncryptionKey % 20201227;
            cardTempLoop += 1;
        }
        if (doorTempLoop != doorLoopSize) {
            cardEncryptionKey = cardEncryptionKey * cardPublicKey;
            cardEncryptionKey = cardEncryptionKey % 20201227;
            doorTempLoop += 1;
        }
    }

    console.log('card encryption', cardEncryptionKey, 'door encryption', doorEncryptionKey);
}

//main(5764801, 17807724);
main(15335876, 15086442)