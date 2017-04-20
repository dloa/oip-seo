
var OIP_SEO = function () {
	// Should we load the current LibraryD database initially? Possibily if under 5mb total?
	
};

// Method Name: OIP_SEO.generateTags
// Description: Generates all meta tags.
// Paramaters: 
// 		- oipArtifact: 	The OIP Artifact we will be generating the meta tags for.
// 		- url: 			The Permalink back to this page
// 		- domain: 		The domain
// Returns: Returns meta tags.
OIP_SEO.prototype.generateTags = function(oipArtifact, url, domain){

	var metaTags = '';

	metaTags += this.generateBasicTags(oipArtifact, url, domain);
	metaTags += this.generateOGTags(oipArtifact, url, domain);
	metaTags += this.generateTCTags(oipArtifact, url, domain);

	return metaTags;
}

// Method Name: OIP_SEO.generateBasicTags
// Description: Generates basic SEO meta tags.
// Paramaters: 
// 		- oipArtifact: 	The OIP Artifact we will be generating the meta tags for.
// 		- url: 			The Permalink back to this page
// Returns: Returns basic seo meta tags.

OIP_SEO.prototype.generateBasicTags = function(oipArtifact, url, domain){
	var artifact = '';

	var oip = false;

	// alexandria-media
	if (oipArtifact['media-data']){
		artifact = oipArtifact['media-data']['alexandria-media'];
	} else { //OIP
		artifact = conformOIP(oipArtifact)['media-data']['alexandria-media'];
	}

	var metaTags = '';
	var IPFS_URL = 'https://ipfs.alexandria.io/ipfs/';
	var artifact_link = "https://alexandria.io/browser/" + url.split('/')[url.split('/').length -1];

	metaTags += '<title>'+ artifact.info.title.replace(/"/g,'\"') + ' | ΛLΞXΛNDRIΛ</title>';
	metaTags += tagGen('description', artifact.info.description.replace(/(")/g,'\"').slice(0,140), true);

	return metaTags;
}

// Method Name: OIP_SEO.generateOGTags
// Description: Generates Open Graph meta tags.
// Paramaters: 
// 		- oipArtifact: 	The OIP Artifact we will be generating the meta tags for.
// 		- url: 			The Permalink back to this page
// Returns: Returns OpenGraph compliant meta tags.
OIP_SEO.prototype.generateOGTags = function(oipArtifact, url, domain){
	var artifact = '';

	var oip = false;

	// alexandria-media
	if (oipArtifact['media-data']){
		artifact = oipArtifact['media-data']['alexandria-media'];
	} else { //OIP
		artifact = conformOIP(oipArtifact)['media-data']['alexandria-media'];
	}


	var metaTags = '';
	var IPFS_URL = 'https://ipfs.alexandria.io/ipfs/'
	var artifact_link = "https://alexandria.io/browser/" + url.split('/')[url.split('/').length -1];

	metaTags += tagGen('og:site_name', "Alexandria.io");
	metaTags += tagGen('og:url', artifact_link);
	metaTags += tagGen('og:title', artifact.info.title.replace(/"/g,'\"'));
	metaTags += tagGen('og:description', artifact.info.description.replace(/(")/g,'\"').slice(0,140));

	var coverfname = '';
	var files = '';
	if (artifact.storage && artifact.storage.files){
		files = artifact.storage.files;
	} else if (artifact.info['extra-info'] && artifact.info['extra-info'].files){
		files = artifact.info['extra-info'].files;
	}

	for (var file in files){
		if (files[file].type == "coverArt" || files[file].type == "preview"){
			coverfname = files[file].fname;
		}
	}

	if (typeof files[0] === 'object')
		var mainURL = IPFS_URL + (oip ? artifact.storage.location : artifact.torrent) + '/' + files[0].fname;
	else if (artifact.info['extra-info'] && artifact.info['extra-info'].filename && typeof artifact.info['extra-info'].filename == 'string')
		var mainURL = IPFS_URL + artifact.torrent + '/' + artifact.info['extra-info'].filename;
	else if (oip)
		var mainURL = IPFS_URL + artifact.storage.location + '/' + files[0].fname;
	else
		var mainURL = '';

	var imageURL = IPFS_URL + (oip ? artifact.storage.location : artifact.torrent) + '/' + coverfname;

	mainURL = encodeURI(mainURL);
	imageURL = encodeURI(imageURL);

	if (!imageURL || imageURL == '' || !coverfname)
		imageURL = "https://" + domain + '/img/cover_placeholder.jpg';

	if (imageURL){
		metaTags += tagGen('og:image', imageURL);
	}

	if (typeof files[0] === 'object')
		var cost = files[0].sugPlay;
	else if (typeof artifact.payment.sug_tip == 'string')
		var cost = artifact.payment.sug_tip.split(',')[0];
	else
		var cost = '';

	if (artifact.type == "music"){
		//################################
		//            MUSIC
		//################################
		metaTags += tagGen('og:type', 'video.other');

		if (!cost){
			// Music URL tags
			metaTags += tagGen('og:audio', mainURL);
			metaTags += tagGen('og:audio:secure_url', mainURL);
			metaTags += tagGen('og:audio:type', 'audio/mpeg');

			// Optional Tags
			if (files[0])
				if(files[0].duration)
					metaTags += tagGen('music:duration', parseInt(files[0].duration));
		}

	} else if (artifact.type == "video"){
		//################################
		//            VIDEO
		//################################
		metaTags += tagGen('og:type', "video.other");

		// Video URL tags
		if (!cost){
			metaTags += tagGen('og:video', mainURL);
			metaTags += tagGen('og:video:secure_url', mainURL);
			metaTags += tagGen('og:video:type', "video/mp4");

			// Optional Tags
			if (files[0])
				metaTags += tagGen('og:video:duration', parseInt(files[0].duration));
		}

	} else if (artifact.type == "podcast"){
		//################################
		//            PODCAST
		//################################
		metaTags += tagGen('og:type', "music.radio_station");
		
	} else if (artifact.type == "pdf"){
		//################################
		//              PDF
		//################################
		metaTags += tagGen('og:type', "book");
		
	} else if (artifact.type == "movie"){
		//################################
		//            MOVIE
		//################################
		metaTags += tagGen('og:type', "video.movie");

		// Video URL tags
		if (!cost){
			metaTags += tagGen('og:video', mainURL);
			metaTags += tagGen('og:video:secure_url', mainURL);
			metaTags += tagGen('og:video:type', "video/mp4");
		}

		// Optional Tags
		if (files[0])
			metaTags += tagGen('og:video:duration', parseInt(files[0].duration));
		
	} else if (artifact.type == "thing"){
		//################################
		//            THING
		//################################
		metaTags += tagGen('og:type', "article");
		
	} else if (artifact.type == "html"){
		//################################
		//             HTML
		//################################
		metaTags += tagGen('og:type', "article");
		
	}

	return metaTags;
}

// Method Name: OIP_SEO.generateTCTags
// Description: Generates Twitter Card meta tags.
// Paramaters: 
// 		- oipArtifact: 	The OIP Artifact we will be generating the meta tags for.
// 		- url: 			The Permalink back to this page
// Returns: Returns Twitter Card compliant meta tags.
OIP_SEO.prototype.generateTCTags = function(oipArtifact, url, domain){
	var artifact = '';

	var oip = false;

	// alexandria-media
	if (oipArtifact['media-data']){
		artifact = oipArtifact['media-data']['alexandria-media'];
	} else { //OIP
		artifact = conformOIP(oipArtifact)['media-data']['alexandria-media'];
	}


	var metaTags = '';
	var IPFS_URL = 'https://ipfs.alexandria.io/ipfs/';
	var artifact_link = "https://alexandria.io/browser/" + url.split('/')[url.split('/').length -1];

	var coverfname = '';
	var files = '';
	if (artifact.storage && artifact.storage.files){
		files = artifact.storage.files;
	} else if (artifact.info['extra-info'] && artifact.info['extra-info'].files){
		files = artifact.info['extra-info'].files;
	}

	for (var file in files){
		if (files[file].type == "coverArt" || files[file].type == "preview"){
			coverfname = files[file].fname;
		}
	}

	if (files[0] == 'object')
		var mainURL = IPFS_URL + (oip ? artifact.storage.location : artifact.torrent) + '/' + files[0].fname;
	else if (artifact.info['extra-info'] && artifact.info['extra-info'].filename && typeof artifact.info['extra-info'].filename == 'string')
		var mainURL = IPFS_URL + artifact.torrent + '/' + artifact.info['extra-info'].filename;
	else if (oip)
		var mainURL = IPFS_URL + artifact.storage.location + '/' + files[0].fname;
	else
		var mainURL = '';

	var imageURL = IPFS_URL + (oip ? artifact.storage.location : artifact.torrent) + '/' + coverfname;

	mainURL = encodeURI(mainURL);
	imageURL = encodeURI(imageURL);


	if ( (artifact.type != "music") && (artifact.type != "video") ){
		//################################
		//             NON AUDIO/VIDEO ARTIFACTS
		//################################
		if (!coverfname) {
			metaTags += tagGen('twitter:card', "summary", true);
		} else {
			/* Need cover image dimensions saved with artifact metadata for large image summary cards
		    if ( (imgHeight >= 157) && (imgWidth >= 300) && (aspectRatio >= .5) && (aspectRatio <= 1) ) {
				metaTags += tagGen('twitter:card', "summary_large_image", true);
		    } else {
				metaTags += tagGen('twitter:card', "summary", true);
		    }
		    */
		    // In the meantime, just use the regular summary card
			metaTags += tagGen('twitter:card', "summary", true);
		}

	}
	metaTags += tagGen('twitter:site', "@alexandria");
	metaTags += tagGen('twitter:title', artifact.info.title.replace(/"/g,'\"'));
	metaTags += tagGen('twitter:description', artifact.info.description.replace(/(")/g,'\"').slice(0,140));

	if (!imageURL || imageURL == '' || !coverfname)
		imageURL = "https://" + domain + '/img/cover_placeholder.jpg';

	if (imageURL){
		metaTags += tagGen('twitter:image', imageURL);
	}

	if (typeof files == 'object')
		var cost = files[0].sugPlay;
	else if (typeof artifact.payment.sug_tip == 'string')
		var cost = artifact.payment.sug_tip.split(',')[0];
	else
		var cost = '';

	if ( (artifact.type == "music") || (artifact.type == "video") ){
		//################################
		//            AUDIO/VIDEO
		//################################

		var artist = (oip ? artifact.info.extraInfo.artist : artifact.info['extra-info'].artist);

		var priceStr = (cost ? '$' + cost : "Free!");
		if (files == 'object')
			var durStr = secondsToHms(files[0].duration);
		else
			var durStr = 0;

		if (!cost){
			var playerURL = artifact_link.slice(0, -(artifact_link.split('/')[artifact_link.split('/').length - 1].length)) + 'player/' + artifact_link.split('/')[artifact_link.split('/').length - 1];
			metaTags += tagGen('twitter:card', "player", true);
			metaTags += tagGen('twitter:player', playerURL, true);
			metaTags += tagGen('twitter:player:stream', mainURL, true);
			if (artifact.type == "video") {
				metaTags += tagGen('twitter:player:content_type', "video/mp4", true);
				metaTags += tagGen('twitter:player:width', "821", true);
				metaTags += tagGen('twitter:player:height', "461", true);
			} else {
				metaTags += tagGen('twitter:player:content_type', "audio/mpeg", true);
				metaTags += tagGen('twitter:player:width', "403", true);
				metaTags += tagGen('twitter:player:height', "190", true);
			}
		} else {

			metaTags += tagGen('twitter:card', "summary_large_image", true);
			metaTags += tagGen('twitter:label1', "Artist", true);
			metaTags += tagGen('twitter:data1', artist, true);
			metaTags += tagGen('twitter:label2', "Cost/Length", true);
			metaTags += tagGen('twitter:data2', priceStr + ' / ' + durStr, true);
		}

	} 

	return metaTags;
}

// Method Name: tagGen
// Description: Generate a single meta tag.
// Paramaters: 
// 		- prop: 	The meta proprety tag.
// 		- content: 	The meta content tag
// 		- nameFlag: If this is true, instead of using proprety as the tag, name will be used.
// Returns: Returns OpenGraph compliant meta tags.
var tagGen = function(prop, content, nameFlag){
	return '<meta ' + (nameFlag ? 'name' : 'property') + '="' + prop + '" content="' + content + '" />';
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m > 0 ? m + "m " : "";
    var sDisplay = s > 0 ? s + "s" : "";
    return hDisplay + mDisplay + sDisplay; 
}

function conformOIP(oipObject){
	// Pull out of casing
	var oip = oipObject["oip-041"];

	var alexandriaObject = {  
		"media-data":{  
			"alexandria-media":{  
				"torrent": oip.artifact.storage.location,
				"publisher": oip.artifact.publisher,
				"timestamp": oip.artifact.timestamp*1000,
				"type": oip.artifact.type,
				"info": {  
					"title": oip.artifact.info.title,
					"description":oip.artifact.info.description,
					"year": oip.artifact.info.year,
					"extra-info": oip.artifact.info.extraInfo ? oip.artifact.info.extraInfo : oip.artifact.info['extra-info']
				},
				"payment":oip.artifact.payment
			},
			"signature":oip.signature
		},
		"txid": oipObject.txid,
		"block": oipObject.block
	}

	alexandriaObject["media-data"]["alexandria-media"]["info"]["extra-info"]["DHT Hash"] = oip.artifact.storage.location;

	// Add artist name if it exists to the "publisher-name" for now. This is a hack as oip-041 standards do not include a publisher name. This might need to be updated in LibraryD to be included.
	if (oip.artifact.info.extraInfo && oip.artifact.info.extraInfo.artist){
		alexandriaObject['publisher-name'] = oip.artifact.info.extraInfo.artist;
	}

	if(oip.artifact.info['extra-info'] && oip.artifact.info['extra-info'].artist){
		alexandriaObject['publisher-name'] = oip.artifact.info['extra-info'].artist;
	}

	// Conform each file to be fixed.
	// Add files.
	if (oip.artifact.storage.files){
		var files = oip.artifact.storage.files;
		for (var i = 0; i < files.length; i++) {
			if (files[i].filename && !files[i].fname){
				files[i].fname = files[i].filename;
				delete files[i].filename;
			}
			if (files[i].displayname && !files[i].dname){
				files[i].dname = files[i].displayname;
				delete files[i].displayname;
			}
		}

		alexandriaObject["media-data"]["alexandria-media"]["info"]["extra-info"].files = [];
		alexandriaObject["media-data"]["alexandria-media"]["info"]["extra-info"].files = files;
	}

	return alexandriaObject;
}

// Expose OIP_SEO and all methods.
module.exports = new OIP_SEO();