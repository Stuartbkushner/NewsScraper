$(document).ready(function(){
	var articleContainer = $(".article-container");
	$(document).on("click", ".btn.save", handleArticleSave);
	$(document).on("click", ".scrape-new", handleArticleScrape);

	initPage();

	function initPage() {
		articleContainer.empty();
		$.get("/api/headlines?saved=false").then(function(data) {
			if (data && data.length) {
				renderArticles(data);
			} else {
				renderEmpty();
			}
		});
	}
})