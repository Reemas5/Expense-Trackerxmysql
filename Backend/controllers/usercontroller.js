const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Signup = require('../model/signup');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await Signup.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Signup.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Either of the fields is incorrect" });
        }

        const token = jwt.sign(
            { userId: user.id, Email: user.email },
            process.env.secret_key
        );

        res.status(201).json({ message: "User logged in successfully", token, premium_user: user.Ispremium });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
