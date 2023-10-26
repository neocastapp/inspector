const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection URL
const client = new MongoClient(
  process.env.MONGO_DB_URL
    ? process.env.MONGO_DB_URL
    : "mongodb://localhost:27017"
);

const db = client.db(process.env.MONGO_DB_NAME || "nftconomy-cardano");

async function ensureIndexes() {
  try {
    // Add indexes for assets
    await db.collection("assets").createIndex(
      { policyId: 1, assetNameHex: 1 },
      {
        unique: true,
      }
    );
    await db.collection("assets").createIndex({ assetNameHex: 1 });
    await db.collection("assets").createIndex({ "collection.name": 1 });
    await db.collection("assets").createIndex({ imgFormat: -1 });
    await db.collection("assets").createIndex(
      { assetFingerprint: 1 },
      {
        unique: true,
      }
    );
    await db.collection("assets").createIndex({ likes: -1 });

    // Add indexes for policies
    await db.collection("policies").createIndex(
      { name: 1 },
      {
        unique: true,
      }
    );
    await db.collection("policies").createIndex({ volume: -1 });
    await db.collection("policies").createIndex({ owners: -1 });
    await db.collection("policies").createIndex({ nftsInCirculation: -1 });

    // Add indexes for sell
    await db.collection("sales").createIndex({ txHash: 1 }, { unique: true });

    // Add indexes for listings
    await db
      .collection("listings")
      .createIndex({ txHash: 1 }, { unique: true });

    // Add indexes for delist
    await db.collection("delists").createIndex({ txHash: 1 }, { unique: true });
  } catch (e) {
    console.log(e);
    console.log("Error creating indexes");
  }
}

// Export db and client
export { db, client, ensureIndexes };
