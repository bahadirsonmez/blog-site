---
title: "How JPEG makes images small"
description: "JPEG converts colors, cuts the image into 8x8 blocks, applies a DCT, rounds with a quality-scaled table and packs the result with Huffman coding."
date: 2026-11-17
tags: [how-it-works, data]
status: draft
---

## Why this topic

Answers how a photo file gets small, after yesterday's number-storage posts. Claims rest on the LOC format description, RFC 2435, the IJG README and MDN. Simplified on purpose: chroma subsampling ratios, progressive mode and arithmetic coding are left out, and the sources do not say which step loses detail, so the post only says the quantization rounding step is where detail goes "in this simplified view".

<!-- end why -->

JPEG is the image format behind most photos on the web, and it makes files small by giving up some detail. The idea to keep: the quality setting decides how much detail is given up.

## The short version

JPEG is lossy, so the decoded pixels may differ from the original. The encoder first turns RGB into a brightness channel and color channels, then cuts the picture into 8x8 blocks and runs a DCT on each block. The quality setting scales the quantization tables, and in this simplified view that rounding step is where detail is lost. What remains is read in zigzag order and Huffman-coded.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" width="640" height="200" role="img" aria-labelledby="t-jp d-jp" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-jp">JPEG encoder pipeline</title>
<desc id="d-jp">Five steps from left to right: RGB pixels, luma and chroma, 8x8 blocks with a DCT, quantize, then zigzag and Huffman coding. The quality setting scales the quantize step.</desc>
<defs><marker id="jp-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<text x="320" y="26" text-anchor="middle" fill="#2c2c2c" font-size="14" font-weight="600">JPEG encoder pipeline (simplified)</text>
<rect x="10" y="50" width="100" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="60" y="80" text-anchor="middle" fill="#160572" font-weight="600">RGB</text>
<text x="60" y="100" text-anchor="middle" fill="#160572" font-weight="600">pixels</text>
<rect x="140" y="50" width="100" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="190" y="80" text-anchor="middle" fill="#160572" font-weight="600">Luma +</text>
<text x="190" y="100" text-anchor="middle" fill="#160572" font-weight="600">chroma</text>
<rect x="270" y="50" width="100" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="80" text-anchor="middle" fill="#160572" font-weight="600">8x8 blocks</text>
<text x="320" y="100" text-anchor="middle" fill="#160572" font-weight="600">+ DCT</text>
<rect x="400" y="50" width="100" height="70" rx="10" fill="#160572"/>
<text x="450" y="80" text-anchor="middle" fill="#ffffff" font-weight="600">Quantize</text>
<text x="450" y="100" text-anchor="middle" fill="#ffffff" font-weight="600">(lossy)</text>
<rect x="530" y="50" width="100" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="580" y="80" text-anchor="middle" fill="#160572" font-weight="600">Zigzag +</text>
<text x="580" y="100" text-anchor="middle" fill="#160572" font-weight="600">Huffman</text>
<line x1="112" y1="85" x2="138" y2="85" stroke="#2544a0" stroke-width="2" marker-end="url(#jp-a)"/>
<line x1="242" y1="85" x2="268" y2="85" stroke="#2544a0" stroke-width="2" marker-end="url(#jp-a)"/>
<line x1="372" y1="85" x2="398" y2="85" stroke="#2544a0" stroke-width="2" marker-end="url(#jp-a)"/>
<line x1="502" y1="85" x2="528" y2="85" stroke="#2544a0" stroke-width="2" marker-end="url(#jp-a)"/>
<text x="125" y="74" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="255" y="74" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="385" y="74" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
<text x="515" y="74" text-anchor="middle" fill="#2c2c2c" font-size="13">4</text>
<path d="M450 150V122" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#jp-a)"/>
<text x="450" y="172" text-anchor="middle" fill="#2c2c2c" font-size="13">quality setting scales the tables</text>
</svg>
<figcaption>Simplified: a quality setting between 1 and 99 scales the tables used in the quantize step.</figcaption>
</figure>

## Step by step

1. Convert the RGB pixels into luma (brightness) and chroma (color).
2. Optionally shrink the color channels: in the 4:2:0 layout they are halved horizontally and vertically.
3. Split the picture into 8x8 blocks and apply a DCT to each one.
4. Quantize the results with tables scaled by the quality setting.
5. Read the values in zigzag order and Huffman-code them.

| | Lower quality | Higher quality |
|---|---|---|
| File size | Smaller | Larger |
| Visible artifacts | More likely | Less likely |

## Why it matters

JPEG suits photos and smooth color transitions, so most camera pictures use it, and typical settings shrink a file by roughly 10:1 to 20:1. The downside is lost detail, and sharp lines and sudden edges compress badly and need a high quality setting to avoid visible artifacts. MDN calls lossy compression unsatisfying for diagrams and graphics.

## Sources

- [Library of Congress, JPEG format description](https://www.loc.gov/preservation/digital/formats/fdd/fdd000017.shtml): lossy modes use a DCT on 8x8 blocks, RGB is converted to YCrCb, baseline coefficients go in zigzag order, typical settings shrink files about 10:1 to 20:1
- [RFC 2435, RTP payload format for JPEG](https://www.rfc-editor.org/rfc/rfc2435): quantization tables are the standard tables scaled by a quality value from 1 to 99, standard Huffman tables are used, 4:2:0 halves the chroma channels in both directions
- [libjpeg-turbo README.ijg](https://raw.githubusercontent.com/libjpeg-turbo/libjpeg-turbo/main/README.ijg): JPEG is normally lossy, suits photographs and smooth transitions, trades quality for size, and handles sharp lines and sudden edges badly
- [MDN, Image file type and format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types): JPEG is lossy, DCT-based and meant for photos, and lossy compression gives unsatisfying results for sharp diagrams and graphics
