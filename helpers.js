'use strict';

module.exports = {
  
  // Filters for parsing BuiltWith API response
  techFilter: function(technologies, tag) {
    if (where(technologies, { 'Tag': tag })) {
      var results = where(technologies, { 'Tag': tag });
      var array = [];
      results.forEach(function(result) {
        array.push(result.Name);
      });
      if (array.length > 0) {
        var string = tag.toUpperCase() + ' : ' + array.join(', ') + '\n';
        return string;
      }
    }
    else {
      return 'Pas d\'information de ' + tag;
    }
  }

  // Hack to treat reply buttons as state-changers
  handleReplyButton: function(message) {
    if (message.payload) {
      return  message.payload
    }
    else {
      return 'escape'
    }
  }

}
