// Grab headlines as a json
$.getJSON("/headlines", function(data){
	// for each headline
	for (var i = 0; i < data.length; i++) {
		// display the appropriate information on the page
		$("#headlines").append("<p data-id='" + data[i]._id + ">" + data[i].headline + "<br />" + data[i].url + "</p>");
	}
});

// When someone clicks a p tag
$(document).on("click", "p", function(){
	// Empty the notes from the note section
	$("#notes").empty();
	// Save the id from the p tag
	var thisId = $(this).attr("data-id");

	// Now make an Ajax call for the headline
	$.ajax({
		method: "GET",
		url: "/headlines/" + thisId
	})
		// Add the note information to the page
		.then(function(data){
			console.log(data);
			// The title of the headline
			$("#notes").append("<h1>" + data.headline + "</h1>");
			// An input to enter a new title
			$("#notes").append("<input id='titleinput' name='title' >");
			// A textarea to add a new body
			$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
			// A button to submit a new note, with the id of the headline saved to it
			$("#notes").append("<button data-id'" + data._id + "' id='savenote>Save Note</button>");

			// If there's a note in the headline
			if (data.note) {
				// Place the title of the note in the title input
				$("#titleinput").val(data.note.title);
				// Place the body of the note in the body input
				$("#bodyinput").val(data.note.body);
			}
		});
});

// When you click the Save Note button
$(document).on("click", "#savenote", function(){
	// Grab the id associated with the headline from the submit button
	var thisId = $(this).attr("data-id");

	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
		method: "POST",
		url: "/headlines/" + thisId,
		data: {
			// The value in the title input
			title: $("#titleinput").val(),
			// The value in the note textarea
			body: $("#bodyinput").val(),
		}
	})
		// When all of that is done
		.then(function(data){
			// Log the response
			console.log(data);
			// Empty the notes section
			$("#notes").empty();
		});

	// Empty the title input and note textarea
	$("#titleinput").val("");
	$("#bodyinput").val("");
});