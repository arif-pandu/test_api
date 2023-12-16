const express = require("express");
const serverless = require("serverless-http");

// Create an instance of the Express app
const app = express();

// Create a router to handle routes
const router = express.Router();

const bodyParser = require('body-parser');

app.use(bodyParser.json());


let characters = {
    character1: 0,
    character2: 0,
    character3: 0,
};


// Define a route that responds with a JSON object when a GET request is made to the root path
router.put("/", (req, res) => {
    const incomingData = req.body;

    if (Array.isArray(incomingData)) {
        // Process each character in the incoming data array
        incomingData.forEach((characterUpdate) => {
            const characterId = characterUpdate.characterId;
            const incomingValue = parseInt(characterUpdate.value) || 0;

            if (characters.hasOwnProperty(characterId)) {
                // Combine existing value with incoming value
                characters[characterId] += incomingValue;
            }
        });

        // Calculate total values for all characters
        const totalValues = {
            character1: characters.character1,
            character2: characters.character2,
            character3: characters.character3,
        };

        res.json({
            success: true,
            message: 'Characters updated successfully',
            totalValues: totalValues,
            characters: characters,
        });
    } else {
        res.status(400).json({ success: false, message: 'Invalid request data' });
    }
});


router.get('/', (req, res) => {
    // Calculate total values for all characters
    const totalValues = {
        character1: characters.character1,
        character2: characters.character2,
        character3: characters.character3,
    };

    res.json({
        totalValues: totalValues,
        characters: characters,
    });
});

// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/.netlify/functions/api`, router);

// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);