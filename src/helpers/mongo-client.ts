const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection URL
const client = new MongoClient(
  process.env.MONGO_DB_URL
    ? process.env.MONGO_DB_URL
    : "mongodb://localhost:27017"
);

const db = client.db(process.env.MONGO_DB_NAME || "neocast");

async function ensureIndexes() {
  try {
    // Add index for contracts
    await db
      .collection("topics")
      .createIndex({ topic_name: 1 }, { unique: true });

    await db.collection("notifications").createIndex(
      {
        eventname: 1,
        timestamp: 1,
        tx_id: 1,
      },
      {
        unique: true,
      }
    );

    await db.collection("notifications").createIndex({ contract: 1 });
    await db.collection("notifications").createIndex({ topic_name: 1 });
  } catch (e) {
    console.log(e);
    console.log("Error creating indexes");
  }
}

// Export db and client
export { db, client, ensureIndexes };
