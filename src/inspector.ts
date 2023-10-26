import axios from "axios";
const log = require("single-line-log").stdout;

import { db } from "./helpers/mongo-client";
import { ensureIndexes } from "./helpers/mongo-client";
import { Notification } from "./types";

export default async function salesScraper(
  contract: string,
  cursor: string = ""
): Promise<{ result: Notification[]; cursor: string }> {
  let result: any = [];
  let hasNextPage = true;

  // Check if we have a cursor
  let last_notifications = await db
    .collection("contracts")
    .findOne({ name: contract });

  if (last_notifications?.cursor) {
    cursor = last_notifications.cursor;
  }

  while (hasNextPage) {
    await axios
      .post(`https://testmagnet.explorer.onegate.space/api`, {
        jsonrpc: "2.0",
        id: 1,
        params: {
          ContractHash: contract,
          Limit: 1000,
          Skip: 0,
        },
        method: "GetNotificationByContractHash",
      })
      .then((response) => {
        const notifications: Notification[] = response.data.result.result;
        log(
          `Currently at cursor ${cursor}: ${Buffer.from(
            cursor,
            "base64"
          ).toString("ascii")}
      )} | Next cursor: ${response.data.cursor}: ${Buffer.from(
            cursor,
            "base64"
          ).toString("ascii")}"`
        );
        cursor = response.data.cursor;
        hasNextPage = response.data.hasNextPage;

        result = [...result, ...activities];
        log(`Got ${result.length} sales for ${policy}`);
      })
      .catch((e) => {
        console.log(e);
        hasNextPage = false;
      });
  }
  return { result, cursor };
}

async function main() {
  await ensureIndexes();

  let response: any = await db
    .collection("policies")
    .aggregate([
      {
        $match: {
          last_sales_sync: {
            $exists: false,
          },
        },
      },
      {
        $group: {
          _id: null,
          policies: {
            $addToSet: "$name",
          },
        },
      },
    ])
    .toArray();

  let policies = response[0].policies;

  for (let i = 0; i < policies.length; i++) {
    let policy = policies[i];

    console.log(`\n\nScraping ${policy}`);

    // Scrape Assets
    const { result, cursor } = await salesScraper(policy);

    // Insert into DB
    await db.collection("sales").insertMany(result);

    if (result) {
      // Update Policies
      await db.collection("policies").updateOne(
        {
          name: policy,
        },
        {
          $set: {
            last_sales_sync: new Date(),
            last_sales_cursor: cursor,
          },
        }
      );
    }
  }

  console.log("\nDone!!!");

  process.exit(0);
}
