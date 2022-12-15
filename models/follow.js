const { model, Schema} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const FollowSchema = Schema({
    user: {
        //type relation with other model
        type:Schema.ObjectId,
        ref: "User"
    },
    followed:{
        type: Schema.ObjectId,
        ref:"User"
    },
    create_at:{
        type:Date,
        default:Date.now
    }
});

FollowSchema.plugin(mongoosePaginate);
module.exports= model("Follow", FollowSchema, "follows");