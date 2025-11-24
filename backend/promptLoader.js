const fs = require('fs');
const path = require('path');

/**
 * Loads a prompt from the prompts directory
 * @param {string} promptName - The name of the prompt file (without extension)
 * @param {Object} variables - Variables to replace in the prompt template
 * @returns {string} The loaded prompt with variables replaced
 */
function loadPrompt(promptName, variables = {}) {
  try {
    const promptPath = path.join(__dirname, '..', 'prompts', `${promptName}.txt`);
    let promptContent = fs.readFileSync(promptPath, 'utf8');
    
    // Replace variables in the prompt template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      promptContent = promptContent.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return promptContent;
  } catch (error) {
    console.error(`Error loading prompt '${promptName}':`, error);
    throw new Error(`Failed to load prompt: ${promptName}`);
  }
}

module.exports = { loadPrompt };