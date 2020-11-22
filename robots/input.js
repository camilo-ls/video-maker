const readline = require('readline-sync')
const state = require('./state')

function robot() {
    const content = {
        maxSentences: 10
    }
    
    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    state.save(content)
    
    function askAndReturnSearchTerm() {
        return readline.question('Informe um termo da Wikipedia: ')
    }
    
    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes)
        const selectedPrefixText = prefixes[selectedPrefixIndex]
        return selectedPrefixText
    }
}

module.exports = robot