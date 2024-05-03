const router = require('express').Router();
const chatbotDefaultConfig = require('../config/constants');
const { User } = require('../models/database');

const { deleteNamespaceVectors } = require('../helper/utils.js');
const { replyToMessage } = require('../helper/message.js');
require('dotenv').config();


router.get('/', (req, res) => { res.send('My baby lives on!') });


// Get requests:


router.get('/embedInfo/:id', async (req, res) => {
    //Decides if the bot can be embedded or not
    try {
        const user = await User.findOne({ 'chatBots._id': req.params.id }, { 'chatBots.data': 0 });
        const chatbot = await user.chatBots.id(req.params.id);
        res.status(200).send({ allowed: chatbot.publicAccess, credits: chatbot.credits });
    }
    catch (error) {
        console.log(`${error} error in publicAccess route in routes.js`);
        res.status(400).send({ allowed: false, credits: chatbot.credits });
    }

})

// Post Requests:


router.post('/start/:id', async (req, res) => {
    //add validation logic here
    try {
        const user = await User.findOne({ 'chatBots._id': req.params.id }, { 'chatBots.data': 0 })
        const chatbot = await user.chatBots.id(req.params.id);
        res.send({ message: { sender: 'bot', body: chatbot.initialMessage }, credits: chatbot.credits });
    }
    catch (error) {
        console.log(error, 'error in start route')
        res.send({ message: { sender: 'bot', body: 'Something went wrong' }, credits: -1 });
    }
});

router.post('/message/:id', async (req, res) => {
    // let conversationId, conversation, user;
    let user = await User.findOne({ 'chatBots._id': req.params.id }, { 'chatBots.data': 0 });
    const message = await replyToMessage(user, req.params.id, req.body.conversationId, req.body);

    res.send(JSON.stringify(message));
    try {
        await user.save();
    }
    catch (error) {
        console.log(error, ' error saving conversation');
    }
});



router.delete('/deleteBot/:chatbotId', async (req, res) => {
    try {
        const chatbotId = req.params.chatbotId;
        const user = await User.findOne({
            'chatBots._id': chatbotId,
        });
        const returnPath = req.user.type === 'agency' ? 'agency/Dashboard' : '/Dashboard'
        //delete namespace
        deleteNamespaceVectors(chatbotId);

        //delete from mongodb
        user.chatBots = user.chatBots.filter(bot => bot._id.toString() !== chatbotId);
        await user.save();

        //navigate front-end to mychatbots
        res.status(200).send(JSON.stringify({ path: returnPath }));
    } catch (err) {
        console.log(err, 'Error in deleteBot route');
    }
});


router.post('/conversationHistory', async (req, res) => {

    try {
        const id = req.body.conversationId;
        const chatbotId = req.body.chatbotId
        const user = await User.findOne({
            'chatBots._id': req.body.chatbotId
        }, { 'chatBots.data': 0 })
        const conversation = user.chatBots.id(chatbotId).conversationHistory.id(id);
        res.send(conversation.conversation)
    }
    catch (error) {
        console.log(error)
    }

});


router.get('/new-chatbot', async (req, res) => {
    if (req.user !== undefined) {
        const userId = req.user.id;
        try {
            const user = await User.findById(userId, { 'chatBots.data': 0 });
            user.chatBots.push(chatbotDefaultConfig);
            // Save the updated user document and get updated document
            const updatedUser = await user.save();

            // Get the ID of the newly inserted bot
            const newBotId = updatedUser.chatBots[updatedUser.chatBots.length - 1]._id;

            res.send(JSON.stringify({ link: '/new/sources/files/' + newBotId, newBotId: newBotId }));

        }
        catch {
            err => console.log('error in /new-chatbot: ', err)
        }
    }
});


router.get('/my-chatbots', (req, res) => {
    try {
        if (req.user !== undefined) {
            const userId = req.user.id;
            User.findById(userId, { 'chatBots.data': 0 }).then((user) => {
                if (user) {
                    res.status(200).send(JSON.stringify({ chatBots: user.chatBots, allowedChatbots: user.allowedChatbots !== undefined ? user.allowedChatbots : 1 }));
                }
            }).catch(err => {
                console.log('err in my-chatbots: ', err)
                res.status(400).send({ message: 'Error fetching my chatbots' })
            });
        }else{
        res.status(400).send({ message: 'You need to sign in before you can view this page.' });
        }
    }
    catch (error) {
        console.log(error, ' error in my-chatbots route')
        res.status(400).send({ message: 'Error fetching my chatbots' })
    }
});




router.get('/my-account', async (req, res) => {
    try {

        if (req.isAuthenticated()) {
            const userId = req.user.id;
            const user = await User.findById(userId, { chatBots: 0 });
            res.status(200).send(JSON.stringify({
                email: user.email,
                totalConversations: user.totalConversations,
                usedConversations: user.usedConversations,
                name: user.name,
                plan: user.plan,
            }));
        }
        else {
            res.status(401).send({ message: 'Not Authorized' });
        }

    }
    catch (error) {
        console.log(error, 'error retrieving user details');
        res.status(400).send({ 'message': 'error' })
    }
});


module.exports = { router };