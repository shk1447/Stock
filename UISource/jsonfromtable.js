var Q = require('q');
var cheerio = require('cheerio');
var request = require('request');

function convert(html, option) {
  var jsonResponse = [];
  var $ = cheerio.load(html);

  $('table').each(function(i, table) {
    var tableAsJson = [];
    // Get column headings
    // @fixme Doesn't support vertical column headings.
    // @todo Try to support badly formated tables.
    var columnHeadings = [];
    $(table).find('tr').each(function(i, row) {
      $(row).find('th').each(function(j, cell) {
        columnHeadings[j] = $(cell).text().trim();
      });
    });

    // Fetch each row
    $(table).find('tr').each(function(i, row) {
      var rowAsJson = {};
      $(row).find('td').each(function(j, cell) {
        if (columnHeadings[j]) {
          rowAsJson[ columnHeadings[j] ] = $(cell).text().trim();
        } else {
          rowAsJson[j] = $(cell).text().trim();
        }
      });
      
      // Skip blank rows
      if (JSON.stringify(rowAsJson) != '{}')
        tableAsJson.push(rowAsJson);
    });
    
    // Add the table to the response
    if (tableAsJson.length != 0)
      jsonResponse.push(tableAsJson);
  });
  return jsonResponse;
}

exports.convert = convert;