const EventEmitter = require('events');
const getClient = require('../config/pineconeClient');
require('dotenv').config();


async function renameChatbot(chatbot, user, name) {
    if (chatbot.name === '' || chatbot.name==='Untitled') {
        chatbot.name = name;
        await user.save();
    }
}
// if (chatbot.credits === -1){
//     res.send(JSON.stringify({sender: 'bot', body: 'You have run out of message credits, please upgrade your account to get more.'}));
//     return;
// }
async function deleteNamespaceVectors(chatbotId) {
    const targetIndex = process.env.PINECONE_INDEX;
    const client = await getClient();
    const pineconeIndex = client.Index(targetIndex);
    await pineconeIndex._delete({
        deleteRequest: {
            namespace: chatbotId,
            deleteAll: true,
        },
    });
}


const myEmitter = new EventEmitter();

module.exports = { deleteNamespaceVectors, renameChatbot, myEmitter}