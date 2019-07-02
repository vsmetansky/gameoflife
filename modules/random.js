export default class Random {
    static getRandomPairs(num, min, max, unique = true) {
        let pairs = [];
        if (unique) {
            while (num--) pairs.push(getUniquePair(pairs, min, max));
        } else {
            while (num--) pairs.push(getPair(pairs, min, max));
        }
        return pairs;
    }
}

function getUniquePair(arr, min, max) {
    do {
        var pair = getPair(arr, min, max);
    } while (pairIsPresent(arr, pair))
    return pair;
}

function getPair(arr, min, max) {
    return [getRand(min, max), getRand(min, max)];
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function pairIsPresent(arr, pair) {
    return !!arr.find(x => x[0] === pair[0] && x[1] === pair[1]);
}