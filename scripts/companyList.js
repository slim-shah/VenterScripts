/**
   This script will fetch the municipal corporations on complainboard.in through Google Custom Search
   author: Vihari Piratla viharipiratla[at]gmail[dot]com
   Date: 7th Oct. 2016
   Require phantomjs and utils.js to run the script
*/
var page = require('webpage').create(),
    system = require('system');

console.err = function () {
    require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

var MAX_PAGES = 50;
var query = "intitle:\"municipal corporation\" site:complaintboard.in";
var numPages = 0;

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.settings.loadImages = false;

extract = function(){
    if(numPages>=MAX_PAGES){
	phantom.exit(1);
    }
    var url = "https://www.google.co.in/search?q="+query+"&start="+numPages*10;
    //url = "https://www.google.co.in/search?q=google+page+with+phantomjs+does+not+work&ie=utf-8&oe=utf-8&client=firefox-b-ab&gfe_rd=cr&ei=Q9P3V4qBO-bs8AfqiYTwBg#q=unable+to+open+google+search+page+in+phantomjs"
    console.err(numPages+"/"+MAX_PAGES+":::"+url);
    page.open(url,function(status){
	    if (status !== 'success') {
		console.err('Unable to access network');
	    } else {
		console.err("SUCCESS!!");
		if(page.injectJs("utils.js")){
		    if(numPages==0)
			console.log("#Name:::ID");
		    gl = page.evaluate(function(){return extractGoogleLinks()});
		    //console.log(gl.length);
		    var arr = [];
		    //console.err(page.content);
		    gl.map(function(d){
			    var m = d.title.match(/(.*?) Complaints/);
			    var mu = d.url.match(/([^\/]+)\.\s*html/);
			    console.err(d.title+"::"+d.url+"\n"+m +"  " + mu);
			    if(m!=null && mu!=null && m.length>1 && mu.length>1){
				var title = m[1];
				var id = mu[1];
				arr.push(title+":::"+id);
			    }
			});
		    for(var i=0;i<arr.length;i++){
			if(numPages<3)
			    console.log("#"+arr[i]);
			else
			    console.log(arr[i]);
		    }
		    
		    numPages++;
		    return extract();
		}
	    }
	});
}
    extract();