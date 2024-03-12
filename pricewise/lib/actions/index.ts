"use server" //backend and not to be interactable with for client

import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import Product from "../models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";


export async function scrapeAndStoreProduct(productURL : string ){
    if(!productURL)//base case
        return;

    try {
        connectToDB();
        const scrapedProduct = await scrapeAmazonProduct(productURL);
        if(!scrapedProduct) 
            return;

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({url: scrapedProduct.url });
        if(existingProduct){
            const updatedPriceHistory : any = [
                ...existingProduct.priceHistory,
                {price: scrapedProduct.currentPrice}
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            {url: scrapedProduct.url},   
            product,
            {upsert: true, new : true},//if object does not yet exist, create new one
        );
        revalidatePath(`/products/${newProduct._id}`);
    } catch (error: any) {  
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
} 

export async function getProductById(productId : string){
    try {
        connectToDB();

        const product = await Product.find({ _id: productId });
        if(!product)
            return null;
        return product;
    } catch (error) {
        console.log(error)
    }
}

export async function getAllProducts(){
    try {
        connectToDB();

        const products = await Product.find();
        return products;
    } catch (error) {
        console.log(error);
    }
}