import mongoose from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "manager", "user"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword = async function (pswd) {
  return await bcrypt.compare(pswd, this.password);
};

export const User = mongoose.model("User", userSchema);