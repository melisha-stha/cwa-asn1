/**
 * AWS Lambda function handler for the CSE3CWA Assignment 2.
 * * Purpose: This function simulates the logic needed to create dynamic HTML pages
 * based on the saved data in the database (via the Next.js API endpoint).
 * * It is structured to be deployed as a Node.js Lambda function and is typically
 * accessed via an AWS API Gateway endpoint.
 * * NOTE: For deployment, replace 'YOUR_API_ENDPOINT_BASE_URL' with the actual
 * URL of your deployed Next.js application (e.g., https://your-app.vercel.app).
 */

// This base URL needs to be set in the Lambda environment variables or configuration
// In a real deployment, this would be the address of your deployed Next.js app.
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; 

/**
 * Helper function to fetch the game result by ID from the deployed Next.js API.
 * In a production environment, this Lambda might access the database directly,
 * but for this assignment, accessing the existing API is appropriate.
 * @param {string} id - The GameResult ID to fetch.
 * @returns {Promise<object>} The game result object containing generatedCode.
 */
async function fetchGameResult(id) {
    try {
        const url = `${API_BASE_URL}/api/results?id=${id}`;
        console.log(`Fetching result from: ${url}`);
        
        // This relies on the GET method implemented in app/api/results/route.ts
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch result: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Find the specific result if the API returns a list (as currently implemented)
        const result = Array.isArray(data) ? data.find(r => r.id.toString() === id) : data;
        
        return result;

    } catch (error) {
        console.error('Error in fetchGameResult:', error);
        return null;
    }
}

/**
 * Lambda handler function.
 * @param {object} event - The event data passed to the Lambda function (e.g., from API Gateway).
 * @returns {object} The API Gateway response object.
 */
exports.handler = async (event) => {
    // Attempt to extract the game ID from the query parameters or body
    // Assuming API Gateway passes parameters in query string
    const gameId = event.queryStringParameters ? event.queryStringParameters.id : null;

    if (!gameId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/html' },
            body: '<h1>400 Bad Request</h1><p>Missing game ID. Please provide ?id=XXX in the URL.</p>',
        };
    }

    const result = await fetchGameResult(gameId);

    if (!result || !result.generatedCode) {
        return {
            statusCode: 404,
            headers: { 'Content-Type': 'text/html' },
            body: `<h1>404 Not Found</h1><p>Game result with ID ${gameId} not found or has no code.</p>`,
        };
    }

    // Success: Return the dynamically generated HTML code directly
    // This creates the "dynamic page" required by the assignment.
    return {
        statusCode: 200,
        headers: { 
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*' // Required for CORS access from browser
        },
        body: result.generatedCode,
    };
};