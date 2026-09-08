# HydroCrop Monitor - Vertical Farm Shift Handover Tool

**Live Application Link:** [https://mgmt6110week02aaisbuildwithaistudio.vercel.app](https://mgmt6110week02aaisbuildwithaistudio.vercel.app)

---

## Target User & Business Function Declaration
* **User Type Selected**: Option B (Internal User)
* **Target User Role**: Vertical Farm Operations Technician
* **Business Function Augmented**: Shift Handover & Daily Facility Monitoring

## User Sentence
A vertical farm operations technician opens this app during shift handover to monitor real-time pH and nutrient (EC) levels across 12 automated hydro bays, inspect and flag abnormal bays with technician notes, and complete the shift handover, and knows it worked when the flagged bay status updates seamlessly and an automated handover summary report is generated for the incoming team.

---

## App Architecture & Screen Overview
This application consists of 3 integrated screens designed to support the complete daily shift handover workflow:

1. **Screen 1: Shift Handover Overview (Dashboard Screen)**
   - Displays real-time pH, EC (nutrient), light, and health status across 12 automated hydroponic bays.
   - Features quick filtering ("All Bays" vs. "Action Needed") and KPI summary cards for immediate shift assessment.

2. **Screen 2: Bay Inspection & Flagging Form (Action Screen)**
   - Allows technicians to select a bay out of optimal range, view detailed metrics, and log issue categories (e.g., pH Spike, Pump Failure).
   - Submitting the form instantly updates the bay's status to "Flagged" across the system.

3. **Screen 3: Handover Summary & Logs (Shift Completion Screen)**
   - Aggregates all flagged bays and unresolved alerts generated during the shift.
   - Includes a "Confirm Shift Handover" action that finalizes the current shift report and notifies the incoming team.

---

## Repository File Structure
* `README.md`: Project declaration, user sentence, and architecture overview.
* `PROMPTS.md`: Complete log of prompt iterations and AI interaction history.
* `REFLECTION.md`: Detailed reflection report answering Q1 to Q5.
* `mockData.js`: Centralized mock dataset containing 12 hydroponic bay parameters (One Data File Rule).
