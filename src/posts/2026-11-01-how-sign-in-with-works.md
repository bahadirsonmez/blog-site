---
title: 'How "Sign in with ..." works'
description: "An app signs you in without seeing your password: the provider sends back a short-lived code, and the app trades it for tokens."
date: 2026-11-01
tags: [how-it-works, security]
status: ready
---

"Sign in with ..." lets an app learn who you are without ever seeing your password. The idea to keep: the app gets a short-lived code, not a password, and swaps it for tokens.

## The short version

The app sends you to the provider's own sign-in page. The provider checks who you are, asks for your consent and sends you back to the app with a one-time authorization code. The app then trades that code for tokens in a direct request to the provider. OAuth 2.0 alone covers access, not identity. The "Sign in with" part is OpenID Connect on top: the app asks for the `openid` scope and gets an ID token, a JWT that says who signed in.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290" width="640" height="290" role="img" aria-labelledby="t-oauth d-oauth" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-oauth">How an app signs you in through a provider</title>
<desc id="d-oauth">Three columns: the app, the browser and the provider. Arrow 1 goes from the app to the browser, arrow 2 from the browser to the provider where you sign in, arrow 3 returns from the provider to the app with a code, arrow 4 sends the code to the provider, arrow 5 returns the tokens.</desc>
<defs><marker id="oauth-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="oauth-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="10" width="150" height="44" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="38" text-anchor="middle" fill="#160572" font-weight="600">App (client)</text>
<rect x="245" y="10" width="150" height="44" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="38" text-anchor="middle" fill="#160572" font-weight="600">Browser</text>
<rect x="470" y="10" width="150" height="44" rx="10" fill="#160572"/>
<text x="545" y="38" text-anchor="middle" fill="#ffffff" font-weight="600">Provider</text>
<line x1="95" y1="56" x2="95" y2="242" stroke="#2c2c2c" stroke-width="1" stroke-dasharray="2 4"/>
<line x1="320" y1="56" x2="320" y2="242" stroke="#2c2c2c" stroke-width="1" stroke-dasharray="2 4"/>
<line x1="545" y1="56" x2="545" y2="242" stroke="#2c2c2c" stroke-width="1" stroke-dasharray="2 4"/>
<line x1="97" y1="94" x2="316" y2="94" stroke="#2544a0" stroke-width="2" marker-end="url(#oauth-a)"/>
<line x1="324" y1="124" x2="541" y2="124" stroke="#2544a0" stroke-width="2" marker-end="url(#oauth-a)"/>
<line x1="541" y1="154" x2="99" y2="154" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#oauth-r)"/>
<line x1="97" y1="184" x2="541" y2="184" stroke="#2544a0" stroke-width="2" marker-end="url(#oauth-a)"/>
<line x1="541" y1="214" x2="99" y2="214" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#oauth-r)"/>
<text x="207" y="86" text-anchor="middle" fill="#2c2c2c" font-size="13">1 open provider page</text>
<text x="432" y="116" text-anchor="middle" fill="#2c2c2c" font-size="13">2 sign in and agree</text>
<text x="432" y="146" text-anchor="middle" fill="#2c2c2c" font-size="13">3 redirect back with a code</text>
<text x="207" y="176" text-anchor="middle" fill="#2c2c2c" font-size="13">4 send the code</text>
<text x="432" y="206" text-anchor="middle" fill="#2c2c2c" font-size="13">5 tokens come back</text>
<text x="320" y="268" text-anchor="middle" fill="#2c2c2c" font-size="13">Optional PKCE: code_challenge goes with 1, code_verifier with 4.</text>
</svg>
<figcaption>Simplified: the browser only carries the redirects in steps 1 to 3; steps 4 and 5 go straight between app and provider.</figcaption>
</figure>

## Step by step

1. The app sends the browser to the provider with its client ID, scope (`openid` for sign-in), `state` and redirect URI.
2. The provider signs you in and asks you to agree.
3. It redirects the browser to the redirect URI with a one-time code and the same `state`.
4. The app sends the code to the provider's token endpoint with its redirect URI.
5. The provider returns an access token and, with OpenID Connect, an ID token.

| | Authorization code | Access token |
|---|---|---|
| Reaches the app through | the browser redirect | a direct request to the provider |
| Lifetime | 10 minutes at most (recommended) | not published |

## Why it matters

Your password stays with the provider, which is the upside. The downside is that a sloppy setup can leak the code, so match the redirect URI exactly and use PKCE: RFC 9700 requires it for public clients such as mobile apps.

## Sources

- [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749) — the authorization code flow, the one-time and short-lived code, the token request
- [RFC 7636: Proof Key for Code Exchange (PKCE)](https://www.rfc-editor.org/rfc/rfc7636) — code_verifier and code_challenge, why a stolen code alone is useless
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700) — PKCE for public clients, exact redirect URI matching, state
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) — the identity layer on OAuth 2.0, the `openid` scope, the ID token
