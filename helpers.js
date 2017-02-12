'use strict';

// For JSON filtering
const where = require('lodash.where');

module.exports = {

  // Filters for parsing BuiltWith API response
  techFilter: function(technologies, tag) {
    if (where(technologies, { 'Tag': tag })) {
      let results = where(technologies, { 'Tag': tag });
      let array = [];
      let string = '';
      results.forEach(function(result) {
        if (result.Name !== undefined) { // BUGFIX: 'undefined' was displayed in end result
          array.push(result.Name);
        }
      });
      if (array.length > 0) {
        string = tag.toUpperCase() + ' : ' + array.join(', ') + '\n';
      }
    }
    else {
      string = 'Pas d\'information de ' + tag;
    }
    console.log('Array: ' + array.toString());
    console.log('String: ' + string);
    return string;
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
