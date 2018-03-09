// All button functionality goes here

// When user clicks to save an article
$(document).on("click", ".save-button", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/save/" + thisId
	}).done(function(data){
		console.log(data);
		location.reload();
	});
});

// When user clicks to save a comment
$(document).on("click", "#saveComment", function(){
	var thisId = $(this).attr("data-id");
	var commentText = $("#body-input" + thisId).val();
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			text: commentText
		}
	})
	.done(function(data){
		console.log(data);
		location.reload();
	});
	commentText.val("");
});


// When user wants to remove a saved article
$(document).on("click", ".remove-save-btn", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/remove/" + thisId
	}).done(function(data){
		console.log(data);
		location.reload();
	});
});


// When user wants to delete a saved comment
$(document).on("click", "#deleteComment", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/delete/" + thisId
	}).done(function(data){
		console.log(data);
		location.reload();
	});
});