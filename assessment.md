# assessment.md — HydroCrop Monitor
Student: ZHIKUN ZHU
Course: MGMT 6110
Problem Set 2

---

## Part 1 — Product Criteria

### Front-End Criteria

#### FE1 — Core shift-handover workflow is understandable
**Why it matters:** A vertical-farm operations technician should be able to understand the purpose of HydroCrop Monitor and move from overview, to bay inspection, to handover without needing separate instructions.

**How to test:** Open the deployed product as a first-time user and determine whether the three main stages — Shift Overview, Bay Inspection & Action, and Handover Summary & Logs — can be identified and reached from the interface.

**Assessment: MET**

**Evidence:** The deployed interface presents the three workflow stages in the main navigation. I tested movement between all three screens on the deployed Vercel version and the workflow remained functional.

---

#### FE2 — Mobile usability
**Why it matters:** A farm technician may use the product on a phone while moving around the facility, so the workflow cannot depend on a desktop-sized screen.

**How to test:** Open the deployed product at 375px and 430px widths and check for page-level horizontal overflow, clipped text, overlapping controls, and unusable touch targets.

**Assessment: MET**

**Evidence:** I manually tested the deployed Vercel product at both 375px and 430px using Chrome DevTools. During testing I found that the header labels were being truncated. I returned to AI Studio, constrained the fix to the affected header text, redeployed, and verified that “Zone 4 Automated Tier Arrays” and the product subtitle were fully readable. The three main screens remained usable at mobile width.

---

#### FE3 — All 12 prototype bays are reachable
**Why it matters:** A technician cannot inspect the facility reliably if some bays cannot be selected because of screen width.

**How to test:** On both mobile and desktop, navigate to Screen 2 and verify that BAY-01 through BAY-12 can all be reached and selected.

**Assessment: MET**

**Evidence:** The original selector hid some of the 12 bays. I changed it to a contained horizontal selector with swipe/scroll support, navigation chevrons, and a visible scroll cue. I manually scrolled to BAY-12 and selected it successfully.

---

#### FE4 — The interface distinguishes prototype readings from real external data
**Why it matters:** A technician must not mistake simulated hydro-bay readings for live facility telemetry.

**How to test:** Inspect Screen 1 and determine whether a first-time user can distinguish the prototype bay dataset from the externally sourced live environmental conditions.

**Assessment: MET**

**Evidence:** I replaced unsupported claims such as “12 Bays Online & Telemetry Active” with “12 Bays in Prototype Dataset,” changed “100% Online” to “12 / 12 Bays Available,” and labelled the bay readings as prototype readings. The live section separately identifies itself as “Live External Conditions,” names NEA / data.gov.sg as the source, and states that the data is external city environmental data rather than indoor farm or hydro-bay telemetry.

---

#### FE5 — User-facing claims accurately describe what the product actually does
**Why it matters:** Operational software becomes misleading if interface language implies that notifications, telemetry, or broadcasts exist when they are only simulated in the front end.

**How to test:** Compare user-facing operational claims with the implemented functionality and check whether words such as “live,” “broadcast,” “dispatch,” and “telemetry” are used only where the product can support them.

**Assessment: MET**

**Evidence:** During review I found several unsupported claims inherited from Problem Set 1. I changed “alert queued,” “automated alert broadcast,” and similar wording to describe the actual in-app handover list and summary behavior. I retained “Live External Conditions” only for the section backed by the real external API.

---

### Back-End Criteria

#### BE1 — The product retrieves true external data through its own back end
**Why it matters:** The technician should receive external environmental context from a real provider rather than another hard-coded value.

**How to test:** Open `/api/environment` on the deployed Vercel domain and confirm that it returns structured environmental data and identifies its source.

**Assessment: MET**

**Evidence:** I manually opened the production endpoint and received JSON containing station S111 (Scotts Road), outdoor temperature, relative humidity, observation timestamps, units, and `source: "NEA / data.gov.sg"`. The values also appeared in the Live External Conditions component.

---

#### BE2 — The service exposes a useful health endpoint
**Why it matters:** Someone troubleshooting the product should be able to distinguish a working application from an upstream-data problem without reading the source code.

**How to test:** Open `/api/health` on the deployed Vercel domain and inspect whether it reports the status of the upstream services.

**Assessment: MET**

**Evidence:** The deployed `/api/health` returned `credentialRequired: false`, reported that both the air-temperature and relative-humidity upstream services answered, and reported HTTP status 200 for both.

---

#### BE3 — External-data failure produces an actionable user state
**Why it matters:** An external provider is outside my control. A technician should not see stale-looking data, a blank card, or a broken application when the service cannot be reached.

**How to test:** Prevent the browser from reaching `/api/environment`, reload the deployed product, and inspect the Live External Conditions component.

**Assessment: MET**

**Evidence:** I used Chrome DevTools Network Request Blocking to block the `/api/environment` request. The request failed and the component changed to: “The environmental data service cannot be reached right now. Facility sensor monitoring is unaffected.” A Retry action was also shown, while the rest of HydroCrop Monitor remained usable.

---

#### BE4 — The live-data component communicates distinct service states
**Why it matters:** Loading, empty data, provider refusal, and an unreachable service mean different things and should not all appear as the same spinner or blank area.

**How to test:** Inspect the implemented state handling and manually trigger production states where this can be done safely.

**Assessment: PARTLY MET**

**Evidence:** I manually verified the loading state by applying 3G throttling in Chrome DevTools, where the component displayed “Loading latest Singapore external conditions...”. I manually verified normal success, network-unreachable failure, and recovery after removing the block and using Retry. The code also contains handling for empty and upstream-refusal cases, but I did not deliberately alter the production provider or production function to force those two cases. Therefore I do not claim full production verification of every state.

---

#### BE5 — The external-data integration does not expose a browser credential
**Why it matters:** Credentials should never be exposed in browser code or committed to the repository.

**How to test:** Inspect the architecture and health response to determine whether this provider requires a credential and whether the browser calls the external provider directly.

**Assessment: MET**

**Evidence:** This implementation uses the public NEA / data.gov.sg endpoints and `/api/health` reports `credentialRequired: false`. The front end calls my `/api/environment` route rather than presenting a client-side API credential. No API credential was required for this integration.

---

## Part 2 — Self-Assessment

The largest improvement from Problem Set 1 is not visual. It is that I can now distinguish between something that looks operational and something that is actually supported by the system.

My original HydroCrop Monitor presented the 12 bays as if they were connected live telemetry. During Problem Set 2 I recognized that no public API can truthfully provide pH and EC readings for my fictional facility. Connecting an unrelated real API and relabelling its values as hydro-bay data would have made the API real but the product claim false. I therefore kept the 12-bay dataset as prototype facility data and changed the interface language to say so explicitly.

I used the real API for a different claim that it could genuinely support: external Singapore environmental conditions. The deployed back end now retrieves outdoor temperature and relative humidity from NEA / data.gov.sg and presents them as external context, explicitly stating that they are not indoor farm or hydro-bay telemetry.

I also tested the deployed product rather than accepting successful compilation as evidence that it worked. Testing at 375px and 430px exposed header truncation that I had not noticed earlier. Testing Screen 2 exposed the inability to reach all 12 bay selectors, which led to the horizontally scrollable selector. Production API testing verified `/api/environment` and `/api/health`. Finally, I deliberately blocked `/api/environment` and throttled the network to observe failure and loading behavior.

The criterion I mark only partly met is the complete verification of every external-data state. Loading, success, unreachable failure, and recovery were manually observed in production. Empty-data and upstream-refusal branches exist in the implementation, but I did not deliberately manipulate the production provider to force them. I prefer to record that limitation rather than claim a test I did not perform.

---

## Part 3 — Human–AI Collaboration Assessment

### Q1 — Where did the agent make me faster, and by how much?

The agent made me fastest at implementation. I could describe a bounded change — for example, add a horizontally scrollable 12-bay selector without changing the rest of Screen 2, correct two truncated header labels, or replace misleading operational wording — and AI Studio could identify and edit the relevant React components much faster than I could have written the code myself.

For the back-end integration, the agent also accelerated the translation from a tested API response into `/api/environment`, `/api/health`, and the front-end state handling. As a non-programmer, doing those implementation tasks independently would likely have taken me several hours and required learning the project structure first. With the agent, individual constrained revisions were usually produced within minutes. The time saving was therefore substantial, but only after I had decided what the system should actually do.

### Q2 — Where did it cost me time, and whose fault was that?

The agent cost me time when my instructions or verification criteria were too broad. This was already visible in Problem Set 1, when a more complicated layout prompt produced an internal error and did not resolve the Screen 3 button arrangement correctly.

In Problem Set 2, I learned to reduce that cost by changing one bounded thing at a time and explicitly telling the agent what must remain unchanged. Even then, the first responsive pass did not reveal every usability problem. I later discovered that some header text was truncated and that the 12-bay selector could not expose every bay.

I would not assign that entirely to the agent. The agent produced what I requested, but I was responsible for deciding what counted as acceptable and for testing the result. The expensive part of vague prompting is not only bad code; it is the additional verification and correction that follows.

### Q3 — Did it ever hand me something that looked right and was not?

Yes. The strongest example was the original operational language. “12 Bays Online & Telemetry Active,” “100% Online,” live alert queues, and automated broadcast language all looked appropriate for a professional farm dashboard. However, they were not supported by the implementation. The 12 bays came from prototype data and there was no real notification service broadcasting alerts to another team.

This problem survived because the language looked plausible. I only recognized it when I explicitly audited what each screen claimed and asked what source would be required to make each claim true.

A second example was responsive design. The first mobile version looked substantially improved, but actual 375px and 430px testing exposed truncated text. The lesson for me is that a convincing screenshot or successful build is not evidence that a product criterion has been met.

### Q4 — What did I have to know in order to supervise it?

I did not need to become a React programmer, but I needed enough technical understanding to ask the right questions and verify the answers. I needed to understand the difference between front-end mock data and a real upstream source, why a serverless `/api/` route sits between the browser and an external provider, what an HTTP 200 response means, what `/api/health` is useful for, and why testing should happen on the deployed Vercel URL rather than assuming the AI Studio preview behaves like Vercel.

I also had to learn practical inspection techniques. I used Bruno to inspect provider responses before implementation, opened the deployed JSON endpoints directly, used Chrome DevTools responsive widths, used Network Request Blocking to make `/api/environment` unreachable, and used 3G throttling to observe the loading state.

The important supervisory knowledge was therefore not memorizing syntax. It was knowing what evidence would distinguish “the agent says it works” from “I have observed it working.”

### Q5 — Which decisions did I keep, and should I have kept more or fewer?

I kept the decisions that determine what the product means. I decided not to pretend that the prototype pH and EC values were live. I decided that the real API should provide external Singapore environmental context instead. I decided to retain the three-screen handover workflow, keep technician judgement in the flagging process, correct unsupported broadcast claims, require all 12 bays to remain reachable, and test the deployed product at mobile widths.

I delegated implementation details such as React component changes, responsive classes, scroll behavior, and API parsing to the agent.

Compared with Problem Set 1, I think I kept the right decisions more deliberately. In my previous reflection I wrote that I “only controlled the click paths on the screen, not the underlying codebase.” I still do not control the code line by line, but in this problem set I controlled the claims, data source, failure behavior, acceptance criteria, and verification. That is a more useful division of labor than either accepting everything the agent produces or trying to write every line myself.

### Q6 — What would this mean for a team of thirty?

For a team of thirty, AI could greatly increase implementation speed, but it would also multiply plausible mistakes if every person independently accepted agent output without common standards.

I would therefore standardize the human side of the workflow: agreed criteria before prompting, shared guardrails for secrets and API architecture, small scoped prompts, explicit truthfulness checks for user-facing claims, and a deployment test checklist covering mobile behavior, health endpoints, success states, and failure states. Prompt histories would also be useful because they show not only what the agent produced but what instructions and constraints led to it.

The main organizational implication is that AI does not remove the need for technical and managerial judgement. It moves more of that judgement toward specification, verification, and deciding what evidence is sufficient. A team of thirty people who can generate code quickly but cannot distinguish a plausible result from a supported one would create risk faster. A team using common criteria and verification practices could use the same agents to increase delivery speed without giving up accountability.

---

## Production Verification Note

The back end was independently verified on the deployed Vercel URL.

- `/api/environment` returned live structured external environmental data from NEA / data.gov.sg.
- `/api/health` reported successful responses from both upstream environmental endpoints.
- 375px and 430px mobile layouts were manually inspected.
- BAY-12 was manually reached and selected through the horizontal bay selector.
- Loading was manually observed using Chrome DevTools 3G throttling.
- Unreachable/error behavior was manually observed by blocking `/api/environment`.
- Recovery was manually verified after removing the block and retrying.
- Empty-data and upstream-refusal branches were not deliberately forced in production.
