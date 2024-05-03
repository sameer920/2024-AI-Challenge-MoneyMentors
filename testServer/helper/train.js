
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");
const { PineconeStore } = require("@langchain/pinecone");
const { Pinecone } = require("@pinecone-database/pinecone");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { TaskType } = require('@google/generative-ai');
const { User } = require("../models/database");


const client = new Pinecone();


async function saveDocument(docs, name, chatbot, user, filetype) {
    let data = '';
    docs.forEach(doc => data += doc.pageContent);
    const newChars = data.length;
    const file = {
        filename: name,
        data: data,
        type: filetype,
        length: newChars
    }
    chatbot.totalChars += newChars;
    chatbot.data.files.push(file);
    // return user.save();
}



async function split(docs) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 100,
    });
    const docOutput = await splitter.splitDocuments([
        docs,
    ]);
    // console.log(docOutput)
    return docOutput;
}

async function processDocuments(processedDocs, doc, name) {
    const docOutput = await split(doc)
    docOutput.forEach(doc => {
        doc.pageContent = doc.pageContent.replace(/\n/g, ' ');
        doc.metadata = {}
        doc.metadata.name = name;
        // console.log(doc)
        processedDocs.push(doc)

    });
}

async function createAndStoreEmbeddings(docs, namespace) {
    try {

        const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
        await PineconeStore.fromDocuments(docs, new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_GENAI_KEY, model: "embedding-001", // 768 dimensions
            taskType: TaskType.RETRIEVAL_DOCUMENT,
        }), {
            pineconeIndex,
            namespace
        });
    } catch (error) {
        console.log(error, ' error while creating embeddings');
    }
}

function findTrainedData(chatbot) {
    const fileTypes = ['file', 'link', 'QA'];

    const foundFiles = fileTypes.map(type =>
        chatbot.data.files.filter(file => file.type === type)
    )
    let files = [];

    for (i = 0; i < foundFiles.length; i++) {
        files.push(foundFiles[i].length);
    }
    // console.log((files[0] > 0 && `${files[0]} Files | `))
    let infoString = [`${chatbot.totalChars} Characters`];
    const temp = (files[0] > 0 ? `${files[0]} Files` : "") +
        (files[0] > 0 && files[1] > 0 ? ' | ' : '') +
        (files[1] > 0 ? `${files[1]} Links ` : "") +
        ((files[0] > 0 || files[1] > 0) && files[2] > 0 ? ' | ' : '') +
        (files[2] > 0 ? `${files[2]} Questions` : "");
    if (temp !== 0) {
        infoString.push(temp);
    }
    return infoString;

}

async function deleteDocuments(chatbotId, itemId, chatbot) {

    if (chatbot.data && chatbot.data.files.length > 0) {
        const fileToRemove = chatbot.data.files.filter(file => file.id === itemId)[0];
        chatbot.data.files = chatbot.data.files.filter(file => file.id !== itemId);
        chatbot.totalChars -= fileToRemove.data.length;


        //delete from index
        // const index = client.Index(process.env.PINECONE_INDEX);

        // await index.namespace(chatbotId).deleteMany({
        //     name:  fileToRemove.filename

        // });

        await User.updateOne(
            { 'chatBots._id': chatbotId },
            {
                $pull: { 'chatBots.$.data.files': { _id: itemId } },
                $inc: { 'chatBots.$.totalChars': -(fileToRemove.data.length) }
            }
        );
    }
}

module.exports = { deleteDocuments, findTrainedData, createAndStoreEmbeddings, processDocuments, split, saveDocument }