# Product scanning — implementation notes

The scanner is available in Know your serum. Camera start requires an explicit click. ZXing is lazy-loaded locally for QR and 1D barcode decoding, with no third-party lookup or image upload. Uploaded images are limited to 10 MB, and object URLs are revoked after decoding. Camera streams are stopped on dialog close/unmount, Stop, successful/unknown lookup and hidden tabs. Late permission results are disposed instead of reopening the camera.

Resolution accepts exact current-origin/configured-site product profile URLs and source-backed manufacturer code mappings. No arbitrary QR navigation, fuzzy product matching or invented GTINs is allowed. The manufacturer mapping registry is intentionally empty until exact product/size codes are verified with a provenance URL/date. The UI makes this coverage limit explicit. A catalog match always leads to user confirmation and does not establish contents, purity, safety, authenticity or batch traceability.

Camera access requires HTTPS or localhost; physical camera performance and lighting still need device testing before release. Photo/manual entry remains available. Documentation consulted 2026-10-20:
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector (native-only detection has limited browser coverage; bundled decoder used instead)
- https://github.com/zxing-js/browser

Production dependency audit reports 7 high findings in the existing vinext/braces toolchain; none are attributed to the added ZXing packages. No forced dependency downgrade was applied.
