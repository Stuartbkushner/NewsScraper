var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
	headline: {
		type: String,
		required: true
	},
	summary: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	},
	url: {
		type: String,
		required: true
	}
});

var Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;