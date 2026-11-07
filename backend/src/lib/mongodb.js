import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/personal_ai";
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db();
  } catch (error) {
    console.warn("MongoDB connection failed or unavailable:", error.message);
    return null;
  }
}

export default clientPromise;
