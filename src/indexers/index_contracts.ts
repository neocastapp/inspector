import axios from "axios";
const log = require("single-line-log").stdout;

import { db } from "../helpers/mongo-client";
import { ensureIndexes } from "../helpers/mongo-client";
import { Notification } from "../types";

let contracts: any = ["0x1182db96dabd9ab27dc6c513e038169aacc7931a"]; // Testnet
// let contracts: any = ["0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9 "]; // Mainnet

let network = "testnet";
let topic_name = "NFTGram";

async function main() {
  await ensureIndexes();

  for (let i = 0; i < contracts.length; i++) {
    let contract = contracts[i];
    let contract_details = await axios
      .get(`https://api.neotube.io/v1/contract/${contract}`, {
        headers: {
          "Content-Type": "application/json",
          Network: network,
        },
      })
      .then((response) => response.data.data);

    // Store contract details
    await db.collection("topics").insertOne({
      topic_name,
      network,
      ...contract_details,
    });
  }
  process.exit(0);
}

main();
