export const isUsingStealthPlugin = (browserInstance: any) => {
  return (browserInstance._process?.spawnargs || []).includes(
    "--disable-blink-features=AutomationControlled"
  );
};

export const warnIfNotUsingStealth = (browserInstance: any) => {
  if (!browserInstance) {
    throw new Error("No or invalid browser instance provided.");
  }
  if (!isUsingStealthPlugin(browserInstance)) {
    console.warn(
      "🚧 WARNING: You are using puppeteer without the stealth plugin. You most likely need to use stealth plugin to scrape Opensea."
    );
  }
};

export function splitToChunks(array: any[], parts: number) {
  let result: any = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}
