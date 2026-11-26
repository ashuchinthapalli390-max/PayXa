/**
 * IndexNow Submission Script for PayXa
 * Submits public canonical URLs to Bing and participating search engines.
 * Usage: node scripts/indexnow.mjs
 */
const HOST = "payxa.in";
const KEY = "e479a29d91964f43a08b3e8e12d48c90";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/about`,
  `https://${HOST}/features`,
  `https://${HOST}/products`,
  `https://${HOST}/products/checkout`,
  `https://${HOST}/products/payment-links`,
  `https://${HOST}/products/qr-payments`,
  `https://${HOST}/products/instant-alerts`,
  `https://${HOST}/how-it-works`,
  `https://${HOST}/developers`,
  `https://${HOST}/docs`,
  `https://${HOST}/pricing`,
  `https://${HOST}/security`,
  `https://${HOST}/download`,
  `https://${HOST}/solutions`,
  `https://${HOST}/integrations`,
  `https://${HOST}/help`,
  `https://${HOST}/contact`,
  `https://${HOST}/brand`,
  `https://${HOST}/status`,
];

async function submitIndexNow() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    console.log(`[IndexNow] Status: ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Successfully submitted ${URL_LIST.length} public canonical URLs.`);
    } else {
      const text = await res.text();
      console.warn(`[IndexNow] Response: ${text}`);
    }
  } catch (err) {
    console.error("[IndexNow] Submission failed:", err);
  }
}

submitIndexNow();
