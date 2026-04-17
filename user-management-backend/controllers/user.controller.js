import { authorizeRoles } from "../middlewares/role.middleware.js";
import { User } from "../models/user.model.js";
import { hashPassword } from "../services/hashPassword.js";

export const getAllUsers = async (req, res) => {
    const { role, status, search } = req.query
    const filter = {};
    if (role) filter.role = role.replace(/"/g, "");;
    if (status) filter.status = status.replace(/"/g, "");;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);

    const skip = (page - 1) * limit;
    const users = await User.find(filter)
        .skip(skip)
        .limit(limit)
        .select("-password")
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);
    res.status(200).json({
        users,
        totalUsers: total,
        page,
        totalPages: Math.ceil(total / limit)
    });
}

export const getUserById = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .select("-password")

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
}

export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = {};

        if (req.body.name) updateData.name = req.body.name;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.role) updateData.role = req.body.role;
        if (req.body.status) updateData.status = req.body.status;

        updateData.updatedBy = req.user.userId;
        if (req.user.role === "manager" && updateData.role === "admin") {
            return res.status(403).json({ message: "Managers cannot update admin users" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after' }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "User successfully updated",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.status === "inactive") return res.status(400).json({ message: "User already inactive" });

        if (req.user.userId == user._id) return res.status(400).json({ message: "You cannot delete yourself" });
        user.status = "inactive";
        user.updatedBy = req.user.userId;

        await user.save();

        res.status(200).json({
            message: "User deactivated successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOwnProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });


        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updateData = {};

        if (req.body.name) updateData.name = req.body.name;
        if (req.body.email) updateData.email = req.body.email;

        if (req.body.password) updateData.password = await hashPassword(req.body.password);

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { returnDocument: 'after' }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};