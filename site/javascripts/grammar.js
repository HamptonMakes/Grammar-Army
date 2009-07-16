
var tmp;
var pageQueue = [];
var currentPage;
var pageRevisionID;
var problemList;

var status = function(status) {
  $("#status").append(status + "... ");
}

var getMorePages = function(callback) {
  $.getJSON("http://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=10&format=json&callback=?",
            function(result) {
              $.merge(pageQueue, $.map(result['query']['random'], 
                                     function(page, i) {
                                       return page['title'];
                                     }
                                  )
                     )
              callback();
            });
  status("loading more articles");
}

var startPageLoad = function() {
  currentPage = pageQueue.pop();
  $("h1#currentPage").html(currentPage);
  status("loading " + currentPage);
  
  $.getJSON("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&titles=" + currentPage + "&format=json&callback=?",
    function(data) {
      var page = $.first(data['query']['pages'])['revisions'];
      var pageContent = $.first($.first(page));
      processPage(pageContent);
    });
}

var processPage = function(pageContent) {
  //$("#pageContent").text(pageContent);
  problemList = [];
  $.merge(problemList, Replacement.process(pageContent));
  
  if(problemList.length == 0) {
    status("no problems found... moving on")
    startPageLoad();
  } else {
    status("found " + problemList.length + " possible problems")
    $.each(problemList, function(index, problem) {
      tmp = problem;
      problem.processor.display($("#content"), problem);
    })
  }
}



$(function() {
  getMorePages(startPageLoad)
})