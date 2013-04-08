var DataMiner = (function(){
	var price
	, make
	, model
	, url
	, phoneNumber
	, year
	, mileage
	, adID
	, specs
	, getSpec
	, ready = false;

	getSpec = function(specName){
		var iter
		, row
		, rowName
		, rowValue
		, result = 'Not Specified';

		for(iter = 0; iter < specs.children.length; iter++){
			row = specs.children[iter];
			rowName = row.children[0].textContent.replace(':','');
			rowValue = row.children[1].textContent;
			if(specName === rowName){
				result = rowValue;
				break;
			}
		}

		return result;
	};

	init = function(){
		specs = document.getElementById('specificationsTable').children[0];

		//set price
		(function(){
			var element = document.getElementsByClassName('price')[0];
			price = parseInt(element.childNodes[0].data.replace(',', '').replace('$', ''));
		}());

		//set phone number
		(function(){
			var phLink = document.getElementsByClassName('contactPhone')[0].children[0];
			phoneNumber = phLink.childNodes[4].data.trim();
		}());

		url = document.location.href;
		adID = document.getElementById('ad_id').textContent;

		make = getSpec('Make');
		year = parseInt(getSpec('Year'));
		model = getSpec('Model');
		mileage = parseInt(getSpec('Mileage').replace(',', ''));
		
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

	return{
		getCarDetails: function(){
			if(!ready){
				throw {message: 'Document not ready, change your strategy'};
			}
			return {
				price: price
				, model: model
				, make: make
				, url: url
				, phoneNumber: phoneNumber
				, year: year
				, mileage: mileage
				, adID: adID
			};
		}
	};
}());