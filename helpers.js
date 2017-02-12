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
        resultString = resultArray.join(', ') + '.';
      }
    }
    else {
      resultString = 'Pas d\'information de ' + tag;
    }
    return resultString;
  },

  // Hack to treat reply buttons as state-changers
  // TODO: refine to accept texts that are like the button payloads
  // eg: button is "yes", accept text "yes"
  handleReplyButton: function(message) {
    return message.payload ? message.payload : 'escape'
  },

  // Interpolation enabler in JSON objects
  interpolateObject: function(o, a) {
    var j = JSON.stringify(o);
    for (var k in a) {
      j = j.split('${'+k+'}').join(a[k]);
    }
    return JSON.parse(j);
  }


}
