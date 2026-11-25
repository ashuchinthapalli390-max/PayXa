/**
 * The current official PayXa Merchant Android release. Update these values (and nothing else)
 * when a new signed build is published as a GitHub Release; payxa.in/download/android always
 * redirects to `url`.
 */
export const merchantApp = {
  version: "1.0.3",
  build: 4,
  releasedOn: "2026-11-25",
  minAndroid: "Android 10",
  sizeBytes: 27_800_678,
  fileName: "payxa-merchant-1.0.3.apk",
  url: "https://github.com/ashuchinthapalli390-max/PayXa/releases/download/merchant-android-v1.0.3/payxa-merchant-1.0.3.apk",
  releaseNotesUrl: "https://github.com/ashuchinthapalli390-max/PayXa/releases/tag/merchant-android-v1.0.3",
  sha256: "2edb7bd03aa3d0263dc1a34f66931266d3edec5b31415e4a7e8c3f2f0d070c16",
  signingCertSha256: "61:dc:fe:e8:77:fd:ad:24:3e:fc:5a:a0:dc:4f:0f:8b:9c:86:e3:14:0c:12:15:14:5c:18:ed:d6:a4:e4:54:db",
} as const;

export const merchantAppSizeMb = (merchantApp.sizeBytes / 1024 / 1024).toFixed(1);
