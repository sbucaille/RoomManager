let express = require('express');
let router = express.Router();

const path = require('path');
const GoogleAssistant = require('google-assistant');
const config = {
    auth: {
        keyFilePath: path.resolve(__dirname, 'authGoogleAssistant.json'),
        savedTokensPath: path.resolve(__dirname, 'tokens.json'), // where you want the tokens to be saved
    },
    conversation: {
        lang: 'en-US', // defaults to en-US, but try other ones, it's fun!
    },
};

const startConversation = (conversation) => {
    // setup the conversation
    conversation
        .on('response', text => console.log('Assistant Response:', text))
        // if we've requested a volume level change, get the percentage of the new level
        .on('volume-percent', percent => console.log('New Volume Percent:', percent))
        // the device needs to complete an action
        .on('device-action', action => console.log('Device Action:', action))
        // once the conversation is ended, see if we need to follow up
        .on('ended', (error, continueConversation) => {
            if (error) {
                console.log('Conversation Ended Error:', error);
            } else if (continueConversation) {
                inputFunction();
            } else {
                console.log('Conversation Complete');
                conversation.end();
            }
        })
        // catch any errors
        .on('error', (error) => {
            console.log('Conversation Error:', error);
        });
};

const inputFunction = (textQuery) => {
    config.conversation.textQuery = textQuery;
    assistant.start(config.conversation, startConversation);
}

const assistant = new GoogleAssistant(config.auth);
assistant
    .on('ready', inputFunction)
    .on('error', (error) => {
        console.log('Assistant Error:', error);
    });


router.get('/test', function (req, res, next) {
    console.log(req);
    inputFunction("switch on the lights");
    res.sendStatus(200);
})


module.exports = router;