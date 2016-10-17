function closest(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    var parent;

    // traverse parents
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}

extractReviewsFB = function(){
    var reviewBlocks = document.getElementsByClassName("userContentWrapper");
    //return "Len: "+reviewBlocks.length +"\n";
    var reviews = [];
    for(var i=0;i<reviewBlocks.length;i++){
	var d = reviewBlocks[i];
	var info = {};
	info.content = d.querySelector(".userContent").textContent;
	//if there is no text in the block then do not proceed
	var links = d.querySelectorAll("h5 a.profileLink");
	if(info.content === null) {
	    continue;
	}

	if(links.length>1) {
	    info.person = {id:links[0].href, name: links[0].text};
	    info.on = {id:links[1].href, name: links[1].text};
	}
	else { 
	    info.person = null;
	    info.on = {id:links[0].href, name: links[0].text};
	}
	reviews.push(info);
    }
    //console.log(JSON.stringify(reviews));
    return JSON.stringify(reviews);
};

extractReviewsNCCF = function(){
    var complaintBlocks = document.getElementsByClassName("complaint");
    var complaints = [];
    var domain = document.domain;
    var companyId = document.URL.replace(/page\/.*$/,"");
    var company = document.querySelector("h2").textContent;
    companyName = company.match(/Consumer complaints and reviews about (.+)/)[1];
    for(var i=0;i<complaintBlocks.length;i++){
	var c = complaintBlocks[i];
	var t = closest(c,"table");
	var header = t.querySelector("tr");
	var person = header.querySelector("a");

	var complaint = {};
	complaint.person = {name: person.textContent, id: person.href};
	complaint.on = {name: companyName, id: companyId};
	var title = c.querySelector("h4");
	if(typeof(title)!=="undefined")
	    complaint.title = title.textContent;
	else
	    complaint.title = undefined;
	complaint.content = c.textContent;
	if(header.children.length>1)
	    complaint.date = header.children[1].textContent.replace(/^\s+|\s+$/g,"");
	else complaint.data = undefined;

	var images = [];
	var media = c.querySelectorAll("img");
	if(typeof(media)!=="undefined" && media.length>0){
	    for(var mi=0;mi<media.length;mi++){
		m = media[mi];
		var image = {};
		image.src = m.src;
		image.alt = m.alt;
		image.title = m.title;
		images.push(image);
	    }
	}
	complaint.media = images;
	
	complaints.push(complaint);
    }
    return complaints;
};

getNextURLNCCF = function(){
    var links = document.querySelectorAll("a");
    for(var li=0;li<links.length;li++)
	if(links[li].textContent==="Next")
	    return links[li].href;
    
    return undefined;
}
    
extractGoogleLinks = function(){
    var links = [];
    var titles = document.querySelectorAll("h3.r");
    var urls = document.querySelectorAll("cite");
    for(var i=0;i<titles.length;i++){
	var title = titles[i].textContent;
	var url = urls[i].textContent;
	links.push({"title":title,"url":url});
    }
    return links;
}