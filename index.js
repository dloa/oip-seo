
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

	metaTags += this.generateOGTags(oipArtifact, url, domain);
	metaTags += this.generateTCTags(oipArtifact, url, domain);

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
		artifact = oipArtifact['oip-041'].artifact;
		oip = true;
	}


	var metaTags = '';
	var IPFS_URL = 'https://ipfs.alexandria.io/ipfs/'

	metaTags += tagGen('og:site_name', "Alexandria.io");
	metaTags += tagGen('og:url', url);
	metaTags += tagGen('og:title', artifact.info.title.replace(/"/g,'\"'));
	metaTags += tagGen('og:description', artifact.info.description.replace(/(")/g,'\"'));

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

	if (!imageURL || imageURL == '' || !coverfname)
		imageURL = "http://" + domain + '/img/cover_placeholder.jpg';

	if (imageURL){
		metaTags += tagGen('og:image', imageURL);
	}

	if (typeof files == 'object')
		var cost = files[0].sugPlay;
	else if (typeof artifact.payment.sug_tip == 'string')
		var cost = artifact.payment.sug_tip.split(',')[0];
	else
		var cost = '';

	if (artifact.type == "music"){
		//################################
		//            MUSIC
		//################################
		metaTags += tagGen('og:type', "music.song");


		if (!cost){
			// Music URL tags
			metaTags += tagGen('og:video', mainURL);
			metaTags += tagGen('og:video:secure_url', mainURL);
			metaTags += tagGen('og:video:type', "audio/mpeg");
			metaTags += tagGen('og:video:height', "30");

			// Optional Tags
			metaTags += tagGen('video:duration', parseInt(files[0].duration));
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
			metaTags += tagGen('video:duration', parseInt(files[0].duration));
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

		// Music URL tags
		if (!cost){
			metaTags += tagGen('og:video', mainURL);
			metaTags += tagGen('og:video:secure_url', mainURL);
			metaTags += tagGen('og:video:type', "video/mp4");
		}

		// Optional Tags
		metaTags += tagGen('video:duration', parseInt(files[0].duration));
		
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
		artifact = oipArtifact['oip-041'].artifact;
		oip = true;
	}


	var metaTags = '';
	var IPFS_URL = 'https://ipfs.alexandria.io/ipfs/'

	metaTags += tagGen('og:site_name', "Alexandria.io");
	metaTags += tagGen('og:url', url);
	metaTags += tagGen('og:title', artifact.info.title.replace(/"/g,'\"'));
	metaTags += tagGen('og:description', artifact.info.description.replace(/(")/g,'\"'));

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

	if (!imageURL || imageURL == '' || !coverfname)
		imageURL = "http://" + domain + '/img/cover_placeholder.jpg';

	if (imageURL){
		metaTags += tagGen('og:image', imageURL);
	}

	if (typeof files == 'object')
		var cost = files[0].sugPlay;
	else if (typeof artifact.payment.sug_tip == 'string')
		var cost = artifact.payment.sug_tip.split(',')[0];
	else
		var cost = '';

	if (artifact.type == "music"){
		//################################
		//            MUSIC
		//################################

		var artist = (oip ? artifact.info.extraInfo.artist : artifact.info['extra-info'].artist);

		var priceStr = (cost ? '$' + cost : "Free!");
		if (files == 'object')
			var durStr = secondsToHms(files[0].duration);
		else
			var durStr = 0;

		metaTags += tagGen('twitter:card', "summary_large_image", true);

		metaTags += tagGen('twitter:label1', "Artist", true);
		metaTags += tagGen('twitter:data1', artist, true);
		metaTags += tagGen('twitter:label2', "Cost/Length", true);
		metaTags += tagGen('twitter:data2', priceStr + ' / ' + durStr, true);

	} else if (artifact.type == "video"){
		//################################
		//            VIDEO
		//################################
		var split = url.split('/');

		if (!cost){
			metaTags += tagGen('twitter:card', "player", true);
			metaTags += tagGen('twitter:player', "http://" + domain + '/player/' + split[4], true);
			metaTags += tagGen('twitter:player:stream', mainURL, true);
			metaTags += tagGen('twitter:player:content_type', "video/mp4", true);
			metaTags += tagGen('twitter:player:width', "720", true);
			metaTags += tagGen('twitter:player:height', "480", true);
		}
		
	} else if (artifact.type == "podcast"){
		//################################
		//            PODCAST
		//################################
		
	} else if (artifact.type == "pdf"){
		//################################
		//              PDF
		//################################
		
	} else if (artifact.type == "movie"){
		//################################
		//            MOVIE
		//################################
		
	} else if (artifact.type == "thing"){
		//################################
		//            THING
		//################################
		
	} else if (artifact.type == "html"){
		//################################
		//             HTML
		//################################
		
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

// Expose OIP_SEO and all methods.
module.exports = new OIP_SEO();