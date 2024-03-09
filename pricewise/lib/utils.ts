export function extractPrice(...elements: any){
    for(const element of elements){
        const priceText = element.text().trim();

        if(priceText)
            return priceText.replace(/[^\d.]/g, ' ');//removes all non-digit characters from the price text
    }
    return '';
}