'use strict';

// For JSON filtering
const _ = require('lodash');

module.exports = {

  // Filters for parsing BuiltWith API response
  techFilter: function(technologies, tag) {
    let resultString = '';
    let resultArray = [];
    let results = _.filter(technologies, { 'Tag': tag });
    if (results) {
      results.forEach(function(result) {
        resultArray.push(result.Name);
      });
      if (resultArray.length > 0) {
        resultString = tag.toUpperCase() + ' : ' + resultArray.join(', ') + '\n';
      }
    }
    else {
      resultString = 'Pas d\'information de ' + tag;
    }
    return resultString;
  },

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
