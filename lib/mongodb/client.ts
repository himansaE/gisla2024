import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.FULL_DATABASE_URL ?? "");
client.connect();

const db = client.db("events");
const collection = db.collection("uplaod-events");
export { db, collection };
