/*
  author: Vihari Piratla viharipiratla[at]gmail[dot]com
  Data:4th Oct. 2016
  Fetches all the reviews for a FB page. 
  Works with phantomjs -- opens the page, scrolls to the bottom and extracts the information present.
  Requires phantomjs and utils.js
*/

var page = require('webpage').create(),
system = require('system');

console.err = function () {
    require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

if (system.args.length < 2 || system.args.length > 2) {
    console.err('Usage: fetch.js pageid');
    phantom.exit(1);
}
else{ 
    var url="https://www.facebook.com/"+system.args[1]+"/reviews/";
    console.err("Fetching: "+url);
    var MAX_TRIES = 100;
    var numTries = 0;
    page.open(url,
	      function (status) {
		  if (status !== 'success') {
		      console.err('Unable to access network');
		  } else {
		      console.err("SUCCESS!!");
		      if(page.injectJs("utils.js")){
			  var probe = window.setInterval(function(){
				  // Scrolls to the bottom of page
				  page.evaluate(function(){
					  window.document.body.scrollTop = document.body.scrollHeight;
				      });
				  var st = page.evaluate(function(){return window.document.body.scrollTop;});
				  var sh = page.evaluate(function(){return document.body.scrollHeight;});
				  console.err("Scroll height: "+sh+" - "+st);
				  var prevH = document.body.scrollHeight;
				  //wait after scrolling
				  window.setTimeout(function(){
					  numTries++;
					  var count = page.content.match(/class=\"uiMorePagerLoader/g);
					  if(numTries >= MAX_TRIES || (count === null && prevH === document.body.scrollHeight)) { // Didn't find
					      var csv = page.evaluate(function(){return extractReviewsFB()});
					      console.log("#Fetched from FB page: "+url);
					      console.log(csv);
					      console.err("Clearing interval...");
					      clearInterval(probe);
					      phantom.exit();
					  }else{
					      console.err("Continuing to fetch more reviews... Scroll: "+numTries);
					  }
				      }, 1000);
			      }, 2000);
		      }
		  }
	      });    
}
