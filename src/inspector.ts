const Socket: any = require("ws");
import axios from "axios";
const log = require("single-line-log").stdout;

import { db } from "./helpers/mongo-client";
import { ensureIndexes } from "./helpers/mongo-client";
import { Notification } from "./types";

const ws: any = new Socket("wss://rpc.t5.n3.nspcc.ru:20331/ws");

// Create a socket factory class
class Inspector {
  topic_name: string;
  contract: string;
  selected_events: string[];
  connection: any;

  constructor(
    contract: string,
    selected_events: string[],
    network: string,
    topic_name: string
  ) {
    this.contract = contract;
    this.selected_events = selected_events;
    this.topic_name = topic_name;
    this.connection = new Socket(
      network == "testnet"
        ? "wss://rpc.t5.n3.nspcc.ru:20331/ws"
        : "wss://rpc10.n3.nspcc.ru:10331/ws"
    );
    this.connection.on("open", () => {
      console.log("Established JsonRPC socket connection for ", topic_name);
      // Send a subscription message to the WebSocket server
      const subscriptionMessage = {
        jsonrpc: "2.0",
        method: "subscribe",
        params: ["notification_from_execution", { contract }],
        id: 1,
      };
      this.connection.send(JSON.stringify(subscriptionMessage));
    });
  }

  // Define listen function
  listen() {
    this.connection.on("message", (data: any) => {
      let parsedData = JSON.parse(data);
      console.log("pong: ", parsedData);

      if (parsedData.params) {
        parsedData.params.map((event: any) => {
          if (this.selected_events.includes(event.eventname)) {
            console.log("Event:", event.eventname);
            console.log("Data:", event);

            // Store the notification
            let notification: Notification = {
              topic_name: this.topic_name,
              ack: false,
              ...event.state,
            };
            db.collection("notifications")
              .insertOne(notification)
              .then(() => {
                console.log("Stored notification:", notification);
              });
          }
        });
      }
    });
  }
}

async function main() {
  console.log("Getting the list of topics...");

  // Get the list of topics
  let topics = await db
    .collection("topics")
    .find({
      // Check if the the key 'contract' exists
      contract: { $exists: true },
    })
    .project({
      topic_name: 1,
      contract: 1,
      network: 1,
      selected_events: 1,
      _id: 0,
    })
    .toArray();

  for (let i = 0; i < topics.length; i++) {
    let topic = topics[i];
    let inspector = new Inspector(
      topic.contract,
      topic.selected_events,
      topic.network,
      topic.topic_name
    );
    inspector.listen();
  }
}

main();
// Path: src/inspector.ts
