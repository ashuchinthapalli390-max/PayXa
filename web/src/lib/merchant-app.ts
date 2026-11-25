/**
 * The current official PayXa Merchant Android release. Update these values (and nothing else)
 * when a new signed build is published as a GitHub Release; payxa.in/download/android always
 * redirects to `url`.
 */
export const merchantApp = {
  version: "1.0.1",
  build: 2,
  releasedOn: "2026-11-25",
  minAndroid: "Android 10",
  sizeBytes: 27_751_526,
  fileName: "payxa-merchant-1.0.1.apk",
  url: "https://github.com/ashuchinthapalli390-max/PayXa/releases/download/merchant-android-v1.0.1/payxa-merchant-1.0.1.apk",
  releaseNotesUrl: "https://github.com/ashuchinthapalli390-max/PayXa/releases/tag/merchant-android-v1.0.1",
  sha256: "79fe08f5b2e1460e9db9c52e37dbdd686687f4c1cec5183475f48ffaddbf7e43",
  signingCertSha256: "61:dc:fe:e8:77:fd:ad:24:3e:fc:5a:a0:dc:4f:0f:8b:9c:86:e3:14:0c:12:15:14:5c:18:ed:d6:a4:e4:54:db",
} as const;

export const merchantAppSizeMb = (merchantApp.sizeBytes / 1024 / 1024).toFixed(1);
