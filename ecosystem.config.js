module.exports = {
  apps: [
    // {
    //   name: "assets_master",
    //   script: "./src/indexers/assets/master.ts",
    //   instances: 0,
    // },
    // {
    //   name: "assets_workers",
    //   script: "./src/indexers/assets/worker.ts",
    //   instances: 0,
    // },
    // {
    //   name: "sales_master",
    //   script: "./src/indexers/activities/sales/master.ts",
    //   instances: 1,
    // },
    // {
    //   name: "sales_workers",
    //   script: "./src/indexers/activities/sales/worker.ts",
    //   instances: 3,
    // },
    {
      name: "listings_master",
      script: "./src/indexers/activities/listings/master.ts",
      instances: 1,
    },
    {
      name: "listings_workers",
      script: "./src/indexers/activities/listings/worker.ts",
      instances: 8,
    },
  ],
};
