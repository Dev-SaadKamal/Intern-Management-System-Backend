const mongoose = require("mongoose");


const UserSchema = mongoose.Schema(
    {
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
            enum: ["admin", "intern"],
            default: "intern"
        },
        field: {
            type: String,
            default: null
        }, // frontend/backend
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
    }, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;         