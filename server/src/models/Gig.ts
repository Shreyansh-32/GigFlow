import mongoose, { Document, Schema } from "mongoose";

export interface IGig extends Document{
    title : string;
    description : string;
    budget : number;
    ownerId : mongoose.Schema.Types.ObjectId;
    status : "Open" | "Assigned";
};

const GigSchema : Schema = new Schema({
    title : {type : String, required : true},
    description : {type : String, required : true},
    budget : {type : Number, required : true},
    ownerId : {type : mongoose.Schema.Types.ObjectId, ref:"User", required : true},
    status : {type : String, enum : ["Open", "Assigned"], default: "Open"},
}, {timestamps : true});

export default mongoose.model<IGig>("Gig", GigSchema);