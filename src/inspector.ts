import axios from "axios";
const log = require("single-line-log").stdout;

import { db } from "./helpers/mongo-client";
import { ensureIndexes } from "./helpers/mongo-client";
import { Notification } from "./types";

export default async function indexNotifications(
  topic: any
): Promise<{ result: any[] }> {
  let result: any = [];

  await axios
    .post(`https://testmagnet.explorer.onegate.space/api`, {
      jsonrpc: "2.0",
      id: 1,
      params: {
        ContractHash: topic.contract,
        Limit: 1000,
        Skip: 0,
      },
      method: "GetNotificationByContractHash",
    })
    .then((response) => {
      const notifications: any = response.data.result.result;

      result = notifications
        .filter((notif: any) => {
          console.log(notif.eventname, topic.selected_events);
          return topic.selected_events.includes(notif.eventname);
        })
        .map((notification: any) => {
          return {
            ...notification,
            topic_name: topic.topic_name,
            ack: false,
          };
        });
      log(`Got ${result.length} notifications for ${topic.topic_name}`);
    })
    .catch((e) => {
      console.log(e);
    });
  return { result };
}

async function main() {
  await ensureIndexes();

  let topics: any = await db.collection("topics").find({}).toArray();

  for (let i = 0; i < topics.length; i++) {
    let topic = topics[i];

    console.log(`\n\nScraping ${topic.topic_name}`);

    // Scrape Notifications
    const { result } = await indexNotifications(topic);

    // Insert into DB
    await db
      .collection("notifications")
      .insertMany(result)
      .catch((e: any) => {
        console.log(e);
      });
  }

  console.log("\nDone!");

  process.exit(0);
}

main();
