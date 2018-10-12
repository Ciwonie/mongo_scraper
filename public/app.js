function scrapeArticles () {
    var data={};
  $.getJSON("/scrape", function(data) {
      console.log('successful scrape');
      console.log('data from scrape', data);
      getArticles();

  });
}

function getArticles () {
console.log('in getArticles');
  $.getJSON("/articles", function(data) {
    console.log(data);
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>");
        $("#articles").append("<a data-id='" + data[i]._id + "' href='"   + data[i].link + "' target='about_blank'>" + data[i].link + "</a>");
        console.log('\n\nappending articles to page');
    }
  });
}

scrapeArticles();

$(document).on("click", "p", function() {
$("#notes").empty();
var thisId = $(this).attr("data-id");

$.ajax({
  method: "GET",
  url: "/articles/" + thisId
})
  .done(function(data) {
    console.log(data);
    $("#notes").append("<p class='title'>" + data.title + "</p>");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

    if (data.note) {
      $("#bodyinput").val(data.note.body);
    }
  });
});


$(document).on("click", "#savenote", function() {

var thisId = $(this).attr("data-id");


$.ajax({
  method: "POST",
  url: "/articles/" + thisId,
  data: {

    body: $("#bodyinput").val()
  }
})
  .done(function(data) {

    $("#notes").empty();
  });

$("#bodyinput").val("");
});


$(document).on("click", "#deletenote", function() {

var thisId = $(this).attr("data-id");

$.ajax({
  method: "DELETE",
  url: "/delete/" + thisId,
})
  .done(function(data) {
    console.log('app.js delete - data',data);
    $("#notes").empty();
  });

$("#bodyinput").val("");
});