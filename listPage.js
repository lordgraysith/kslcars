var DataMiner = (function(){
	var init
	, ready = false
	, carPages = []
	, pageLists = [];

	init = function(){
		var iter
		, pageListings
		, carListings = document.getElementsByClassName('srp-listing-title');
		for(iter = 0; iter < carListings.length; iter++){
			carPages.push(carListings[iter].children[0].href);
		}

		pageListings = document.getElementsByClassName('solidNavBar')[0].children;
		for(iter = 0; iter < pageListings.length; iter++){
			if(pageListings[iter].href){
				pageLists.push(pageListings[iter].href);
			}
		}
		ready = true;
	};

	if(document.readyState === 'complete'){
		init();
	}
	else {
		document.onreadystatechange = function(){
			if(document.readyState === 'complete'){
				init();
			}
		};
	}

	return {
		getPages: function(){
			if(!ready){
				throw {message: 'Document not ready, change your strategy'};
			}
			return {
				carPages: carPages
				, pageLists: pageLists
			};
		}
	};
}());