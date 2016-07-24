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
	var params = { 
		category: "Appliances",
		search: tags
		//need to fill in from checkbox input Category: ,
	};
	
	$.ajax({
		url: "http://localhost:8888/amazonphpapi/index.php",
		data: params,
		type: "GET"
	})
	.done(function(result) {
		it = JSON.parse(result);
		items = it.Items.Item;
		console.log(items);
		$(".results-table").show();
		for (i=0;i<items.length;i++) {
			var url = items[i].DetailPageURL;
			var title = items[i].ItemAttributes.Title;
    		//console.log(eRequest);
			var salesRank = items[i].SalesRank;
			var avgReview = items[i].Review;
			var price = items[i].OfferSummary.LowestNewPrice.FormattedPrice;
			var category = "placeholder amazon category";
			var ebayTitle = " ";
			var ebayShipping = " ";
			var ebayPrice = " ";
			rowEntries = [title, url, salesRank, avgReview, price, category, ebayTitle, ebayShipping, ebayPrice];
			ebayRequest(rowEntries);
		}
	});

	//.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
	//	var errorElem = showError(error);
	//	$('.search-results').append(errorElem);
	//});
}



function ebayRequest(ebayTag) {
	var params = {
		"OPERATION-NAME": "findItemsByKeywords",
		"SERVICE-VERSION": "1.0.0",
		"SECURITY-APPNAME": "SeanKoch-APICapst-PRD-313d8b941-9995d360",
		"GLOBAL-ID": "EBAY-US",
		"RESPONSE-DATA-FORMAT": "JSON",
		"callback": "_cb_findItemsByKeywords",
		//Why won't ebayTag work for this specific search phrase?
		//it won't work for 'coffee', but will work for 'blender'
		//something to do with the string?
		//in testing this, certain strings return undefined, particularly those using -
		"keywords": ebayTag[0],
		"paginationInput.entriesPerPage": "5"
	};
	
	$.ajax({
		url: "http://svcs.ebay.com/services/search/FindingService/v1",
		data: params,
		dataType: "jsonp",
		type: "GET"
	})
	.done(function(result) {
		console.log(result);
		//toMakeAvgEbayPrice=0;
		priceToAvg = 0;
		for (i=0;i<5;i++) {
		ebayPrice = parseFloat(result.findItemsByKeywordsResponse[0].searchResult[0].item[i].sellingStatus[0].currentPrice[0].__value__);
		priceToAvg += ebayPrice;
		}
		avgEbayPrice = priceToAvg/5;
		avgEbayPrice = avgEbayPrice.toFixed(2);
		//console.log(toMakeAvgEbayPrice);
		ebayTitle = result.findItemsByKeywordsResponse[0].searchResult[0].item[0].title[0];
		ebayShipping = result.findItemsByKeywordsResponse[0].searchResult[0].item[0].shippingInfo[0].shippingServiceCost[0].__value__;
		ebayArray = [ebayTitle, ebayShipping, avgEbayPrice];
		console.log(ebayArray);
		for (i=6; i<ebayTag.length;i++) {
			ebayTag[i] = ebayArray[i-6];
		}
		makeRow(ebayTag);
	});
//	return ebayArray;
}

function makeRow(rowArray) {
	var newRow = $(".table-data").clone();
	$(".results-table").show();
		var titleSpot = newRow.find('.title');
    	titleSpot.text(rowArray[0]);
		var salesRankSpot = newRow.find('.rank');
		salesRankSpot.text(rowArray[2]);
		var avgReviewSpot = newRow.find('.rating');
		avgReviewSpot.text(rowArray[3]);
		var priceSpot = newRow.find('.price');
		priceSpot.text(rowArray[4]);
		var categorySpot = newRow.find(".category");
		categorySpot.text(rowArray[5]);
		var ebayName = newRow.find(".ebay-name");
		ebayName.text(rowArray[6]);
		var ebayPriceSpot = newRow.find(".ebay-price");
		ebayPriceSpot.text("$"+rowArray[8]);
		ebayShipping = newRow.find(".ebay-shipping");
		ebayShipping.text("$"+rowArray[7]);
		$(".results-table").append(newRow);
}