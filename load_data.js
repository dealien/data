var debug_mode = true;
var config;
var theTable = "";

function table_gen(ar, headers = null) {
  theTable = "<table class='data-table'>";
  var height = ar.length;
  var width = ar[0].length;
  console.info("running table_gen()");
  console.time("time to load");
  console.log(ar);
  console.info("table width:", width);
  console.info("table height:", height);
  console.info("header count:", headers.length);

  if (headers !== null) {
    if (headers.length == width) {
      console.info("horizontal data format");

      theTable += "<tr>";
      for (var j = 0; j < width; j++) {
        theTable += "<th class='tooltip' title='" + headers[1][j] + "'>" + headers[0][j] + "</th>";
      }
      theTable += "</tr>";

      for (var j = 0; j < height; j++) {
        theTable += "<tr>";
        for (var k = 0; k < width; k++) {
          theTable += "<td id='" + headers[0][k] + "'>" + ar[j][k] + "</td>";
          console.group("row " + (j + 1) + ", column " + (k + 1));
          console.info(ar[j][k]);
          console.groupEnd();
        }
        theTable += "</tr>";
      }
    } else {
      console.info("vertical data format");

      theTable += "<tr>";
      for (var j = 0; j < height; j++) {
        theTable += "<th class='tooltip' title='" + headers[1][j] + "'>" + headers[0][j] + "</th>";
      }
      theTable += "</tr>";

      for (var j = 0; j < width; j++) {
        theTable += "<tr>";
        for (var k = 0; k < height; k++) {
          theTable += "<td id='" + headers[0][j] + "'>" + ar[k][j] + "</td>";
          console.group("row " + (k + 1) + ", column " + (j + 1));
          console.info(ar[k][j]);
          console.groupEnd();
        }
        theTable += "</tr>";
      }
    }
  } else {
    for (var j = 0; j < height; j++) {
      theTable += "<tr>";
      for (var k = 0; k < width; k++) {
        theTable += "<td>" + ar[j][k] + "</td>";
        console.group("row " + (j + 1) + ", column " + (k + 1));
        console.info(ar[j][k]);
        console.groupEnd();
      }
      theTable += "</tr>";
    }
  }

  theTable += "</table>";
  console.timeEnd("time to load");
  console.groupCollapsed("theTable");
  console.log("theTable:", theTable);
  console.groupEnd();
  return theTable;
}

function load_data(json_data = null) {
  if (json_data != null) {
    config = json_data;
  }
  console.log("config", config);
  $(".output-box").html(table_gen(config.data, config.headers));
  if (config.info.hasOwnProperty('title')) {
    if (config.info.hasOwnProperty('source')) {
      $("#title-placeholder").replaceWith('<h1 class="tooltip" data-tooltip-content="#tooltip-link">' + config.info.title + '</h1><div class="tooltip-wrapper"><a id="tooltip-link" href="' + config.info.source_url + '">' + config.info.source + '</a></div>')
    } else {
      $("#title-placeholder").replaceWith('<h1>' + config.info.title + '</h1>')
    }
    document.title = config.info.title + " | Data Viewer";
  } else {
    $("#title-placeholder").replaceWith('<h1>Loaded data</h1>')
  }
}

// Comment out unless being used for development purposes
// document.onload = $.getJSON("sample_configs/config.json", function(loaded_data) {
//   console.log(loaded_data);
//   config = loaded_data;
//   load_data();
// });

// Load JSON from file
function import_file() {
  var files = document.getElementById('file').files;
  console.log(files);
  if (files.length <= 0 || files.length > 1) {
    return false;
  }
  var fr = new FileReader();
  fr.onload = function(e) {
    var d = JSON.parse(e.target.result);
    load_data(d);
  }

  fr.readAsText(files.item(0));
};

// Update file loader display on file selection
function loader_setup() {
  (function(document, window, index) {
    var inputs = document.querySelectorAll('.importfile');
    Array.prototype.forEach.call(inputs, function(input) {
      var label = input.nextElementSibling,
        labelVal = label.innerHTML;

      input.addEventListener('change', function(e) {
        var fileName = '';
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else
          fileName = e.target.value.split('\\').pop();

        // Display selected file name on importer
        if (fileName)
          label.querySelector('span').innerHTML = fileName;
        else
          label.innerHTML = labelVal;
      });

      // Firefox bug fix
      input.addEventListener('focus', function() { input.classList.add('has-focus'); });
      input.addEventListener('blur', function() { input.classList.remove('has-focus'); });
    });
  }(document, window, 0));
}

window.onload = loader_setup;
