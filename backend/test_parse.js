const { parseMealInput } = require('./services/aiService');
require('dotenv').config();

async function test() {
  const text = "today i eat 4 methi paratha and at lunch i ate 2 roti paneer masala and rice dal";
  try {
    console.log("Parsing start...");
    const res = await parseMealInput(text);
    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
