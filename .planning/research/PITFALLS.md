# Domain Pitfalls

**Domain:** SaaS/tech product landing page + waitlist campaign
**Researched:** 2026-03-19
**Confidence:** HIGH for LinkedIn OAuth (official docs), HIGH for form/conversion patterns (established practice), MEDIUM for i18n SEO, MEDIUM for GDPR

---

## Critical Pitfalls

Mistakes that cause rewrites, broken auth flows, or failed campaigns.

---

### Pitfall 1: LinkedIn OAuth Token Exchange Executed Client-Side

**What goes wrong:** Developers attempt to exchange the authorization code for an access token directly from the browser (client-side JavaScript), hitting `https://www.linkedin.com/oauth/v2/accessToken` directly. This exposes `client_secret` in the browser and fails due to CORS — LinkedIn's token endpoint does not return CORS headers that allow browser-originated POST requests.

**Why it happens:** The flow "feels" like a single-page operation. Developers see the auth code land in the redirect URL and try to complete the exchange in the same frontend code.

**Consequences:** `client_secret` is exposed in browser network tab. Token exchange fails with CORS errors. Auth flow silently breaks for users. Security vulnerability regardless of whether CORS blocks it.

**Prevention:**
- The token exchange (`/oauth/v2/accessToken` POST) MUST happen server-side, even for a "static" landing page — a lightweight edge function (Vercel, Netlify, Cloudflare Workers) is sufficient.
- Never pass `client_secret` to the frontend under any circumstances.
- The frontend only handles: (1) redirect to LinkedIn authorization URL, (2) receive auth code on callback, (3) pass code to your own backend endpoint.

**Detection:** Any attempt to `fetch('https://www.linkedin.com/oauth/v2/accessToken', ...)` in frontend code is the warning sign.

**Phase:** OAuth implementation phase — must be designed correctly from the start.

---

### Pitfall 2: LinkedIn Authorization Code Expiry Ignored (30-Minute Window)

**What goes wrong:** The authorization code returned by LinkedIn is valid for only 30 minutes. If the backend token exchange is slow, queued, or the user navigates away and returns, the code has expired and exchange returns `401 invalid_request "authorization code not found"`.

**Why it happens:** Developers test with fast local servers where this never happens, then deploy to cold-start serverless functions or queued systems.

**Consequences:** Silent auth failures on production. Users complete LinkedIn consent but get dropped or see errors on the callback page.

**Prevention:**
- Exchange the code immediately upon receiving the callback — no queuing, no async delay.
- Implement explicit error handling for expired codes: detect `invalid_request` on token exchange and redirect user to restart auth flow with a clear message ("Session expired, please sign in again").
- Cold-start serverless environments should pre-warm or use edge functions with minimal startup latency.

**Detection:** Auth failures that appear only sporadically on production, especially on first daily requests, are a cold-start expiry signal.

**Phase:** OAuth implementation + error handling phase.

---

### Pitfall 3: LinkedIn Redirect URI Exact-Match Mismatch

**What goes wrong:** LinkedIn requires the `redirect_uri` passed in the authorization request to exactly match one of the URIs registered in the Developer Portal. Any mismatch — trailing slash differences, HTTP vs HTTPS, query parameters appended — returns `401 Redirect_uri doesn't match`.

**Why it happens:** Developers register `https://example.com/callback` but pass `https://example.com/callback/` (trailing slash) or their framework normalizes the URL differently. Also: redirect URIs cannot contain `#` fragments — hash-router frameworks (Vue Hash Router, React HashRouter) break this.

**Consequences:** OAuth flow hard-fails with 401. Cannot be debugged without checking Developer Portal registered URIs against exact request URI.

**Prevention:**
- Register every environment explicitly: `localhost`, staging, production.
- Use path-based routing (not hash routing) for the callback URL.
- Never append query parameters to the `redirect_uri` — LinkedIn ignores/strips them per spec.
- Document the exact registered URIs in the project repo.

**Detection:** `401 Redirect_uri doesn't match` error on LinkedIn callback.

**Phase:** OAuth setup/configuration phase.

---

### Pitfall 4: LinkedIn Scope Not Approved for Application

**What goes wrong:** The scopes requested in the OAuth flow must be explicitly approved by LinkedIn for your application in the Developer Portal. Requesting `r_emailaddress` or `r_liteprofile` (legacy) or `openid`/`profile`/`email` (OIDC) without the product approval fails silently or returns `401 Invalid scope`.

**Why it happens:** LinkedIn has migrated from `r_liteprofile`/`r_emailaddress` to OpenID Connect (`openid`, `profile`, `email` scopes) for Sign In with LinkedIn. Developers copy old tutorials using deprecated scope names.

**Consequences:** Email pre-fill fails. Profile name not returned. Auth appears to succeed but API calls return empty data or 403.

**Prevention:**
- Use the current "Sign In with LinkedIn using OpenID Connect" product — scopes are `openid profile email`.
- Apply for the "Sign In with LinkedIn" product in Developer Portal under the Products tab before implementation.
- Verify approved scopes in the Auth tab of Developer Portal before coding.
- Do not use legacy `r_liteprofile` or `r_emailaddress` scopes in new implementations.

**Detection:** OAuth succeeds (user clicks Allow) but `/userinfo` endpoint returns empty fields or 403. Auth tab in Developer Portal shows no scopes listed.

**Phase:** OAuth setup — product approval may take 1-3 business days; apply early.

---

### Pitfall 5: CSRF State Parameter Skipped

**What goes wrong:** The `state` parameter is documented as optional by LinkedIn but skipping it leaves the OAuth callback vulnerable to CSRF attacks — an attacker can forge a callback URL with a valid-looking code and link their LinkedIn account to a victim's session.

**Why it happens:** Marked "No" in the required column of the spec; developers skip it to simplify implementation.

**Consequences:** Account takeover / CSRF vulnerability. An attacker can associate their LinkedIn profile with a victim's waitlist entry.

**Prevention:**
- Always generate a cryptographically random `state` value, store it in the user's session/cookie, and verify it matches on callback before processing.
- Return `401 Unauthorized` if state values do not match.

**Detection:** No `state` generation/verification in OAuth callback handler.

**Phase:** OAuth implementation — security review checkpoint.

---

## Moderate Pitfalls

---

### Pitfall 6: Scarcity Messaging That Reads as Fake

**What goes wrong:** "First 100 users" framing collapses in credibility when: (1) the number never changes, (2) there's no evidence of how many slots remain, (3) the exact same number appears in many competitor campaigns, (4) the copy is hyperbolic ("ACT NOW — ONLY 3 SPOTS LEFT!!!").

**Why it happens:** Marketers copy scarcity formulas without grounding them in verifiable reality.

**Consequences:** Technical audiences (the exact target for Astra OS) are highly scarcity-skeptical. Fake-feeling urgency actively damages trust and signals low product quality. Developers specifically recognize boilerplate copy patterns.

**Prevention:**
- Scarcity must be justified by a real constraint, stated transparently: "We're limiting the first cohort to 100 to maintain a high-touch onboarding experience."
- Avoid countdown timers, progress bars, or "X spots left" live counters unless backed by real data — the project already made the correct decision to use copy-only urgency.
- Write the scarcity rationale as a product decision: why 100, what happens to them, what they get that others won't. This converts skepticism into respect.
- Use social proof over artificial urgency: "people like you" signals beat "hurry before it's gone."

**Detection:** Read the scarcity copy aloud. If it sounds like a Black Friday email subject line, rewrite it.

**Phase:** Copywriting phase.

---

### Pitfall 7: Qualifying Form Shown Before LinkedIn Auth (Flow Inversion)

**What goes wrong:** Showing the 4 qualifying questions before or instead of LinkedIn OAuth results in: (1) higher form abandonment (more friction upfront), (2) manual name/email entry errors, (3) lower data quality (people guess or lie on manual forms).

**Why it happens:** Developers build the form first, then bolt LinkedIn OAuth on top.

**Consequences:** Conversion rate drops 20-40% for multi-question forms without pre-fill. Data quality degrades.

**Prevention:**
- The correct flow is: Hero CTA → LinkedIn OAuth (reduces friction, pre-fills identity) → 4 qualifying questions (user is already committed after auth).
- The qualifying questions must feel like a natural next step after auth, not a gate before it.
- Question 4 ("What excites you most about Astra OS?") should use radio buttons or 2-3 clear options — never a text input at this stage.

**Detection:** Any design where questions appear before or simultaneously with the LinkedIn sign-in prompt.

**Phase:** Form UX / interaction design phase.

---

### Pitfall 8: Mobile Form UX Killing Conversion

**What goes wrong:** Forms designed on desktop fail on mobile: tap targets too small (under 44px), form labels disappearing into placeholders, keyboard pushing layout and hiding submit button, multi-column question layouts collapsing badly.

**Why it happens:** Desktop-first design with mobile as afterthought. Technical founders use desktop.

**Consequences:** 50-60% of traffic from LinkedIn shares will be mobile (LinkedIn's mobile app usage is majority). Broken mobile form = majority of organic traffic lost.

**Prevention:**
- All tap targets minimum 44x44px.
- Use `<label>` elements — never placeholder-only inputs on mobile (placeholder disappears on focus).
- Single-column question layout on mobile.
- Test the full OAuth redirect flow on actual mobile devices — LinkedIn OAuth redirects behave differently in LinkedIn's in-app browser vs Safari/Chrome.
- Add `autocomplete` attributes to name/email fields for cases where LinkedIn pre-fill fails.

**Detection:** Open the page on iPhone with LinkedIn app. Attempt to complete the full flow.

**Phase:** Frontend/responsive design phase.

---

### Pitfall 9: LinkedIn OAuth in LinkedIn In-App Browser

**What goes wrong:** When users share the landing page URL on LinkedIn and others open it from within the LinkedIn mobile app, the OAuth flow may behave unexpectedly — LinkedIn's in-app browser has restrictions on OAuth redirects and popup windows.

**Why it happens:** Tested in real browsers only. The in-app browser is a sandboxed WebView.

**Consequences:** Auth flow breaks for users who click the link from the LinkedIn feed — the highest-value traffic source for a LinkedIn OAuth landing page.

**Prevention:**
- Test the full OAuth flow within LinkedIn's iOS and Android apps by sharing the URL to yourself.
- Provide a fallback: if OAuth fails or is declined, allow manual email entry with a graceful degradation path.
- Consider adding "Open in browser" prompt detection.

**Detection:** Share the landing page URL as a LinkedIn post, open it from the LinkedIn mobile app, attempt the full sign-in flow.

**Phase:** QA / cross-device testing phase.

---

### Pitfall 10: Bilingual Content Drift Between EN and TR

**What goes wrong:** The Turkish version starts as a faithful translation but diverges over time: headline changes are applied in English but not Turkish, CTAs differ in urgency, tone, or meaning between languages. Technical terms are translated literally when they should stay in English (e.g., "Agent Orchestration" translated as "Ajan Orkestrasyonu" instead of kept as English terminology used by Turkish developers).

**Why it happens:** Translation happens once at launch, then is forgotten in copy iterations.

**Consequences:** Turkish visitors see stale, inconsistent, or lower-quality content. Technical terms that Turkish developers use in English become confusing when over-localized. Creates an impression that the Turkish version is second-class.

**Prevention:**
- Maintain a copy source-of-truth file with EN as canonical. Each TR string explicitly references its EN counterpart.
- Technical jargon used by Turkish developers (Linux kernel, agent orchestration, open source) should remain in English — only UI chrome and explanatory copy gets translated.
- Any copy edit in EN triggers a TR review as part of definition-of-done.

**Detection:** Read both language versions side-by-side. Spot where CTAs, headlines, or feature descriptions diverge.

**Phase:** i18n setup phase (structure), ongoing during copy iteration.

---

### Pitfall 11: Missing or Broken hreflang Tags

**What goes wrong:** Bilingual pages without correct `hreflang` annotations cause Google to treat EN and TR versions as duplicate content. Alternatively, incorrectly configured hreflang (wrong language codes, missing `x-default`, non-canonical URLs) tells Google to serve the wrong language to users in Turkey or UK/US.

**Why it happens:** Developers add hreflang as an afterthought or copy a template without understanding the required reciprocal linking rule.

**Consequences:** Turkish Google searches don't surface the Turkish version. English-language SEO diluted by duplicate content signals.

**Prevention:**
- Implement `<link rel="alternate" hreflang="en" href="https://example.com/" />` and `<link rel="alternate" hreflang="tr" href="https://example.com/tr/" />` on BOTH pages (both must link to each other).
- Add `<link rel="alternate" hreflang="x-default" href="https://example.com/" />` pointing to the English canonical.
- Use BCP 47 language codes: `en` not `en-US` unless targeting specifically US (for global English use `en`), `tr` for Turkish.
- Every alternate page must be self-referencing (each page includes its own hreflang among the alternates).

**Detection:** Use Google Search Console's International Targeting report after launch. Validate hreflang with a dedicated checker tool before launch.

**Phase:** i18n implementation phase — set up at initial build, not retrofitted.

---

### Pitfall 12: Copy That Patronizes Technical Audiences

**What goes wrong:** Landing page copy explains Linux or AI concepts as if the reader doesn't know what they are ("Linux is an open-source operating system..."), uses inflated corporate language ("synergistic AI-powered paradigm"), or swings the other way into pure technical jargon without a value proposition ("EBPF-native agent lifecycle management").

**Why it happens:** Copywriters default to educational tone. Engineers writing copy default to spec-sheet tone.

**Consequences:** Developers disengage within 3 seconds. The target audience (developers, CTOs, AI practitioners) is extremely sensitive to condescension or vagueness. They have high BS filters.

**Prevention:**
- Write to the peer, not the prospect. Assume they know Linux, know what agents are, know what open source means. Skip the definitions.
- The value proposition must answer "why this over doing it yourself or waiting for X": kernel-level integration, not userspace. Native orchestration, not bolted-on.
- Every claim should be falsifiable or have a proof point. "The world's first kernel-native AI OS" is either true (state the evidence) or it isn't (cut it).
- Test copy by asking: would a senior engineer at a top AI lab find this credible? Would they forward it to a colleague?

**Detection:** If any sentence starts with "AI is transforming..." or ends with "...the future of computing," rewrite it.

**Phase:** Copywriting phase — applies to both EN and TR versions.

---

## Minor Pitfalls

---

### Pitfall 13: Animations Blocking LCP (Largest Contentful Paint)

**What goes wrong:** Hero section animations (fade-in, scroll-reveal, stagger effects) defer the render of the hero headline and CTA — which are typically the Largest Contentful Paint element. If the hero text is animated in via JavaScript or CSS `animation-delay`, the browser paints the element late. LCP score degrades, Core Web Vitals fail, and Google penalizes ranking.

**Prevention:**
- The hero headline and subheadline must be present in the initial HTML render with no JavaScript dependency.
- Use CSS animations only for decorative elements (background effects, gradients), never for the primary LCP element.
- If you use a JS animation library (GSAP, Framer Motion), ensure LCP elements are not initially hidden via `opacity: 0` or `visibility: hidden` — use `will-change` and let the animation enhance, not gate, the initial paint.
- Measure LCP in Chrome DevTools Lighthouse before and after adding any animation to the hero.

**Detection:** Run Lighthouse. If the LCP element is marked as delayed by animation, that's the flag.

**Phase:** Frontend implementation phase.

---

### Pitfall 14: Render-Blocking Third-Party Scripts

**What goes wrong:** Loading analytics (Segment, Mixpanel, Hotjar), OAuth SDKs, or chat widgets synchronously in `<head>` blocks HTML parsing. A 200ms analytics script cold-load kills Time to Interactive and LCP.

**Prevention:**
- All third-party scripts loaded with `async` or `defer` attributes.
- LinkedIn SDK (if used) loaded asynchronously.
- Consider loading analytics after first user interaction for critical conversion pages.
- Self-host font files or use `font-display: swap` — don't block render waiting for Google Fonts.

**Detection:** Lighthouse "Eliminate render-blocking resources" warning.

**Phase:** Frontend implementation phase.

---

### Pitfall 15: GDPR Consent Not Captured Before Data Collection

**What goes wrong:** Collecting email addresses and LinkedIn profile data (name, email) from EU visitors without explicit consent notice and opt-in violates GDPR Article 6 (lawful basis for processing) and Article 13 (transparency). Under GDPR, a pre-ticked checkbox or implied consent is not valid.

**Why it happens:** The project is a static landing page with no backend — developers assume GDPR only applies to "real" apps with databases. GDPR applies to any personal data collection, including a waitlist email.

**Consequences:** Fines up to €20M or 4% of annual global turnover. More practically for a pre-launch product: brand damage if called out publicly. Turkish data protection law (KVKK) mirrors GDPR requirements.

**Prevention:**
- Before LinkedIn OAuth is triggered, show a brief, plain-language notice: what data is collected (name, email, LinkedIn profile basics), why (waitlist signup), how it's stored, and a link to privacy policy.
- The consent must be an affirmative action — checking a box or clicking "I agree to the privacy policy" before the OAuth redirect.
- A privacy policy page (even minimal) must exist and be linked from the consent notice and footer.
- Do not store LinkedIn access tokens beyond the single session needed to extract profile data — extract name/email, then discard the token.

**Detection:** Can a user complete the full waitlist signup without being informed of data collection or given the ability to consent? If yes, GDPR violation.

**Phase:** Legal/compliance review before any form goes live.

---

### Pitfall 16: No Graceful Fallback When LinkedIn OAuth Is Declined or Unavailable

**What goes wrong:** User clicks "Cancel" on LinkedIn consent screen, or LinkedIn's OAuth service has downtime, or the user doesn't have a LinkedIn account. If the entire waitlist flow requires LinkedIn auth with no alternative, these users bounce with no recourse.

**Prevention:**
- Detect `user_cancelled_authorize` error in the callback and show a friendly fallback: simple name + email form.
- The fallback form should be visibly available (not hidden) as an alternative from the start, framed as "Don't have LinkedIn? Sign up directly."
- Monitor LinkedIn API status — LinkedIn has had intermittent OAuth outages.

**Detection:** Click "Cancel" on the LinkedIn consent screen. What does the user see?

**Phase:** OAuth implementation + error handling phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| LinkedIn OAuth setup | Scope approval delay (1-3 business days for product approval) | Apply for "Sign In with LinkedIn" product in Developer Portal on day 1 |
| LinkedIn OAuth implementation | Client-side token exchange / CORS failure | All token exchange via server-side edge function |
| LinkedIn OAuth implementation | CSRF state parameter skipped | Generate cryptographically random state, verify on callback |
| LinkedIn OAuth testing | In-app browser flow breakage | Test by sharing URL to yourself on LinkedIn mobile app |
| Form UX design | Questions before auth, poor mobile tap targets | Auth-first flow, 44px minimum touch targets |
| Copywriting | Condescension or vagueness for technical audience | Write peer-to-peer, assume full technical context |
| Scarcity copy | Fake-feeling urgency | Ground scarcity in a real product rationale, avoid counters |
| Bilingual implementation | Content drift, over-translation of technical terms | EN as canonical source; keep jargon terms in English |
| i18n / SEO | Missing or wrong hreflang | Implement reciprocal hreflang at initial build |
| Performance | Hero animations delaying LCP | Hero text renders in initial HTML, animations are additive only |
| Data collection | GDPR consent before OAuth redirect | Consent checkbox + privacy policy link before any data flows |
| QA | OAuth redirect URI mismatch across environments | Register all environments (local, staging, prod) in Developer Portal |

---

## Sources

- LinkedIn 3-Legged OAuth Flow official documentation: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow (updated 2025-11-17) — HIGH confidence
- LinkedIn "Sign In with LinkedIn using OpenID Connect": established current standard replacing legacy liteprofile scopes — HIGH confidence
- GDPR Article 6 (lawful basis) and Article 13 (transparency requirements) — HIGH confidence for established regulation
- KVKK (Turkish data protection law) mirrors GDPR structure — MEDIUM confidence
- Core Web Vitals LCP measurement and animation impact: established web performance practice — HIGH confidence
- hreflang reciprocal linking requirement: Google Search Central documented requirement — HIGH confidence
- Form conversion rate research (multi-step vs single-step, auth-first patterns): established CRO practice — MEDIUM confidence
- Scarcity marketing credibility with technical audiences: established UX/CRO research pattern — MEDIUM confidence
