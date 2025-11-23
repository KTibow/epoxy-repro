// import makeEpoxyDirect from "./make-epoxy-direct.ts";
import makeEpoxyReadwrite from "./make-epoxy-readwrite.ts";

const epoxy = await makeEpoxyReadwrite("wss://wisp.mercurywork.shop");
const urls = Array.from(
  { length: 5 },
  () => `https://example.com/${Math.random()}`,
);

const timedLog = (...args: any[]) => {
  console.log(new Date().toISOString().split("T")[1], ...args);
};
timedLog("Fetching");
const responses = urls.map((url) =>
  epoxy
    .fetch(url, {})
    .then((r) =>
      console.log(new Date().toISOString().split("T")[1], r.url, r.status),
    ),
);
Promise.all(responses).then(() => {
  timedLog("All fetches complete");
  Deno.exit(0);
});
setTimeout(() => {
  timedLog("Timeout reached");
  Deno.exit(1);
}, 10000);
