/**
 * The current official PayXa Merchant Android release. Update these values (and nothing else)
 * when a new signed build is published as a GitHub Release; payxa.in/download/android always
 * redirects to `url`.
 */
export const merchantApp = {
  version: "1.0.0",
  build: 1,
  releasedOn: "2026-11-24",
  minAndroid: "Android 10",
  sizeBytes: 27_718_758,
  fileName: "payxa-merchant-1.0.0.apk",
  url: "https://github.com/ashuchinthapalli390-max/PayXa/releases/download/merchant-android-v1.0.0/payxa-merchant-1.0.0.apk",
  releaseNotesUrl: "https://github.com/ashuchinthapalli390-max/PayXa/releases/tag/merchant-android-v1.0.0",
  sha256: "ed5d93abd293c1a514122fbdbf607e83c0717228e7933830ddbccf240dd2984e",
  signingCertSha256: "61:dc:fe:e8:77:fd:ad:24:3e:fc:5a:a0:dc:4f:0f:8b:9c:86:e3:14:0c:12:15:14:5c:18:ed:d6:a4:e4:54:db",
} as const;

export const merchantAppSizeMb = (merchantApp.sizeBytes / 1024 / 1024).toFixed(1);
