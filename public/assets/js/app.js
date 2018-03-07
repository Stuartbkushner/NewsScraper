// This is where all the button functionality will go

// What happens when you click on the save button
$(document).on("click", ".save", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/save/" + thisId
	})
	.then(function(data){
		console.log(data);
		window.location = "/"
	})
});

// Delete an article from the saved page
$(document).on("click", ".delete", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/delete/" + thisId
	})
	.then(function(data){
		console.log(data);
		window.location = "/saved"
	})
});

// Save a comment
$(document).on("click", ".saveComment", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/comments/save/" + thisId,
		data: {
			text: $("#comment" + thisId).val();
		}
	})
	.then(function(data){
		console.log(data);
		$("#comment" + thisId).val("");
		$("#commentModal").modal("hide");
		window.location = "/saved"
	})
});

// Delete a comment
$(document).on("click", ".deleteComment", function(){
	var thisArticleId = $(this).attr("data-article-id");
	var thisCommentId = $(this).attr("data-comment-id");
	$.ajax({
		method: "DELETE",
		url: "/comments/delete/" + thisArticleId + "/" + thisCommentId
	})
	.then(function(data){
		console.log(data);
		$("#commentModal").modal("hide");
		window.location = "/saved"
	})
});
