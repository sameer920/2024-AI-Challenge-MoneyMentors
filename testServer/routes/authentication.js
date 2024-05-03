const passport = require('passport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = require('express').Router();
const { User, Agency } = require('../models/database');
const { deleteNamespaceVectors } = require('../helper/utils');


router.post('/register/user', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            res.status(400).send({ response: 'User already exists. Try logging in.' });
            return;
        }

        const newUser = new User({
            email: email,
            name: name,
            totalConversations: 30,
            usedConversations: 0,
            plan: 'free'
        })



        User.register(newUser, password, (err, user) => {
            if (err) {
                console.log(`${err} error registering new user`);
                res.status(500).send({ response: 'Error registering User' })

            }
            else {
                passport.authenticate('local')(req, res, function () {
                    res.status(200).send({ response: 'User successfully registered' })
                })
            }
        })
    }
    catch (error) {
        console.log(`${error} \n error while registering user`)
        res.status(500).send({ response: 'Error registering User' })
    }
});



router.post('/login/user', async (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ response: info.message });
        }
        req.logIn(user, function (err) {
            // Set User's session etc.
            if (err) {
                return next(err);
            }
            //choose the correct place to navigate to
            let redirect = ''
            if (user.chatBots.length > 0) {
                redirect = '/dashboard';
            }
            else {
                redirect = '/load-url';
            }

            return res.status(200).json({ response: redirect });
        });
    })(req, res, next);

})


// When logout, redirect to client
router.get("/logout", (req, res) => {
    console.log(req.user)
    req.logout(err => {

        if (err) {
            console.log(err, 'error while logging out');
            return next(err);
        }
        res.redirect(process.env.FAILURE_LOGIN_REDIRECT);
    });

});

router.get('/isAuthenticated', (req, res) => {
    if (!req.isAuthenticated()) {
        res.send({ authenticated: false });
    }
    else {
        // console.log('isAuthRoute', req.user.id);
        res.send({ authenticated: true });
    }
});

router.post('/change-password', (req, res) => {
    // assuming you have passed username, oldPassword and newPassword from client side
    const { email, oldPassword, newPassword } = req.body;

    if (req.user.type === 'user') {
        User.findByUsername(email).then((user) => {
            if (!user) {
                return res.status(404).json({ response: 'User not found' });
            }

            // Check if the old password is correct
            user.changePassword(oldPassword, newPassword, function (err) {
                if (err) {
                    if (err.name === 'IncorrectPasswordError') {
                        res.status(400).json({ response: 'Incorrect password' });
                    } else {
                        res.status(500).json({ response: 'An error occurred while changing password' });
                    }
                } else {
                    res.status(200).json({ response: 'Your password has been changed successfully' });
                }
            });
        });
    }
});

router.delete('/deleteAccount', async (req, res) => {
    try {
        const userId = req.user.id;

        if (req.user.type === 'user') {
            const user = await User.findOne({ _id: userId }, { 'chatBots.data': 0 });
            const chatbotIds = user.chatBots.map((chatbot) => chatbot.id);

            await Promise.all(chatbotIds.map(chatbotId => deleteNamespaceVectors(chatbotId)));
            await User.deleteOne({ _id: userId });
        }
        else if (req.user.type === 'agency') {
            await Agency.deleteOne({ _id: userId });
        }
        req.logout(err => {

            if (err) {
                console.log(err, 'error while logging out');
                return next(err);

            }
        });
        res.status(200).send({ response: 'deleted' });
    }
    catch (error) {
        console.log(error, 'error in deleteChatbot');
        res.status(400).send({ response: 'error deleting account' });
    }
});



router.post('/forgot-password', async function (req, res) {
    try {
        const buffer = crypto.randomBytes(20);
        const token = buffer.toString('hex');
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: 'No account with that email address exists.' });
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // const smtpTransport = nodemailer.createTransport({ // email settings
        //   service: 'Gmail', 
        //   auth: { user: 'example@gmail.com', pass: 'password' }
        // });

        const mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                 req.headers.origin + '/reset-password/' + token + '\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        console.log(mailOptions);

        // await smtpTransport.sendMail(mailOptions);
        res.status(200).json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.post('/reset-password/:token', async function (req, res) {
    console.log('reset password called with token: ', req.params.token)
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send({ error: 'Password reset token is invalid or has expired.' });
        }

        // Redirect user to password reset form with a valid token
        console.log('validated')
        const { password } = req.body;
        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        const updatedUser = await user.save();

        // Automatically log the user in after password reset
        req.logIn(updatedUser, function (err) {
            if (err) return next(err);
            return res.status(200).json({ message: 'Password has been reset.' });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;