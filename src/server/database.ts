import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
if (process.env.MONGODB_URI === undefined) {
    console.error("There's no MONGODB_URI in .env file!");
    process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("cache");

export async function initialize(): Promise<void> {
    await client.connect();
    await db.command({ ping: 1 });
}

export const supportConditions = db.collection<SupportConditionsModel>("support-conditions");
export const serviceDetail = db.collection<ServiceDetailModel>("service-detail");