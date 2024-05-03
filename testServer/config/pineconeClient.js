
// const { Pinecone } = require("@pinecone-database/pinecone");
// require('dotenv').config();

// const client = new Pinecone();

// let isInitialized = (async function() {
//     // initializing vector db client
//     await client.init({
//         apiKey: process.env.PINECONE_API_KEY,
//         environment: process.env.PINECONE_ENVIRONMENT,
//     });

//     // Return a resolved promise
//     return Promise.resolve();
// })(); 

// async function getClient() {
//     // Waits for the client to be initialized
//     await isInitialized;

//     // Now it's safe to return the client
//     return client;
// };

// module.exports = getClient;