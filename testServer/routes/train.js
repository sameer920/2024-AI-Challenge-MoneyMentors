const router = require('express').Router();
const passport = require('passport');
const { User } = require('../models/database');
const upload = require('../helper/upload')
const PDFLoader = require("langchain/document_loaders/fs/pdf").PDFLoader;
const fs = require('fs');
const { Document } = require('langchain/document');
const { renameChatbot } = require('../helper/utils.js');
const { deleteDocuments, processDocuments, createAndStoreEmbeddings, saveDocument, findTrainedData } = require('../helper/train.js');


require('dotenv').config();




//--------------------------------------------------Files:--------------------------------------------------------------------

router.post('/files', upload.array('file'), async function (req, res) {
    try {
        let user = await User.findOne({ 'chatBots._id': req.body.id })
        let chatbot = await user.chatBots.id(req.body.id);

        if (!req.files) {
            return res.status(400).send({ response: 'No files uploaded' });
        }


        for (let file of req.files) {
            let processedDocs = []
            let docs;
            const loader = new PDFLoader(file.path);
            docs = await loader.load();
            let keys = Object.keys(docs) //keys to docs object. the keys are made based on the number of pages in the document.

            for (let i = 0; i < keys.length; i++) {
                await processDocuments(processedDocs, docs[keys[i]], file.originalname);
            }

            await createAndStoreEmbeddings(processedDocs, req.body.id);
            saveDocument(processedDocs, processedDocs[0].metadata.name ? processedDocs[0].metadata.name : file.filename, chatbot, user, 'file');

            // Use fs.unlink() to delete the file
            fs.unlink(file.path, err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('File deleted successfully');
                }
            });
        }

        await user.save()
        renameChatbot(chatbot, user, req.files[0].originalname);
        res.status(200).send({ response: 'Files uploaded and processed successfully' });

    }
    catch (error) {
        console.log(error, ' error while uploading file');
        res.status(400).send({ response: 'Error while uploading files' });
    }
});


router.get('/files/:id', async (req, res) => {
    try {
        const user = await User.findOne({ 'chatBots._id': req.params.id });
        const chatbot = await user.chatBots.id(req.params.id);

        if (chatbot.data.files !== undefined) {
            const files = chatbot.data.files.filter(file => file.type === 'file');
            let fileNames = [];
            if (files.length !== 0) {
                files.map(file => fileNames.push(
                    {
                        name: file.filename,
                        id: file._id,
                        chars: file.length,
                        status: 'trained',
                        data: file.data.slice(0, 500)
                    }
                ));
            }
            const trainedData = findTrainedData(chatbot);
            res.send({ 'files': fileNames, 'trainedData': trainedData });
        }
    }
    catch (error) {
        res.status(400).send({ files: [] });
    }
});

router.delete('/file', async (req, res) => {
    try {

        const { chatbotId, itemId } = req.query;
        //Find user and chatbot
        let user = await User.findOne({ 'chatBots._id': chatbotId });
        let chatbot = await user.chatBots.id(chatbotId);
        await deleteDocuments(chatbotId, itemId, chatbot);
        res.status(200).send({ response: 'done' });

    }
    catch (error) {
        console.log(`${error} error in delete file route (train file)`);
        res.status(500).send({ response: 'error' });
    }

});


//---------------------------------------------TEXT-----------------------------------------------


router.post('/text', async (req, res) => {
    try {
        const chatbotId = req.body.chatbotId;
        const user = await User.findOne({ 'chatBots._id': chatbotId })
        const chatbot = await user.chatBots.id(chatbotId);

        data = new Document({
            metadata: { name: 'text' },
            pageContent: req.body.trainText,
        });



        if (chatbot.data && chatbot.data.files) {

            const fileToRemove = chatbot.data.files.filter(file => file.filename === 'text')[0];
            //delete old vectors from db here
            if (fileToRemove) {
                await deleteDocuments(chatbotId, fileToRemove.id, chatbot);
            }
        }


        let processedDocs = [];
        await processDocuments(processedDocs, data, 'text');
        await createAndStoreEmbeddings(processedDocs, chatbotId);

        saveDocument(processedDocs, 'text', chatbot, user, 'text');
        await user.save()

        res.status(200).send(JSON.stringify({ response: 'success' }));
    }
    catch (error) {
        console.log(`${error} \nError in post text route`);
        res.status(400).send({ response: 'Error' });
    }
});

router.get('/text/:id', async (req, res) => {

    try {
        const user = await User.findOne({ 'chatBots._id': req.params.id });
        const chatbot = await user.chatBots.id(req.params.id);

        let data = '';
        const textFile = chatbot.data.files.filter(file => file.type === 'text');
        if (textFile.length !== 0) {
            data = textFile[0].data;
        }
        const trainedData = findTrainedData(chatbot);
        res.send({ 'data': data, trainedData: trainedData });
    }
    catch (error) {
        console.log(`${error} \nError in getting text`);
        res.send({ 'data': '' });
    }
})

module.exports = router