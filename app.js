const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const stopword = require('stopword');

const app = express();
const port = 3000;


app.use(express.static('public'));
app.use(express.json());


const websites = {
  'https://swentr.site': ['span', { 'class': 'main-promobox__link' }],
  'https://edition.cnn.com': ['span', { 'data-editable': 'headline' }],
  'https://www.aljazeera.com': ['span', {}],
  'https://news.sky.com/world': ['span', {}],
  'https://www.france24.com/en/': ['p', { 'class': 'article__title' }],
  'https://www.dw.com/en/top-stories/s-9097': ['span', {}],
  'https://www.theguardian.com/international': ['a', { 'class': 'u-faux-block-link__overlay js-headline-text' }],
  'https://www.cbsnews.com': ['h4', { 'class': 'item__hed ' }],
  'https://abcnews.go.com': [['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], {}],
  'https://apnews.com': [['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], {}],
  'https://www.independent.co.uk/news/world?CMP=ILC-refresh': ['a', { 'class': 'title' }],
};



const stopWords = ["the", "","2024","2023","2025","2026","and", "to", "of", "he", "was", "you", "world", "man", "min", "by", "an", "has", "show",
"she", "it", "they", ".", "-", "never", "should", "have", "in", "is", "top",
"on", "a", "for", "new", "what", "us", "says", "his", "how", "as","no.", "with",
"on", "about", "be", "million", "time", "this", "report", "–","say","years", "are", "record",
"after", "but", "that", "from", "at", "world's", "now", "we", "i'm", "world",
"January", "February", "March", "April","it's","its", "who", "may", "June", "July", "August",
"September", "October", "November", "December", "jazeera", "al", "2023", "section",
"next", "skip", "more", "ago","year’s","news", "hours", "over", "latest", "media", "why", "his", "her", "could", "still",
"first", "before", "october"]; 




async function scrapeWebsite(url, elementConfig, wordFrequency) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
  
      const elements = $(elementConfig[0], elementConfig[1]);
  
      elements.each((index, element) => {
        const text = $(element).text().trim();
        const words = text.split(/\s+/); // Split text into words
        words.forEach((word) => {
          const lowercaseWord = word.toLowerCase();
          if (!stopWords.includes(lowercaseWord)) {
            wordFrequency[lowercaseWord] = (wordFrequency[lowercaseWord] || 0) + 1;
          }
        });
      });
    } catch (error) {
      console.error(`Error scraping ${url}: ${error.message}`);
    }
  }
  
  async function getTopWords() {
    const wordFrequency = {};
  
    for (const [url, elementConfig] of Object.entries(websites)) {
      await scrapeWebsite(url, elementConfig, wordFrequency);
    }
  
    const wordFrequencyArray = Object.entries(wordFrequency);
  
    wordFrequencyArray.sort((a, b) => b[1] - a[1]);
  
    const topWords = wordFrequencyArray.slice(0, 10);
  
    return topWords;
  }
  
  app.get('/top-words', async (req, res) => {
    try {
      const topWords = await getTopWords();
      res.json({ topWords });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });