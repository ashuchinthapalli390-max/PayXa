/**
 * The current official PayXa Merchant Android release. Update these values (and nothing else)
 * when a new signed build is published as a GitHub Release; payxa.in/download/android always
 * redirects to `url`.
 */
export const merchantApp = {
  version: "1.0.2",
  build: 3,
  releasedOn: "2026-11-25",
  minAndroid: "Android 10",
  sizeBytes: 27_751_530,
  fileName: "payxa-merchant-1.0.2.apk",
  url: "https://github.com/ashuchinthapalli390-max/PayXa/releases/download/merchant-android-v1.0.2/payxa-merchant-1.0.2.apk",
  releaseNotesUrl: "https://github.com/ashuchinthapalli390-max/PayXa/releases/tag/merchant-android-v1.0.2",
  sha256: "ae90cfcf8bc23b31d363f2d61a4d35ec3af622123d5e75fc79d1615d0a232bef",
  signingCertSha256: "61:dc:fe:e8:77:fd:ad:24:3e:fc:5a:a0:dc:4f:0f:8b:9c:86:e3:14:0c:12:15:14:5c:18:ed:d6:a4:e4:54:db",
} as const;

export const merchantAppSizeMb = (merchantApp.sizeBytes / 1024 / 1024).toFixed(1);
