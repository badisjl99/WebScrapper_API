function frequency(text, options) {
    options = options || {};
    options.caseSensitive = options.caseSensitive || false;
    var frequencies = {},
        textParts = [],
        part = null;
    /* Only get frequency if input is string with content */
    if((typeof text === 'string') && (text.length > 0)){
        /* Returns text with HTML, tabs, new lines, punctuation, and extra spaces removed */
        function stripText(text) {
            return text.replace(/<[^>]+>|[!.?,;:'"-]/g,'').replace(/\r?\n|\r|\s+|\t/g, ' ').trim();
        }
        /* Get words in text */
        text = (options.caseSensitive ? text : text.toLowerCase());
        textParts = stripText(text).split(' ');
        for(part in textParts) {
            part = textParts[part];
            if (typeof frequencies[part] === 'undefined') {
                frequencies[part] = 1;
            } else {
                frequencies[part] += 1;
            }
        }
    }
    return frequencies;   
}
module.exports = frequency;