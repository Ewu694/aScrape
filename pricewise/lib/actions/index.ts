"use server" //backend and not to be interactable with for client

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productURL : string ){
    if(!productURL)//base case
        return;

    try {
        const scrapedProduct = await scrapeAmazonProduct(productURL);
    } catch (error: any) {  
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}   