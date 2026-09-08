# PROMPTS.md - [HydroCrop Monitor]
**Student:** [ZHIKUN ZHU] · **Course:** MGMT 6110 · **Problem Set 1**

**User sentence:** A [vertical farm operations technician] opens this screen during shift handover to [monitor real-time pH and nutrient (EC) levels across 12 automated hydro bays, inspect and flag abnormal bays with technician notes, and complete the shift handover], and knows it worked when [the flagged bay status updates seamlessly and an automated handover summary report is generated for the incoming team].

**Live link:** [mgmt6110week02aaisbuildwithaistudio.vercel.app]

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
