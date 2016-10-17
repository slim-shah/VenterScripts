/**
  Script to fetch all the complaints (posts) for a company (specified through its ID) supplied, from the National Consumer Complaint Forum (NCCF) -- complaintboard.in.
  author: Vihari Piratla viharipiratla[at]gmail[dot]com
  Date: Oct. 4th 2016 
  Input: ID of the corporation of interest, for example: mumbai-municipal-corporation-l53937
  Requires utils.js and phantomjs
  Gets all the posts related to the company specified. Also handles paging; 
  Usage: <phantomjs binary> mumbai-municipal-corporation-l53937 1>reviews.json
*/

var page = require('webpage').create(),
    system = require('system');

console.err = function () {
    require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

var baseURL="http://www.complaintboard.in/complaints-reviews/";
url=baseURL+system.args[1]+".html";
var MAX_PAGES = 100;
var numPages = 0;
allComplaints = [];

getNumWords = function(){
    var nw = 0;
    for(var ci=0;ci<allComplaints.length;ci++){
	nw += allComplaints[ci].content.split(/[ ]+/).length;
    }
    return nw;
}

getNumMedia = function(){
    var nm = 0;
    for(var ci=0;ci<allComplaints.length;ci++){
	nm += allComplaints[ci].media.length;
    }
    return nm;
}

page.settings.loadImages = false;
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.settings.XSSAuditingEnabled = true;
//page.settings.javascriptEnabled = false;
page.settings.resourceTimeout = 20000;//ms

extract = function(){
    if(url==null || typeof(url)=="undefined" || numPages>=MAX_PAGES){
	var meta = {"numPosts":allComplaints.length,
		    "numWords":getNumWords(),
		    "numMedia":getNumMedia(),
		    "Date":new Date().toDateString(),
		    "url":baseURL+system.args[1]+".html"};
	var data = {"meta":meta,"complaints":allComplaints};
	console.log(JSON.stringify(data));
	console.err("-----------\n"
		    +"Number of Posts: "+allComplaints.length+"\n"
		    +"Total number of words: "+getNumWords()+"\n"
		    +"#Media: "+getNumMedia());
	
	phantom.exit(1);
    }
    
    console.err("Fetching: "+url);
    page.open(url,
	      function (status) {
		  if (status !== 'success') {
		      console.err('Unable to access network');
		      console.log("FAILED!!!");
		      phantom.exit(0);
		  } else {
		      console.err("SUCCESS!!");
		      if(page.injectJs("utils.js")){
			  var complaints = page.evaluate(function(){return extractReviewsNCCF()});
			  			  
			  for(var ci=0;ci<complaints.length;ci++)
			      allComplaints.push(complaints[ci]);
		      
			  url = page.evaluate(function(){return getNextURLNCCF();});
			  console.err("Next url: "+url);
			  numPages++;
			  return extract();
		      }
		  }
	      });
}

if (system.args.length < 2 || system.args.length > 2) {
    console.err('Usage: NCCFFetch.js companyid');
    phantom.exit(1);
}

extract();
