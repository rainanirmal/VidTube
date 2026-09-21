// _id string pk
//   name string
//   description string
//   video ObjectId[] videos
//   owner ObjectId users
//   createdAt Date
//   updatedAt Date

import mongoose, { mongo, Schema } from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        video: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        owner: {
            tpye: Schema.Types.ObjectId,
            ref: "User"
        }
    }, 
    {
        timestamps: true
    }
)

const Playlist = mongoose.model("Playlist", playlistSchema)

export {
    Playlist
}