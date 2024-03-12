import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";


export async function scrapeAmazonProduct(url : string){
    if(!url) //base case
        return;
    
    //BrightData Configuration to make sure we can use Brightdata to scrape properly
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;//port used for brightdata
    const session_id = (1000000 * Math.random()) |0; //randomized session IDs
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: "brd.superproxy.io",
        port,
        rejectUnauthorized: false,
    }

    try {//where product is fetched 
        const response = await axios.get(url, options);//only done after our proxy configuration
        const $ = cheerio.load(response.data);

        const title = $("#productTitle").text().trim();//uses cheerio to extract the product title from the response data from website by having it search for an HTML element with the ID "productTitle". This can be changed to check other things
       
        const currentPrice = extractPrice(
            $("span[data-a-color=price] span.a-offscreen").first(),
            $(".priceToPay span.a-price-whole").first(),
            $(".a.size.base.a-color-price"),
            $(".a-button-selected .a-color-base"),
        );
      
        const originalPrice = extractPrice(
            $("span[data-a-strike=true] span.a-offscreen").first()
        );

        const outOfStock = $("#availability span").text().trim().toLowerCase() === "currently unavailable.";

        const images = 
            $("#imgBlkFront").attr("data-a-dynamic-image") || 
            $("#landingImage").attr("data-a-dynamic-image") ||
            "{}"   
      
        const imageUrls = Object.keys(JSON.parse(images));
      
        const currency = extractCurrency($(".a-price-symbol"))
        const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
      
        const description = extractDescription($)
      
        // Construct data object with scraped information
        const data = {
            url,
            currency: currency || "$",
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: "category",
            reviewsCount:100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice )|| Number(originalPrice),
        }
        return data;

    } catch (error : any) {
        throw new Error(`Failed to scrape product: ${error.message}`)
    }
}