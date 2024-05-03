const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { HuggingFaceInference } = require("@langchain/community/llms/hf");
const { Pinecone } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("@langchain/pinecone");
const { RetrievalQAChain } = require("langchain/chains");
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");
const { RunnableSequence, RunnablePassthrough } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers")
const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const {TaskType} = require('@google/generative-ai')

const client = new Pinecone();
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

async function getVectorStore() {
    const vectorStore = await PineconeStore.fromExistingIndex(new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_GENAI_KEY, 
        model: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
    }), {
        pineconeIndex
    });

    return vectorStore;
}

function createPrompt(chatbot) {
    const promptTemplate = `Your are a helpful assistant that is meant to teach people the basics of personal finance. You would provide answers based on the given information.
    However, if you have enough information in your knowledge bank to answer it, than you can, but make sure you aren't making any financial recommendations. For example, if someone asks you which stocks to buy
    you wouldn't recommend a stock, but you are allowed to tell them what to look for a stock. But be careful, don't provide any formulas unless you can base them from the given information.
    If you are asked about taxes and you can generate the answer based on the given information. Just returm the percentages. Also return where you're basing this answer from, not the filename,
     but the actual text you are basing this from. Also note all the tax related information being passed to you is coming from finance act 2023
    so you'd need to quote that too. Don't mention handbook just say finance act 2023. Use a friendly and helpful tone. You are allowed to ask followup questions too, where necessary.
    information: {context}
    
    User Question: {question}`
    const prompt = ChatPromptTemplate.fromTemplate(promptTemplate);
    return prompt;
}

function createChain(chatbot, model) {
    prompt = createPrompt(chatbot)
    const chain = RunnableSequence.from([
        {
            context: async (input, config) => {
                if (!config || !("configurable" in config)) {
                    throw new Error("No config");
                }
                const { configurable } = config;
                const vectorStore = await getVectorStore()
                return JSON.stringify(
                    await vectorStore.asRetriever(configurable).invoke(input)
                );
            },
            question: new RunnablePassthrough(),
        },
        prompt,
        model,

        new StringOutputParser(),
    ]);
    return chain;
}

async function replyToMessage(user, chatbotId, conversationId, requestBody) {
    let conversation
    try {
        let messageBody
        // user = await User.findOne({ 'chatBots._id': chatbotId }, { 'chatBots.data': 0 })
        let chatbot = await user.chatBots.id(chatbotId);

        //Store the conversation in the database:
        if (conversationId === '' || conversationId === undefined) {
            chatbot.conversationHistory.push({ conversation: [] });
            // await user.save();
            chatbot.credits -= 1;
            //get the id of the newly created conversation. Since we are pushing, it will be the last object in the conversation arr.
            conversationId = chatbot.conversationHistory[chatbot.conversationHistory.length - 1].id;
            chatbot.totalConversations += 1;
            const message = {
                sender: 'bot',
                body: chatbot.initialMessage
            }

            conversation = await chatbot.conversationHistory.id(conversationId);
            conversation.conversation.push(message); //push initial message in db
            conversation.conversation.push(requestBody); //Push the user query in db
            // await user.save();

        }
        else if (conversationId !== undefined && conversationId !== null) {
            conversation = chatbot.conversationHistory.id(conversationId);
            conversation.conversation.push(requestBody); //Push the user query in db

        }

        //initializing vector db client


        //setting up langchain
        const vectorStore = await getVectorStore();
        const output = await vectorStore.asRetriever( { filter: { namespace: chatbotId }, k: 8, searchType: 'similariy' }).invoke(requestBody.body)
        console.log(output)
        const model = new ChatGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENAI_KEY, model: 'gemini-pro', temperature: 0.8, maxOutputTokens: 4000 });
        const chain = createChain(chatbot, model);
        // const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
        //     k: 5,
        //     // verbose: true,
        //     prompt: prompt,
        //     returnSourceDocuments: true,
        // })

        messageBody = await chain.invoke(requestBody.body, { configurable: { filter: { namespace: chatbotId }, k: 8, searchType: 'similariy' } });
        console.log(messageBody)
        // if (messageBody) {
        //     messageBody = messageBody.text
        // }

        let message = { sender: 'bot', body: messageBody }
        message.conversationId = conversationId;
        conversation.conversation.push(message);
        chatbot.totalMessages += 1;
        return message;
    }
    catch (error) {
        console.log(error, '\nError in message route');
        let message = { sender: 'bot', body: 'Something went wrong' }
        return message;
    }
}


module.exports = { replyToMessage }