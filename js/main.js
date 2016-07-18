$(document).ready(function() {

	//alert("This tool will enable you to search Amazon.com for a string of text in a specific category, and will return opportunities for price arbitrage given Alibaba wholesaler prices for a given product. For example: If you chose 'Home and furniture' category and entered a search string with a range for prices and average sales rank of the product you wanted, it would return a table of opportunities to buy from Alibaba wholesaler and sell through Amazon. It will calculate the total expected profit margin as well");

 $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 100,
      values: [0, 100 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );


$( "#slider-range2" ).slider({
      range: true,
      min: 0,
      max: 100,
      values: [0, 100 ],
      slide: function( event, ui ) {
        $( "#amount2" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount2" ).val($( "#slider-range2" ).slider( "values", 0 ) +
      " - " + $( "#slider-range2" ).slider( "values", 1 ) );

//submit for the text string
$('.inputbox').submit( function(event){
		event.preventDefault();
		// zero out results if previous search has run
		// get the value of the tags the user submitted
		var tag = $(this).find("input[id='sell']").val();
		console.log(tag);
		amazonRequest(tag);

	});
});

function amazonRequest(tags) {
	params = { 
		AssociateTag: 'apicapstone-20',
		AWSAccessKeyId: 'AKIAJKYYBVNYWK2ZRVPA',
		Keywords: "Coffee",
		Operation: 'ItemLookup',
		ResponseGroup: "'ItemAttributes', 'SalesRank'",
		SearchIndex: 'Appliances',
		Service: 'AWSECommerceService',
		Sort: 'price',
		Timestamp: $.now()
	};

	var parameters = [params.AssociateTag, params.AWSAccessKeyId, params.Keywords, params.Operation, params.ResponseGroup,  params.SearchIndex, params.Service, params.Sort, params.Timestamp];
	var keyToAppend = signString(parameters);
	var appendedKey = "AWSAccessKeyId="+keyToAppend;
	var SecretKeyAccessId = "J8/0owwre39h5kX6Jht1OsMt+UgoeeMRn9QmrAEW";
	var signThis = 
		"GET\n" +
		"webservices.amazon.com\n" +
		"/onca/xml\n" +
		appendedKey;
	
	var hash = CryptoJS.HmacSHA256(signThis, SecretKeyAccessId);
	console.log(btoa(hash));
	$.ajax({
		url: "https://webservices.amazon.com/onca/xml",
		data: parameters,
		dataType: "xml",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object

			console.log(result);
			//$.each(result.items, function(i, item) {

			//console.log(top);
			//$(".results").append(showTop(item));
			//});
	});
	//.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
	//	var errorElem = showError(error);
	//	$('.search-results').append(errorElem);
	//});
}

function signString (para) {
	$.each(para, function(i, item) {
		var keySpot = item;
		keyToSign = item + "&";
	});
	//console.log(keyToSign);
	return keyToSign;
}