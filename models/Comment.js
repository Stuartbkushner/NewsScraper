var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	body: {
		type: String,
	},
	comment: {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;