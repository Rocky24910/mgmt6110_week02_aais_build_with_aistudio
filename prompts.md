# PROMPTS.md - [HydroCrop Monitor]
**Student:** [ZHIKUN ZHU] · **Course:** MGMT 6110 · **Problem Set 1**

**User sentence:** A [vertical farm operations technician] opens this screen during shift handover to [monitor real-time pH and nutrient (EC) levels across 12 automated hydro bays, inspect and flag abnormal bays with technician notes, and complete the shift handover], and knows it worked when [the flagged bay status updates seamlessly and an automated handover summary report is generated for the incoming team].

**Live link:** <https://mgmt6110week02aaisbuildwithaistudio.vercel.app>

---

## Target User & Business Function Declaration
**User Type Selected**: Option B (Internal User)
**Target User Role**: Vertical Farm Operations Technician
**Business Function Augmented**: Shift Handover & Daily Facility Monitoring

---

## Prompt 1 - the master prompt
```
ROLE: You are a senior front-end developer building a React web application using clean component architecture.

GOAL: Build the front-end dashboard for "HydroCrop Monitor", a web tool for an internal vertical farm operations technician (Option B: Internal User) in the "Shift Handover & Daily Facility Monitoring" business function. 

USER SENTENCE:
A vertical farm operations technician opens this screen during shift handover to check pH and nutrient (EC) levels across 12 automated hydro bays and flag abnormal ones, and knows it worked when the flagged bay list updates and automated alerts are set for the incoming shift.

SCREENS & ARCHITECTURE:
Build the application with 3 clear, navigable screens/tabs without reloading the page:
1. Screen 1: "Shift Handover Overview" (Dashboard Screen)
   - Displays real-time status across 12 automated hydroponic bays.
   - Highlights key metrics per bay: Bay ID, Crop Type, pH Level, EC (Nutrient) Level, Temperature, and Health Status (Normal / Warning / Critical).
   - Includes quick filters (e.g., "All Bays", "Action Needed / Out of Range") and summary KPI cards at the top.

2. Screen 2: "Bay Inspection & Action Form" (Detail & Flagging Screen)
   - Allows technicians to select a specific bay to inspect detailed trend logs.
   - Features a functional "Flag for Inspection" form where technicians can select issue categories (e.g., pH Spike, Pump Failure, Nutrient Depletion), add technician notes, and set priority tags.
   - Clicking "Submit Flag" updates the bay status to "Flagged" across the entire application.

3. Screen 3: "Handover Summary & Logs" (Shift Completion Screen)
   - Generates an automated shift handover report summarizing all flagged bays, unresolved alerts, and technician logs created during the shift.
   - Features a "Confirm Shift Handover" button that locks the current shift log and creates an automated alert notification for the incoming shift team.

OUTPUT:
- A fully functional, responsive React app.
- IMPORTANT (One Data File Rule): Keep ALL mock data in ONE dedicated, separate data file (e.g., mockData.js) with at least 12 rows of detailed bay data, completely separated from the UI components.
- Mobile-first layout: Ensure every screen is clearly readable and touch-friendly on a smartphone screen at arm's length.
- When complete, list all created files and briefly explain what each file holds.

GUARDRAILS:
- Front-end UI and mock data ONLY.
- DO NOT call the Gemini API, Google Search API, or any LLM backend.
- DO NOT call outside services, fetch external URLs, or use real databases, authentication, or analytics.
- No real company names, logos, or trademarks. Use invented, generic names only.

CONTEXT:
Individual Problem Set 1 for MGMT 6110 Human-AI Collaboration at SMU. Built in Google AI Studio, deployed to Vercel, and tested on mobile screens during Week 3. I am not a programmer—if you make design or architectural choices I did not specify, list them concisely in one line rather than burying them in code.
```
**What came back:** A running app, 7 types of files, preview loaded. It also added three new sections including "Loading States & Empty States" , "Color-coded Status Badges" and "Search & Quick Filters" that I never asked for.

**What I changed next and why:** Added "optimize the color combination of the main interface" for the UI because the color combination is not appealing, and it didn't change anything else.

---

## Prompt 2 - optimize the layout of the main interface's buttons
```
When modify the layout of the UI, Google AIstudio directly adjusted my interface according to the standards of Shift Banner Action Cluster, Segmented Filter Control Bar and Bay Card Action Buttons.
Change nothing else.
```
**What came back:** Successfully executed. The buttons on screen 1 have been optimized, giving an overall harmonious appearance. One file touched.

**What I changed next and why:** Nothing. Completed the overall optimization.

---

## Prompt 3 - optimize the buttons on screen 3
```
Optimize the positions of the three buttons on screen 3: "Pending Handover Confirmation", "Print/Save PDF", and "Confirm Shift Handover". 
Change nothing else.
```
**What came back:** An internal error occurred., no file touched.

**What I changed next and why:** I once again asked Aistudio to only update the button arrangement in the "Handover Summary & Logs" section of the screen (placing "Pending Handover Confirmation", "Print/Save PDF", and "Confirm Shift Handover" in the same row and change nothing else.). Completed the overall optimization.

---

# Problem Set 2 — Put a Real Back End Behind It

## Step 1 — Identify unsupported claims

Before adding a back end, I reviewed the claims made by my Problem Set 1 product.

### Claim 1 — Live hydro-bay telemetry
The application presents pH, EC, water temperature, reservoir level and flow readings across 12 hydroponic bays as if they are live telemetry.

Current reality:
These values come from the existing mock dataset rather than a real farm IoT sensor system.

Decision:
Do not connect an unrelated public API and pretend it represents the hydro bays. Reframe these readings as prototype/simulated facility sensor data.

### Claim 2 — External operating environment
The current product does not provide any real external environmental context for the facility.

Decision:
Add real Singapore outdoor temperature and relative humidity data from data.gov.sg / NEA through my own back-end endpoint.

### Claim 3 — Automated handover broadcast
The interface states that alerts are broadcast or dispatched to the incoming team.

Current reality:
This is simulated in the front end and does not send a real external notification.

Decision:
Reframe this wording unless a real notification service is implemented later.

---
## Step 2 — Manual API verification before prompting

Before asking the AI agent to write any back-end code, I called the proposed public API manually in Bruno and inspected the real response structure.

### Test 1 — Air temperature

GET:
https://api-open.data.gov.sg/v2/real-time/api/air-temperature

Result:
Successful response.

Relevant structure:
- data.stations
- data.readings[0].timestamp
- data.readings[0].data
- readingUnit

Example verified station:
- Station ID: S111
- Station: Scotts Road
- Temperature: 31.2 °C
- Observed at: 2026-09-13T16:48:00+08:00

### Test 2 — Relative humidity

GET:
https://api-open.data.gov.sg/v2/real-time/api/relative-humidity

Result:
Successful response.

Example verified station:
- Station ID: S111
- Station: Scotts Road
- Relative humidity: 64.3%
- Observed at: 2026-09-13T16:53:00+08:00

### Decision
Both endpoints use the same station ID, so the back end can combine temperature and humidity from S111.

I will label these values as external Singapore environmental conditions rather than hydro-bay conditions.

I also noticed that the two readings can have different timestamps, so the product should not imply that both values were observed at exactly the same moment.

---

## Prompt 4 — First Problem Set 2 backend integration attempt

[ROLE:
You are a senior full-stack engineer extending my EXISTING React application,
"HydroCrop Monitor". This is an existing working product from Problem Set 1.
Do not rebuild it or replace its current architecture.

GOAL:
Add one real back-end data integration to the existing product.

The application currently contains prototype/mock hydro-bay sensor data for
12 hydroponic bays. Do NOT replace those pH, EC, water-temperature, reservoir,
flow, flagging, technician-note, or handover functions with public data.

Instead, add a clearly separate "Live External Conditions" section to Screen 1
using real Singapore environmental data from data.gov.sg / NEA.

The external conditions must never be described as hydro-bay sensor readings
or indoor farm conditions.

--------------------------------------------------
REAL DATA SOURCE — VERIFIED MANUALLY BEFORE THIS PROMPT
--------------------------------------------------

I manually tested both endpoints in Bruno and confirmed that they return
successful JSON responses without an API key.

Air temperature:
GET https://api-open.data.gov.sg/v2/real-time/api/air-temperature

Relative humidity:
GET https://api-open.data.gov.sg/v2/real-time/api/relative-humidity

Use station:
S111 — Scotts Road

Verified real response examples:

AIR TEMPERATURE:
{
  "code": 0,
  "data": {
    "readings": [
      {
        "timestamp": "2026-09-13T16:48:00+08:00",
        "data": [
          {
            "stationId": "S111",
            "value": 31.2
          }
        ]
      }
    ],
    "readingUnit": "deg C"
  },
  "errorMsg": ""
}

RELATIVE HUMIDITY:
{
  "code": 0,
  "data": {
    "readings": [
      {
        "timestamp": "2026-09-13T16:53:00+08:00",
        "data": [
          {
            "stationId": "S111",
            "value": 64.3
          }
        ]
      }
    ],
    "readingUnit": "percentage"
  },
  "errorMsg": ""
}

Important:
The timestamps from the two endpoints may differ.
Do not pretend that temperature and humidity were measured at exactly
the same time.

--------------------------------------------------
BACK-END REQUIREMENTS
--------------------------------------------------

Create:

1. /api/environment

This server-side endpoint must fetch BOTH data.gov.sg endpoints.

Find stationId "S111" in each response.

Return only the fields the front end needs, in clean JSON similar to:

{
  "stationId": "S111",
  "station": "Scotts Road",
  "temperature": 31.2,
  "temperatureUnit": "deg C",
  "temperatureObservedAt": "...",
  "humidity": 64.3,
  "humidityUnit": "percentage",
  "humidityObservedAt": "...",
  "source": "NEA / data.gov.sg"
}

Do not hard-code the temperature or humidity values.
They must come from the live upstream responses.

Check response.ok before attempting to parse/use the response.

If either upstream service returns a non-2xx response, return a useful
JSON error response rather than crashing.

If station S111 is absent from a successful response, treat that as an
empty-data state rather than inventing a value.

Use sensible Cache-Control headers because these readings do not need
to be fetched again on every browser request.

2. /api/health

Create a health endpoint that checks whether the environmental upstream
services are reachable.

This API does NOT require an API key.

Do not invent a credential or environment variable.

The health response should clearly report:
- service status
- credentialRequired: false
- temperature upstream status
- humidity upstream status
- checkedAt

It must return something useful when an upstream service is unavailable.

--------------------------------------------------
FRONT-END REQUIREMENTS
--------------------------------------------------

On Screen 1 only, add a compact section titled:

"Live External Conditions"

Display:
- Outdoor Temperature
- Relative Humidity
- Station: Scotts Road
- Last observation time(s)
- Source: NEA / data.gov.sg

The source attribution should be visible.

Clearly label these values as EXTERNAL Singapore environmental
conditions.

Do NOT describe them as:
- hydro-bay temperature
- farm sensor data
- indoor conditions
- telemetry from the 12 bays

The existing hydro-bay values remain prototype/mock facility data.

Use these four distinct user-facing states:

LOADING:
"Loading latest Singapore external conditions…"

EMPTY DATA:
"No recent external readings are available from this station."

UPSTREAM ERROR:
"External conditions are temporarily unavailable from data.gov.sg."

UNREACHABLE:
"The environmental data service cannot be reached right now. Facility
sensor monitoring is unaffected."

Do not replace these four states with one generic spinner or one generic
error message.

--------------------------------------------------
FILE / DEPLOYMENT REQUIREMENTS
--------------------------------------------------

The API functions must be placed in:

api/

at the PROJECT ROOT, as siblings of package.json.

Do NOT put the API functions inside src/.

Make sure the project remains compatible with Vercel deployment.

If package.json needs "type": "module" for the server functions, add it
only if appropriate for the existing project and explain the change.

Do not add unnecessary npm packages.

--------------------------------------------------
GUARDRAILS
--------------------------------------------------

Change nothing unrelated to this integration.

DO NOT:
- redesign the existing application
- change the overall colour palette
- fix mobile responsiveness yet
- change the Screen 3 button layout yet
- remove the existing 12 hydro bays
- change the existing flagging workflow
- change technician notes
- change the handover workflow
- add authentication
- add a database
- add a notification service
- call an LLM API
- invent an API key
- expose or create credentials
- rewrite working screens

This is one controlled back-end integration only.

--------------------------------------------------
BEFORE YOU FINISH
--------------------------------------------------

Check that:

1. /api/environment exists at the project root.
2. /api/health exists at the project root.
3. The front end calls my own /api/environment endpoint, NOT data.gov.sg
   directly from browser code.
4. Temperature and humidity are not hard-coded.
5. Station S111 is selected from the real response.
6. The four different UI states exist.
7. Existing hydro-bay interactions still work.
8. No unrelated UI changes were made.

When complete, tell me:

A. Exactly which files you created.
B. Exactly which existing files you modified.
C. What each change does.
D. Whether you encountered any assumption or limitation.
E. What I should test manually before deploying.

Do not make any additional changes after giving me that report.]

**What came back:**

Google AI Studio created:

- `api/environment.ts`
- `api/health.ts`
- `src/components/LiveExternalConditions.tsx`

It also modified:

- `vite.config.ts`
- `src/components/ShiftHandoverOverview.tsx`

The implementation connected the existing HydroCrop Monitor to the two verified
data.gov.sg / NEA endpoints for air temperature and relative humidity, selected
station S111 (Scotts Road), added `/api/environment` and `/api/health`, and added
a Live External Conditions section to Screen 1.

It also created local Vite middleware so the API routes could be exercised during
AI Studio/local preview.

**What I changed next and why:**

I did not proceed directly to deployment.

Although the architecture broadly matched the intended back-end design, I noticed
that Google AI Studio created TypeScript serverless files
`api/environment.ts` and `api/health.ts`.

The assignment's provided master-prompt structure specifically used
`api/[NAME].js` and `api/health.js`. I therefore decided to issue a more constrained
follow-up prompt rather than accepting the first implementation unchanged.

I also made the no-credential case explicit. The selected data.gov.sg / NEA
endpoints require no API key, so I did not want the generic credential instructions
in the assignment template to lead to an invented environment variable or a fake
`keyConfigured` value.

Action: issued a revised master prompt requiring `.js` serverless functions,
explicit no-credential handling, and no unrelated changes.

---

## Prompt 5 — Revised backend master prompt

[ROLE: You are a senior full-stack developer working in my existing project. Do not
rewrite what is already there; add to it.

GOAL: My existing HydroCrop Monitor screen currently presents hydro-bay pH, EC,
water temperature, reservoir, flow and telemetry values using prototype/mock data.
Those values cannot truthfully be replaced by an unrelated public API, so leave
those existing hydro-bay values and workflows unchanged.

Instead, add one new, clearly separated claim to Screen 1: live external Singapore
environmental conditions. Use real outdoor air temperature and relative humidity
from data.gov.sg / NEA, fetched through serverless functions of my own.

The new data must always be labelled as EXTERNAL Singapore environmental conditions.
Never describe it as indoor farm conditions, hydro-bay sensor data, or telemetry
from the 12 hydroponic bays.

1) api/environment.js — calls BOTH of these real endpoints:

   https://api-open.data.gov.sg/v2/real-time/api/air-temperature

   https://api-open.data.gov.sg/v2/real-time/api/relative-humidity

   Use station ID S111, Scotts Road.

   Return only the fields my screen needs, and nothing else:
   - stationId
   - station name
   - temperature
   - temperature unit
   - temperature observation timestamp
   - relative humidity
   - humidity unit
   - humidity observation timestamp
   - source

   Do not hard-code the temperature or humidity values.
   The two observation timestamps may differ, so preserve them separately.

2) api/health.js — reports whether both upstream data.gov.sg endpoints answered,
including the HTTP status returned by each upstream.

   IMPORTANT CREDENTIAL ADAPTATION:
   This specific provider does NOT require an API key or credential.
   Therefore do not invent a credential, do not create a fake environment variable,
   and do not create a fake keyConfigured:true value.

   Instead, report:
   - credentialRequired: false
   - whether the air-temperature upstream answered
   - the HTTP status returned by the air-temperature upstream
   - whether the relative-humidity upstream answered
   - the HTTP status returned by the relative-humidity upstream
   - checkedAt

3) On Screen 1, add a compact section titled:

   "Live External Conditions"

   Display:
   - Outdoor Temperature
   - Relative Humidity
   - Station: Scotts Road (S111)
   - the observation time for temperature
   - the observation time for humidity
   - Source: NEA / data.gov.sg

   Decide what the user sees in each of these four cases. I want four different
   sentences, not one spinner:

   LOADING:
   "Loading latest Singapore external conditions…"

   EMPTY:
   "No recent external readings are available from this station."

   UPSTREAM REFUSED / NON-2XX:
   "External conditions are temporarily unavailable from data.gov.sg."

   UPSTREAM UNREACHABLE / NETWORK FAILURE:
   "The environmental data service cannot be reached right now. Facility sensor
   monitoring is unaffected."


OUTPUT: Both functions must be at api/ in the PROJECT ROOT, siblings of package.json,
never inside src/.

Create exactly:
- api/environment.js
- api/health.js

If an earlier version of this project contains api/environment.ts or api/health.ts
from a previous attempt, replace those with the required .js versions rather than
keeping duplicate implementations.

If this project has a server entry file, register the same two routes there too,
because that is the shape the preview can answer. If it has no server file, skip
that and tell me so rather than inventing one.

Make sure package.json contains:

"type": "module"

If it already contains this, leave it unchanged.

CREDENTIAL NOTE:
The provider selected for this project, data.gov.sg / NEA, requires no API key.
Therefore the template requirement to return 503 before fetch when a credential
is missing is NOT APPLICABLE to this integration. Do not invent a credential or
environment variable merely to satisfy that generic requirement.

AFTER each fetch, check response.ok before reading the body.

A refusal may have an empty or non-JSON body, so do not call .json() before checking
response.ok. On a non-2xx reply, return the upstream HTTP status and a one-line reason
in your own JSON rather than crashing with a generic 500.

If station S111 is absent from an otherwise successful response, return an explicit
empty-data result. Never invent a reading.

Cache the successful environmental response for 60 seconds with:

Cache-Control: public, s-maxage=60, stale-while-revalidate=120

The source changes frequently, so this short cache should preserve freshness while
avoiding unnecessary repeated upstream requests.

In the Live External Conditions section, visibly credit the source as:

"Source: NEA / data.gov.sg"


GUARDRAILS: Never write a credential into any file, comment or README. This provider
does not require one, so do not create one.

Never create a variable whose name starts with VITE_.

Never call data.gov.sg directly from browser code; every upstream call must happen
inside api/.

The browser may call only my own /api/environment endpoint.

Never print credentials or any part of credentials in a response or log.

No new npm packages.
No database.
No login.
No notification service.
No LLM API.

Leave every screen I already have working exactly as it is.

Do not:
- redesign the existing application
- change the overall colour palette
- fix mobile responsiveness in this prompt
- change the Screen 3 button layout in this prompt
- remove the existing 12 hydro bays
- replace the existing mock hydro-bay data with public weather data
- change bay inspection or flagging
- change technician notes
- change the handover workflow

This prompt is for ONE controlled real-back-end integration only.


CONTEXT: Deployed on Vercel from GitHub.

This selected provider requires NO credential and therefore there is no Vercel
environment variable for this API integration.

I manually called the real endpoints in Bruno immediately before this prompt.

A real response from the air-temperature endpoint included:

{
  "code": 0,
  "data": {
    "readings": [
      {
        "timestamp": "2026-09-13T16:48:00+08:00",
        "data": [
          {
            "stationId": "S109",
            "value": 32.2
          },
          {
            "stationId": "S111",
            "value": 31.2
          }
        ]
      }
    ],
    "readingType": "DBT 1M F",
    "readingUnit": "deg C"
  },
  "errorMsg": ""
}

A real response from the relative-humidity endpoint included:

{
  "code": 0,
  "data": {
    "readings": [
      {
        "timestamp": "2026-09-13T16:53:00+08:00",
        "data": [
          {
            "stationId": "S109",
            "value": 62.5
          },
          {
            "stationId": "S111",
            "value": 64.3
          }
        ]
      }
    ],
    "readingType": "RH 1M F",
    "readingUnit": "percentage"
  },
  "errorMsg": ""
}

The real responses also contain a stations array confirming:

{
  "id": "S111",
  "deviceId": "S111",
  "name": "Scotts Road",
  "location": {
    "latitude": 1.3106,
    "longitude": 103.8365
  }
}

Do not assume any response field that is not demonstrated above.

When finished, tell me:
1. Exactly which files you created.
2. Exactly which existing files you modified.
3. Whether a server entry file existed and, if so, what you changed there.
4. Whether package.json already contained "type": "module".
5. How /api/environment handles success, empty data, non-2xx upstream responses,
   and unreachable upstream services.
6. How /api/health reports both upstream HTTP statuses.
7. What I should manually verify before I deploy to Vercel.

Do not make any unrelated changes.]

**What came back:**

Google AI Studio revised the implementation to match the more constrained
master-prompt structure.

### Files created

- `api/environment.js`
- `api/health.js`
- `src/components/LiveExternalConditions.tsx`

The previous `api/environment.ts` and `api/health.ts` files from Prompt 4 were
removed rather than retained as duplicate implementations.

### Existing files modified

- `vite.config.ts`
- `src/components/ShiftHandoverOverview.tsx`

`package.json` was not modified because it already contained:

`"type": "module"`

No custom server entry file such as `server.js` or `server.ts` existed, so Google
AI Studio did not invent one.

### Backend behavior

`api/environment.js` calls both verified data.gov.sg / NEA endpoints:

- Air temperature
- Relative humidity

It selects station S111 (Scotts Road), keeps the temperature and humidity
observation timestamps separate, and returns only the fields required by the
front end.

It handles four relevant conditions:

1. Successful live data
2. Station S111 missing from an otherwise successful response
3. A non-2xx response from the upstream service
4. An unreachable upstream service

Successful environmental responses are cached using:

`Cache-Control: public, s-maxage=60, stale-while-revalidate=120`

`api/health.js` checks both upstream services independently and reports their HTTP
statuses. Because these providers require no credential, it returns:

`credentialRequired: false`

rather than inventing an API key or environment variable.

### Front-end behavior

Google AI Studio added a `Live External Conditions` card only to Screen 1.

It is explicitly labelled as external Singapore environmental data rather than
hydro-bay telemetry.

It displays:

- Outdoor Temperature
- Relative Humidity
- Scotts Road (S111)
- Separate observation timestamps
- Source: NEA / data.gov.sg

It also implements four different user-facing states for loading, empty data,
upstream refusal and upstream unreachability.

The existing 12 hydroponic bays, mock pH/EC telemetry, filters, inspection workflow,
technician notes and handover workflow were left unchanged.

**What I accepted / rejected / changed and why:**

I accepted this revised architecture provisionally.

I accepted:

- the `.js` serverless functions at the project-root `api/` folder;
- the use of my own `/api/environment` endpoint between the browser and data.gov.sg;
- the separate `/api/health` diagnostic endpoint;
- the explicit `credentialRequired: false` treatment;
- station S111 (Scotts Road), because I had already verified that station manually
  in both real API responses using Bruno;
- separate timestamps for temperature and humidity;
- the four distinct failure/loading states;
- the decision to keep the existing hydro-bay readings as prototype/mock facility
  data rather than pretending that public weather data represented indoor sensors.

I also accepted the existing local Vite middleware provisionally because it allows
the routes to be exercised during preview without inventing a separate server file.

However, I have NOT yet accepted the back end as proven to work in production.

Google AI Studio reporting that the code is complete, or the local preview working,
is not sufficient evidence that Vercel will execute the serverless functions
correctly.

My next verification step is therefore to push the revised code to GitHub and test
the deployed Vercel endpoints in this order:

1. `/api/health`
2. `/api/environment`
3. Screen 1 of the live product

I intentionally did not fix mobile responsiveness or the Screen 3 action-button
layout in this prompt. Those are separate front-end issues and will be addressed
only after the back end has been independently verified.

---
