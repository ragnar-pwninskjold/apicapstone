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
		//ebayRequest();

	});
});

function amazonRequest(tags) {
	params = { 
		category: "Appliances",
		search: tags
		//need to fill in from checkbox input Category: ,
	};
	
	$.ajax({
		url: "http://localhost:8888/amazonphpapi/index.php",
		data: params,
		type: "GET",
	})
	.done(function(result) {

		console.log(JSON.parse(result));

	});
	//.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
	//	var errorElem = showError(error);
	//	$('.search-results').append(errorElem);
	//});
}
/*
function ebayRequest() {
	var url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME=SeanKoch-APICapst-SBX-d09b8ef6f-e9696e94";
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&callback=_cb_findItemsByKeywords";
    url += "&REST-PAYLOAD";
    url += "&keywords=harry%20potter";
    url += "&paginationInput.entriesPerPage=3";
	console.log(url); 
	}

	var params {}



/*
function makeString(para, fullParams) {
	var keyToSign='';
	var theKey = Object.keys(fullParams);
	console.log(theKey);
	for (i=0; i<para.length-1; i++) {
		var keySpot = theKey[i]  + "=" + para[i] + "&";
	    keyToSign = keyToSign + keySpot;
	    }
	for (i=0; i<1; i++) {
		keySpot = theKey[para.length-1]+"="+para[para.length-1];
		keyToSign = keyToSign + keySpot;
	}
	console.log(keyToSign);
	return keyToSign;
}
*/

