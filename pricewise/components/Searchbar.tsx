"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react'

const isValidAmazonProductURL = (url:string) => { //will be changed later to suit whatever we are looking for 
    try {
        const parsedURL = new URL(url);
        const hostName = parsedURL.hostname;

        //check if hostname contains amazon.com or amazon.country code
        if(hostName.includes("amazon.") || hostName.endsWith('amazon'))//if the hostname of a given link includes amazon, then return true to show that its a valid amazon link
            return true;

    } catch (error) { //else return false
        return false;
    }
    return false; //default case
  }

const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() //default behavior of a webpage after a search is to just reload the page, but this will prevent that 
    const isValidLink = isValidAmazonProductURL(searchPrompt);//output of whatever check is implemented in isValidAmazonProduct
    if(!isValidLink)
        return alert('Please Provide a Valid Amazon Link')
    
    try {
        setIsLoading(true);//if something goes wrong and website is loading too long, set to true

        const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
        console.log(error) //if error in loading, show it
    } finally{ //finally is something that happens either way regardless of the try and catch
        setIsLoading(false);
    }
  }

  
  return (
    <form 
        className="flex flex-wrap gap-4 mt-12" 
        onSubmit={handleSubmit}
    >
        <input
            type="text"
            value={searchPrompt}//this allows user to change the value in search and actually search something
            onChange={(e) => setSearchPrompt(e.target.value)} //makes it so we can go into our handlesubmit 
            placeholder="Enter Product Link"//placeholder before user enters something
            className="searchbar-input"
        />

        <button 
            type="submit" 
            className="searchbar-btn" //searchbar button
            disabled={searchPrompt === ""} //if search bar is empty, don't allow search button to be used
        >
                {isLoading ? 'Searching...' : 'Search'/* while loading, put search button in searching, otherwise, it should be in search*/}
        </button>
    </form>
  )
}

export default Searchbar
