const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuth = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuth.algo("web/WikipediaParser/0.1.2?timeout=300")
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()
        
        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent(content) {
        const withoutBlankLines = removeBlankLines(content.sourceContentOriginal)
        const withoutMarkdown = removeMarkDown(withoutBlankLines)
        const withoutDates = removeDates(withoutMarkdown)
        content.sourceContentSanitized = withoutDates

        function removeBlankLines(text) {
            const allLines = text.split('\n')
            const withoutBlankLines = allLines.filter((line) => {
                if (line.trim().length === 0) {
                    return false
                }
                return true
            })
            return withoutBlankLines
        }

        function removeMarkDown(text) {
            const withoutMarkdown = lines.filter(line => {
                if (line.trim().startsWith('=')) {
                    return false
                }
                return true
            })
            return withoutMarkdown
        }

        function removeDates(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }
    }

    function breakContentIntoSentences(content) {
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach(sentence => {
            content.sentence.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }    
}

module.exports = robot