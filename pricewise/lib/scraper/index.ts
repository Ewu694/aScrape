import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice } from '../utils';


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

        const title = $('#productTitle').text().trim();//uses cheerio to extract the product title from the response data from website by having it search for an HTML element with the ID "productTitle". This can be changed to check other things
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
          );
      
          const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
          );

        console.log({title, currentPrice, originalPrice}) //prints out the title of the product (testing)
    } catch (error : any) {
        throw new Error(`Failed to scrape product: ${error.message}`)
    }
}