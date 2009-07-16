var Replacement = {
  problemSets: [{"there": "here", 
                 "their": "our",
                 "they're": "they are"},
                {"there's": "there is",
                 "theirs": "ours"},
                {"your": "my",
                 "you're": "you are"}],

  ignoreWords: ["there are", "there was", "there is", "therefore", "there were", "there has"],
  

  process: function(pageContent) {
    var list = [];
    var searchText = pageContent.toLowerCase();
    for(var problemWordIndex in Replacement.problemSets) {
      var problemWords = Replacement.problemSets[problemWordIndex];
      for(var word in problemWords) {
        var i = searchText.indexOf(word);
        if(i >= 0) {
          if(!Replacement.startsWithIgnore(searchText.substring(i, i + 10))) {
            var fragment = searchText.substring(i - 80, i + 80);
            list.push({index: i, problemWord:word, shouldSoundRight:problemWords[word], processor:Replacement, fragment: fragment})
          }
        }
      }
    }
    return list;
  },
  
  display: function(place, problem) {
    place.append("<h3>Possible issue with \"" + problem.problemWord + "\"</h3>")
    place.append("The original sentence is: <blockquote>" + problem.fragment + "</blockquote>")
    var replaced = problem.fragment.replace(problem.problemWord, "<strong>" + problem.shouldSoundRight + "</strong>")
    place.append("If this is correct, then it should be *mostly* correct to have this word as a replacement: <blockquote>" + replaced + "</blockquote>")
    place.append("<hr/>")
  },

  startsWithIgnore: function(string) {
    for(var ignoreWordIndex in Replacement.ignoreWords) {
      var ignoreWord = Replacement.ignoreWords[ignoreWordIndex];
      if(string.indexOf(ignoreWord) == 0) {
        return true;
      }
    }
    return false;
  }
}