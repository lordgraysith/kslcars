var DataMiner = (function(){
	var init
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
		getCarPages: function(){
			return carPages;
		}
		, getPageList: function(){
			return pageLists;
		}
	};
}());