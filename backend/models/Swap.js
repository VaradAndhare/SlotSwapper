const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema({
    requester : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    requesterEvent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event",
        required : true
    },
    receiverEvent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event",
        required : true
    },
    status : {
        type : String ,
        enum : ["PENDING" , "ACCEPTED" , "REJECTED"],
        default : "PENDING"
    }
},{timestamps : true})


module.exports = mongoose.model("Swap", swapSchema);