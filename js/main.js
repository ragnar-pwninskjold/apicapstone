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
	var params = { 
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
		it = JSON.parse(result);
		items = it.Items.Item;
		console.log(items);
		$(".results-table").show();
			for (i=0;i<9;i++) {
			var newRow = $(".table-data").clone();
			//attach url to title eventually
			var url = items[i].DetailPageURL;
			var title = items[i].ItemAttributes.Title;
			var titleSpot = newRow.find('.title');
    		titleSpot.text(title);
			var salesRank = items[i].SalesRank;
			var salesRankSpot = newRow.find('.rank');
			salesRankSpot.text(salesRank);
			var avgReview = items[i].Review;
			var avgReviewSpot = newRow.find('.rating');
			avgReviewSpot.text(avgReview);
			var price = items[i].OfferSummary.LowestNewPrice.FormattedPrice;
			var priceSpot = newRow.find('.price');
			priceSpot.text(price);
			var categorySpot = newRow.find(".category");
			categorySpot.text("placeholder-category");
			var ebaySpot = newRow.find(".ebay-name");
			ebaySpot.text("placeholder ebay name");
			var ebayPriceSpot = newRow.find(".ebay-price");
			ebayPriceSpot.text("placeholder ebay price");
			$(".results-table").append(newRow);
		}
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



*/



