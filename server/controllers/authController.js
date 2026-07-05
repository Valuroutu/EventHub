import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Only allow self-registration as "user" or "organizer".
        // "admin" accounts must be created/promoted by an existing admin.
        const allowedRoles = ["user", "organizer"];
        const finalRole = allowedRoles.includes(role) ? role : "user";

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            name,

            email,

            password: hashedPassword,

            role: finalRole

        });

        res.status(201).json({

            _id: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            token: generateToken(user._id)

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }
};
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        const isMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!isMatch) {

            return res.status(401).json({

                message: "Invalid Password"

            });

        }

        res.json({

            _id: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            token: generateToken(user._id)

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


/*
    Admin Only
    Get All Users
    GET /api/auth/users
*/

export const getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    Admin Only
    Update a User's Role
    PUT /api/auth/users/:id/role
*/

export const updateUserRole = async (req, res) => {

    try {

        const { role } = req.body;

        if (!["user", "organizer", "admin"].includes(role)) {

            return res.status(400).json({
                message: "Invalid role"
            });

        }

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Role updated",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    Admin Only
    Delete a User
    DELETE /api/auth/users/:id
*/

export const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        if (user._id.toString() === req.user._id.toString()) {

            return res.status(400).json({
                message: "You cannot delete your own account here"
            });

        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};