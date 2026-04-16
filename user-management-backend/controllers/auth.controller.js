import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { authValidator } from "../services/authBodyValidator.js"


export const login = async (req, res) => {
    const message = authValidator(req.body)
    if (message) {
        return res.status(400).json({ message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }
    const token = jwt.sign({ 
        userId: user._id ,
        userRole : user.role
    }, process.env.JWT_SECRET,
     { expiresIn: '1d' })

    return res.status(200).json({
        success: true,
        token
    });

}

export const register = async (req, res) => {
    const message = authValidator(req.body)
    if (message) {
        return res.status(400).json({ message });
    }

    await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        createdBy: req.user.userId
    })
    res.status(201).json({ message: "User Created" })
}
