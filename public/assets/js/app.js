// This is where all the button functionality will go

// What happens when you click on the save button
$(document).on("click", ".save", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "articles/save/" + thisId
	})
	.then(function(data){
		console.log(data);
	})
});

$(document).on("click", ".delete", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "articles/delete/" + thisId
	})
	.then(function(data){
		console.log(data)
	})
});

$(document).on("click", ".saveComment", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "comments/save/" + thisId
	})
	.then(function(data){
		console.log(data)
	})
});

$(document).on("click", ".deleteComment", function(){
	var thisArticleId = $(this).attr("data-article-id");
	var thisCommentId = $(this).attr("data-comment-id");
	$.ajax({
		method: "DELETE",
		url: "comments/delete/" + thisArticleId + "/" + thisCommentId
	})
	.then(function(data){
		console.log(data);
	})
});
