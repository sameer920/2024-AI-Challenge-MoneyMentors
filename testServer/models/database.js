//setting up mongo db with mongoose
const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
require('dotenv').config();

mongoose.connect(process.env.DB_PATH);

//Setting up schemas:

const messageSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    sender: String,
    body: String,
    // time: time
})

const conversationSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    conversation: [messageSchema],
}, { timestamps: true });

const chunkSchema = mongoose.Schema({
    fileName: String,
    content: String
})

const fileSchema = new mongoose.Schema({
    filename: String,
    data: String,
    type: String,
    length: Number
    // chunks: [chunkSchema]
})

const dataSchema = new mongoose.Schema({
    files: [fileSchema],
    // type:String, //e.g link, file, text etc
})

const botSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: String,
    icon: {
        data: Buffer,
        contentType: String
    },
    credits: Number,
    conversationHistory: [conversationSchema],
    totalChars: Number,
    data: dataSchema,
    basePrompt: String,
    model: String,
    temprature: Number,
    publicAccess: Boolean,
    domains: [String],
    rateMessages: Number,
    rateSeconds: Number,
    initialMessage: String,
    SuggestedMessages: [String],
    darkMode: Boolean,
    displayName: String,
    userBubbleColor: String,
    chatButtonColor: String,
    headerBarColor: String,
    botBubbleColor: String,
    totalConversations: Number,
    totalMessages: Number,
    totalResolutions: Number,
})



const userSchema = new mongoose.Schema({
    email: String,
    googleId: String,
    givenName: String,
    familyName: String,
    picture: String,
    avatarImage: {
        data: Buffer,
        contentType: String,
    },
    name: String,
    emailVerified: Boolean,
    locale: String,
    chatBots: [botSchema],
    totalConversations: Number,
    usedConversations: Number,
    plan: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    managers: [String],
    clientsManaged: [String],
    allowedChatbots: Number
});


const VisitorSchema = new mongoose.Schema({
    chatBotId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ipAddresses: {
        type: [String],
        default: []
    }
});

const Visitor = mongoose.model('Visitor', VisitorSchema);

userSchema.plugin(passportLocalMongoose, { 'usernameField': 'email' })
const User = mongoose.model("User", userSchema);

// Export User model to use it in other modules
module.exports = { User, Visitor };