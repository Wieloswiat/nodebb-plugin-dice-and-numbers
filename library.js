
"use strict";
const RandomNumber = require('random-number');
const Roll = require('roll');
const dice = new Roll();

const composerFormatting = (data, callback) => {
    data.options.push({
        name: 'diceroller',
        className: 'fas fa-dice',
        title: 'Dice roller/Number generator'
    });
    callback(null, data);
};
module.exports.composerFormatting = composerFormatting;

const parsePost = (data, callback) => {
    if (data.postData.randomNumber) {
        data.postData.content = `${data.postData.content} <br> <div class="dice-results"><div class="individual">Generating ${data.postData.randomNumber.amount} random number${data.postData.randomNumber.amount > 1 ? 's' : ''} from ${data.postData.randomNumber.min} to ${data.postData.randomNumber.max}:  [${data.postData.randomNumber.result}]</div> <div class="total">Total:${data.postData.randomNumber.total}</div></div>`;
    }
    if (data.postData.diceRoll) {
        data.postData.content = `${data.postData.content} <br> <div class="random-results"><div class="individual">Rolling ${data.postData.diceRoll.query} dice: [${data.postData.diceRoll.rolled}]</div> <div class="total">Total:${data.postData.diceRoll.result}</div></div>`;
    }
    callback(null, data);
};
module.exports.parsePost = parsePost;

var posts = module.parent.require('./posts');

const buildComposer = async (data, callback) => {
    var req = data.req;
    if (req && req.query.pid) {
        let postData;
        await posts.getPostData(req.query.pid, (e, p) => {e ? console.log(e) : postData = p});
        data.templateData = {...data.templateData, randomNumber: postData.randomNumber, diceRoll: postData.diceRoll};
    }
    callback(null, data);
}
module.exports.buildComposer = buildComposer;

var Numbers = {
    random: function (amount, min, max) {
        const numbers = [];
        const settings = {min: parseInt(min), max: parseInt(max), integer: true}
        console.log(JSON.stringify(settings))
        for (var i = 0; i < amount; i++) {
            numbers.push(RandomNumber(settings))
        }
        return numbers;
    },
    roll: function (query) {
        const diceRoll = dice.roll(query);
        return { query, rolled: diceRoll.rolled, result: diceRoll.result };
    }
};

const generateNumbers = (data, callback) => {
    if (data.data.diceRoll && data.post) {
        data.post.diceRoll = Numbers.roll(data.data.diceRoll);
    }
    if (data.data.randomNumber && data.post) {
        const randomNumber = {
            amount: data.data.randomNumber[0],
            min: data.data.randomNumber[1],
            max: data.data.randomNumber[2]
        };
        const result = Numbers.random(randomNumber.amount, randomNumber.min, randomNumber.max);
        const total = result.reduce((a, b) => a + b, 0);
        data.post.randomNumber = { ...randomNumber, result: result.join(', '), total};
    }
    callback(null, data);
};

module.exports.generateNumbers = generateNumbers;


