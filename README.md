# HydroCrop Monitor — Vertical Farm Shift Handover Tool

**Student:** ZHIKUN ZHU  
**Course:** MGMT 6110 — Human-AI Collaboration  
**Problem Set:** Problem Set 2  
**Live Application:** https://mgmt6110week02aaisbuildwithaistudio.vercel.app

---

## Project Overview

HydroCrop Monitor is an AI-assisted vertical farm shift handover application designed for operations technicians.

The application supports a three-stage workflow:

1. Review facility and hydroponic bay conditions.
2. Inspect and flag bays requiring attention.
3. Review and confirm the shift handover summary.

For Problem Set 2, the original front-end prototype was extended with a server-side back end deployed on Vercel and connected to a real public environmental data provider.

---

## Target User & Business Function

- **User Type:** Option B — Internal User
- **Target User Role:** Vertical Farm Operations Technician
- **Business Function:** Shift Handover & Daily Facility Monitoring

### User Sentence

A vertical farm operations technician opens this app during shift handover to review prototype pH and nutrient (EC) readings across 12 hydroponic bays, inspect and flag abnormal bays with technician diagnostic notes, review live external Singapore environmental conditions, and complete an in-app shift handover summary for the incoming team.

---

## Application Architecture & Screen Overview

The application consists of three integrated screens supporting the shift handover workflow.

### Screen 1 — Shift Handover Overview

- Displays prototype facility readings across 12 hydroponic bays.
- Shows pH, EC, water temperature, reservoir level, flow rate, and bay status.
- Provides KPI summary cards, search, and filtering for bays requiring attention.
- Includes **Live External Conditions** showing current Singapore outdoor temperature and relative humidity.
- Clearly distinguishes external city environmental data from indoor farm or hydro-bay prototype readings.

### Screen 2 — Bay Inspection & Action

- Allows technicians to select and inspect individual bays.
- Displays detailed prototype readings and shift trend information.
- Allows technicians to record issue category, priority, diagnostic notes, and required actions.
- Updating a flag records the bay in the incoming shift handover list.

### Screen 3 — Handover Summary & Logs

- Aggregates flagged bays and abnormal bays requiring attention.
- Includes a facility pre-handover verification checklist.
- Provides a technician shift activity log and audit trail.
- Allows the technician to review and confirm the shift handover summary.
- Confirmation records the handover state inside the application; it does not claim to send an external notification.

---

## Problem Set 2 — Real Back-End Integration

Problem Set 2 adds a real server-side data path to the original prototype.

### Live External Data

The application retrieves real Singapore environmental observations from:

**NEA / data.gov.sg**

The live external conditions section displays:

- Outdoor air temperature
- Relative humidity
- Observation timestamps
- Reporting station information

The current selected station is:

**Scotts Road (S111)**

These readings are explicitly presented as **external Singapore environmental conditions** and are not represented as measurements from the hydroponic bays.

---

## Prototype Data vs. Live Data

An important design decision in Problem Set 2 was to distinguish between prototype facility data and genuinely live external data.

### Prototype Facility Data

The following values remain part of the prototype dataset:

- Hydroponic bay pH
- EC / nutrient readings
- Water temperature
- Reservoir levels
- Flow rates
- Bay health/status
- Technician notes and simulated shift histories

These values are not claimed to be live IoT telemetry.

### Live External Data

Outdoor temperature and relative humidity are retrieved through the application's server-side API from NEA / data.gov.sg.

This separation prevents a public environmental API from being incorrectly presented as the source of private vertical-farm sensor data.

---

## Back-End API Endpoints

### `/api/environment`

Fetches current external environmental observations from the real upstream provider and returns a simplified response for the front end.

Example response:

```json
{
  "stationId": "S111",
  "station": "Scotts Road",
  "temperature": 31.7,
  "temperatureUnit": "deg C",
  "relativeHumidity": 66.7,
  "humidityUnit": "percentage",
  "source": "NEA / data.gov.sg"
}
