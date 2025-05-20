const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/airtime-ussd-app', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    const input = text.split('*');

    switch (input.length) {
        case 1:
            if (text === '') {
                response = `CON Welcome to SwiftPass\n1. Buy Airtime\n2. My phone number`;
            } else if (text === '2') {
                response = `END Your phone number is ${phoneNumber}`;
            } else if (text === '1') {
                response = `CON Enter amount to buy (RWF):`;
            } else {
                response = `END Invalid option.`;
            }
            break;

        case 2:
            // text = '1*amount'
            if (input[0] === '1') {
                const amount = input[1];
                response = `CON Confirm purchase of RWF ${amount} airtime?\n1. Confirm\n2. Cancel`;
            } else {
                response = `END Invalid path.`;
            }
            break;

        case 3:
            // text = '1*amount*1' or '1*amount*2'
            const amount = input[1];
            if (input[0] === '1' && input[2] === '1') {
                response = `END You have successfully purchased RWF ${amount} airtime for ${phoneNumber}.`;
            } else if (input[0] === '1' && input[2] === '2') {
                response = `END Airtime purchase cancelled.`;
            } else {
                response = `END Invalid option.`;
            }
            break;

        default:
            response = `END Invalid input.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${3000}`);
});
