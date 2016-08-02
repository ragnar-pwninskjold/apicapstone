pageCount = 1;
$(document).ready(function() {

	//alert("This tool will enable you to search Amazon.com for a string of text in a specific category, and will return opportunities for price arbitrage given Alibaba wholesaler prices for a given product. For example: If you chose 'Home and furniture' category and entered a search string with a range for prices and average sales rank of the product you wanted, it would return a table of opportunities to buy from Alibaba wholesaler and sell through Amazon. It will calculate the total expected profit margin as well");

	$( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [0, 500 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );


	$( "#slider-range2" ).slider({
      range: true,
      min: 0,
      max: 1000,
      values: [0, 1000],
      slide: function( event, ui ) {
        $( "#amount2" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount2" ).val($( "#slider-range2" ).slider( "values", 0 ) +
      " - " + $( "#slider-range2" ).slider( "values", 1 ) );

	//submit for the text string
	$('.inputbox').submit(function(event){
		event.preventDefault();
		var tag = $(this).find("input[id='sell']").val();
		var cat = $('input:checked').val();
		console.log(cat);
		var priceRange = $('#slider-range').slider('option', 'values');
		var salesRange = $('#slider-range2').slider('option', 'values');
		//console.log(priceRange);
		//console.log(salesRange);

		amazonRequest(tag, cat, priceRange, salesRange);
		//add in counter for page #. Make a global page count for total and current
		$(".templates .more-button").appendTo("body");
	});

	$(".more-button").on("click", function() {
		pageCount++;
		var tag = $("input[id='sell']").val();
		var cat = $('input:checked').val();
		var priceRange = $('#slider-range').slider('option', 'values');
		var salesRange = $('#slider-range2').slider('option', 'values');
		amazonRequest(tag, cat, priceRange, salesRange, pageCount);
	});
});

rCount = 0;

function amazonRequest(tags, cats, pRange, sRange, pgCount) {
	var params = { 
		category: cats,
		search: tags,
		page: pgCount //global page count
	};


	$.ajax({
		url: "http://tjstalcup.site/apac-php/",
		data: params,
		type: "GET"
	})
	.done(function(result) {
		//console.log(result);
		it = JSON.parse(result);
		items = it.Items.Item;
		console.log(items);
		for (i=0;i<items.length;i++) {
			var url = items[i].DetailPageURL;
			var title = items[i].ItemAttributes.Title;
			var salesRank = items[i].SalesRank;
			if (salesRank < sRange[0] || salesRank > sRange[1]) {
				console.log("sales rank out of range!");
			}
			else{
				rCount++;
				var avgReview = items[i].Review;
				var price = items[i].OfferSummary.LowestNewPrice.FormattedPrice;
				var priceInt = (items[i].OfferSummary.LowestNewPrice.Amount)/100;
				if (priceInt < pRange[0] || priceInt > pRange[1]){
					console.log("price out of range!");
				}
				else {
					var category = cats;
					var ebayTitle = " ";
					var ebayPrice = " ";
					rowEntries = [title, url, salesRank, avgReview, price, category, ebayTitle, ebayPrice];
					ebayRequest(rowEntries);
				}
			}
		}
		if (rCount<10) {
			console.log(rCount);
			//amazonRequest(tags, cats, pRange, sRange, pageNav);
			//print this to the page to say 'x'/10 results matched filters

		}
		else {
			console.log(rCount + "else");

		}
	
	});
}





function ebayRequest(ebayTag) {
	var params = {
		"OPERATION-NAME": "findCompletedItems",
		"SERVICE-VERSION": "1.0.0",
		"SECURITY-APPNAME": "SeanKoch-APICapst-PRD-313d8b941-9995d360",
		"GLOBAL-ID": "EBAY-US",
		"RESPONSE-DATA-FORMAT": "JSON",
		"callback": "_cb_findCompletedItems",
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
		var ebayResult = result.findCompletedItemsResponse[0].searchResult[0];
		if (typeof(ebayResult.item)!=="undefined") { 

			priceToAvg = 0;
			for (i=0;i<ebayResult.item.length;i++) {//and a spot for selling status here too
					ebayPrice = parseFloat(ebayResult.item[i].sellingStatus[0].currentPrice[0].__value__);
					priceToAvg += ebayPrice;
			}
			
			avgEbayPrice = priceToAvg/ebayResult.item.length;
			avgEbayPrice = avgEbayPrice.toFixed(2);
			ebayTitle = ebayResult.item[0].title[0];
			
			ebayArray = [ebayTitle, avgEbayPrice];
			for (i=6; i<ebayTag.length;i++) {
				ebayTag[i] = ebayArray[i-6];
			}
		}
		else {
			ebayTag[6] = "Not Found";
		}
		makeRow(ebayTag);

	});
//	return ebayArray;
}

function makeRow(rowArray) {
	var newRow = $(".templates .table-data").clone();
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
		ebayPriceSpot.text("$"+rowArray[7]);
		$(".results-table").append(newRow);
}