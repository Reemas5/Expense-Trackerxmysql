const sequelize = require('../config/db');
const Expenses = require('../model/expense');
const Signup = require('../model/signup');
const uuid = require('uuid');
const {Forgotpassword} = require('../model/forgotpassword')
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

exports.forgotpassword = async(req,res)=>{
    try {
        const { email } = req.body;
        console.log(email);

        const user = await Signup.findOne({ where: { email } });
        if (user) {
            const id = uuid.v4();
            await user.createForgotpassword({ id, active: true })
                .catch(err => {
                    throw new Error(err);
                });

           
            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.Api_key; 

            const transactionalEmailsApi = new Sib.TransactionalEmailsApi();

            const sender = {
                email: 'sameerkhan570786@gmail.com', 
                 
            };

            const receivers = [
                {
                    email: email, 
                },
            ];

            const response = await transactionalEmailsApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset Your Password',
                htmlContent: `<a href="http://localhost:3500/resetpassword/${id}">Reset Password</a>`,
            });

            console.log('Email sent successfully:', response);
            return res.status(200).json({ message: 'Link to reset password sent to your mail', success: true });
        } else {
            throw new Error('User does not exist');
        }
    } catch (err) {
        console.error(err);
        return res.json({ message: err.message, success: false });
    }
}

exports.forgotpassword_ID =async(req,res)=>{
    const id = req.params.id;

try {
    const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });

    if (forgotpasswordrequest) {
        await forgotpasswordrequest.update({ active: false });

        res.status(200).send(`
            <html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        console.log('called');
                    }
                </script>
                <form action='http://localhost:3500/updatepassword/${id}' method="post">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>reset password</button>
                </form>
            </html>
        `);
    } else {
        res.status(404).send({ message: 'Request not found' });
    }
} catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong' });
}
}

exports.updatepassword = async(req,res)=>{
    try {
        const { newpassword } = req.body;
        const resetpasswordid = req.params.id;

        if (typeof newpassword !== 'string' || !newpassword.trim()) {
            return res.status(400).json({ error: 'Invalid password', success: false });
        }

        const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });
        if (!resetpasswordrequest) {
            return res.status(404).json({ error: 'Reset password request not found', success: false });
        }

        const user = await Signup.findOne({ where: { id: resetpasswordrequest.SignupId } });
        if (!user) {
            return res.status(404).json({ error: 'No user exists', success: false });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(newpassword, salt);

        console.log('New password:', newpassword);
        console.log('Generated hash:', hash);

        await user.update({ password: hash });
        res.status(201).json({ message: 'Successfully updated the new password', success: true });

    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: error.message, success: false });
    }
}