// const Socket: any = require("ws");

// const ws: any = new Socket("wss://rpc.t5.n3.nspcc.ru:20331/ws");
// ws.on("open", () => {
//   console.log("WebSocket connection established.");
//   // Send a subscription message to the WebSocket server
//   const subscriptionMessage = {
//     jsonrpc: "2.0",
//     method: "subscribe",
//     params: [
//       "notification_from_execution",
//       { contract: "0x1182db96dabd9ab27dc6c513e038169aacc7931a" },
//     ],
//     id: 1,
//   };
//   ws.send(JSON.stringify(subscriptionMessage));
// });

// ws.on("message", (data: any) => {
//   console.log(`Received message: ${data}`);
// });

// ws.on("close", () => {
//   console.log("WebSocket connection closed.");
// });

// ws.on("error", (error: any) => {
//   console.error(`WebSocket error: ${error}`);
// });
