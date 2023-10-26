import axios from "axios";
import fs from "fs";

axios
  .post("https://explorer.onegate.space/api", {
    jsonrpc: "2.0",
    id: 1,
    params: {
      ContractHash: "0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9",
      Limit: 1000,
      Skip: 0,
    },
    method: "GetNotificationByContractHash",
  })
  .then((response) => {
    console.log(JSON.stringify(response.data, null, 2));
    // Write to file
    fs.writeFile(
      "test.json",
      JSON.stringify(response.data.result.result, null, 2),
      function (err) {
        if (err) return console.log(err);
      }
    );
  })
  .catch((error) => {
    console.log(error);
  });
