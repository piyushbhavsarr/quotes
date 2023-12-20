const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Show Loading
function loading() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide Loading
function complete() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Save Quote to Azure Blob Storage
async function saveQuoteToBlobStorage(quoteData) {
    const blobStorageUrl = 'YOUR_BLOB_STORAGE_URL'; // Replace with your Blob Storage URL
    try {
        await fetch(blobStorageUrl, {
            method: 'POST',
            body: JSON.stringify(quoteData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error saving quote to Blob Storage:', error);
    }
}

// Trigger Sentiment Analysis Azure Function
async function triggerSentimentAnalysis(quote) {
    const functionUrl = 'YOUR_AZURE_FUNCTION_URL'; // Replace with your Azure Function URL
    try {
        await fetch(functionUrl, {
            method: 'POST',
            body: JSON.stringify({ quote }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error triggering sentiment analysis:', error);
    }
}

// Fetch New Quote
async function getNewQuote() {
    loading();
    const proxyUrl = 'https://dummyjson.com/quotes'; // Replace with your quote API URL or service
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const qData = data.quotes[Math.floor(Math.random() * 31)];
        
        // Save quote to Azure Blob Storage
        await saveQuoteToBlobStorage(qData);
        
        // Trigger sentiment analysis
        await triggerSentimentAnalysis(qData.quote);

        authorText.innerText = qData.author || 'Unknown';
        quoteText.innerText = qData.quote;

        complete();
    } catch (error) {
        console.error('Error getting new quote:', error);
        getNewQuote();
    }
}

// Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getNewQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getNewQuote();
