import dotenv from "dotenv";
import app from "./app";
import * as db from "./database";

dotenv.config();
const port = process.env.PORT ?? 3000;

// entry point
async function main() {
    await db.initialize();

    app.listen(port, () => {
        if (process.env.API_AUTH_KEY === undefined) {
            console.error("There's no API_AUTH_KEY in .env file!");
            process.exit(1);
        }

        switch (process.env.NODE_ENV) {
            case "production":
                console.log(`Express app is running on http://find-my-support.herokuapp.com`);
                break;

            case "development":
                console.log(`Express app is running on http://localhost:${port}`);
                break;

            default:
                console.log("NODE_ENV is not set!");
                break;
        }
    });
}

main();