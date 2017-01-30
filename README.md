#Amazon-eBay API Smashup 

#Introduction

This application allows a user to search a product and compare results across Amazon and eBay product listings. Price arbitraging is a popular online framework for making money, by purchasing products at a low price, often through overseas manufacturers, and selling at much higher prices in the United States through services such as Amazon and eBay. There are several variations of arbitraging, though most of these business models tend to rely on manual market research by business operators, in an attempt to identify specific products with high price differentials. The Amazon-eBay API smashup is a cross-platform arbitrage tool, which takes a user string, a product category, and other metrics, and returns price comparisons of the same product across the two services. While this application is in v1, it still provides a good deal of automation and quick opportunity scans across various product areas.

#Use Cases

This application was developed to assist users in finding opportunities for arbitrage pricing across the Amazon and eBay platforms. The application has two primary use cases:

1. The casual user, that uses the application for personal shopping comparisons. In this use case, a user can simply search a product they intend to purchase on Amazon or Ebay, and can compare the  prices for this product on the other platform. Depending upon the type of product, there can be significant price differences between Amazon and eBay, which can offer meaningful savings for a typical "casual user".

2. The owner/operator of an arbitrage business, that uses this product for business opportunity scanning. In this use case, the business can search for particular strings that they might have interest in. What makes this product particularly useful is that one can also search products by average Amazon Seller Rank and a price range, which can help in developing a monthly sales estimate for a given product category. This data could then easily be exported to a pre-existing excel spreadsheet for easy opportunity identifications.
  
#Technical Overview

Stack/technology used in this project:

* HTML
* CSS
* Javascript
* jQuery
* Bootstrap UI

The technical implementation of this product is rather straightforward:

* A user enters a search term into the input box, and selects a category
* If they choose, a user can also use the sliders to specify a price range, as well as a sales-rank range
* The above information is given to Amazon's API, which returns an array of objects meeting the specified parameters
* For each resulting array, the product is searched through the eBay API
* To ensure relevant results, prices are only returned on completed eBay listings with actual sales
* Each resulting match is appeneded to the DOM using jQuery

#RoadMap

This product is currently v1. Below is an overview of intended feature implementation:

###v2

* Expand available categories to include more Amazon product categories
* Allow users to include various facets of shipping parameters in their search
* Output with average product rating
* Allow users to export results to an excel-file

###v3

* Create a dashboard and authentication/user account feature, to allow users to save searches and view them later
* Create an algorithm to predict sales volume based upon average seller-rank and product category
* Add more websites for price-comparisons
