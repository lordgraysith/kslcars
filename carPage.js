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
	, getSpec;

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

	specs = document.getElementById('specificationsTable').children[0];

	//set price
	(function(){
		var element = document.getElementsByClassName('price')[0];
		price = element.textContent;
	}());

	//set phone number
	(function(){
		var phLink = document.getElementsByClassName('contactPhone')[0].children[0];
		phoneNumber = phLink.childNodes[4].data.trim();
	}());

	url = document.location.href;
	adID = document.getElementById('ad_id').textContent;

	make = getSpec('Make');
	year = getSpec('Year');
	model = getSpec('Model');
	mileage = getSpec('Mileage');

	return{
		carDetails: {
			price: price
			, model: model
			, make: make
			, url: url
			, phoneNumber: phoneNumber
			, year: year
			, mileage: mileage
			, adID: adID
		}
	};
}());