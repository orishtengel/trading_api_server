import * as functions from "firebase-functions";
import { createApp } from "./app";

// Create and configure Express app
const app = createApp();

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
