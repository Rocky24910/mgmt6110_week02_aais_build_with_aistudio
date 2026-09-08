# REFLECTION.md - [HydroCrop Monitor]
**Student:** [ZHIKUN ZHU] · **Course:** MGMT 6110 · **Problem Set 1 Reflection Report**

---
## Q1: Who are your users, and what changes for them?

### Answer
* **User Identity & Context**: My target users are **Vertical Farm Operations Technicians** (I chose **Option B: Internal User**). They work in indoor hydroponic facilities, monitoring crop environments across automated bays.
* **Business Function**: **Shift Handover & Daily Facility Monitoring**.
* **Daily Workflow Without This Product**: Before this app, technicians had to walk around 12 hydroponic bays with handheld probes, write pH and EC readings on paper clipboards, manually flag issues, and spend 15–20 minutes at the end of each shift verbally going through paper notes with the incoming team.
* **What Changes with This Product**: My app removes paper clipboards and manual verbal check-ins completely. **It specifically replaces the 20 minutes spent each shift reading handwritten logs and manually checking bay statuses.** Technicians now view bay metrics on Screen 1, log issues in Screen 2, and automatically generate a locked handover report in Screen 3 that notifies the incoming team instantly.

---

## Q2: Augmented capacity and constrained capacity

### Answer
* **Augmented Capacity**: As a non-coder, my capacity was transformed. I built a working, 3-screen React application connected to a 12-row mock dataset in **under 45 minutes**—something that would have taken me weeks to learn and code manually. I focused entirely on defining business rules and shift workflows while the AI handled all the React components and UI styling.
* **Constrained Capacity (A Real Moment)**: My biggest constraint was that **I couldn't read or edit the code myself, making me entirely dependent on the AI and turning verification into a bottleneck.** A clear moment this happened was after Prompt 1: the AI created the dashboard using a default warm color scheme. Because I couldn't write CSS to tweak the colors myself, I tried asking AI Studio to adjust the main interface colors. However, it made no noticeable changes, and I was too afraid to push further because asking for broad UI layout changes nearly broke my working data-switching logic. I realized I only controlled the click paths on the screen, not the underlying codebase.

---

## Q3: In the loop, on the loop, out of the loop: where was your judgment actually needed?

### Answer
* **Where My Judgment Changed the Outcome (In the loop)**: In Prompt 1, I directly intervened by enforcing the "One Data File Rule" (`Keep ALL mock data in ONE dedicated, separate data file (e.g., mockData.js)`). This prevented the AI from burying data inside UI components and ensured clean architecture.
* **Where I Added Nothing (Nominally in the loop)**: In Prompt 2, when I asked the AI to adjust button layouts using a "Shift Banner Action Cluster" style, it returned a newly styled interface. I accepted it immediately without checking the generated CSS code because I couldn't evaluate whether the code was clean or bloated.
* **Looking Forward**:
  * **Where the human MUST be OUT of the loop**: **Automated range checks on incoming pH/EC sensor data**. Calculating whether a bay is "Normal" or "Warning" happens thousands of times a day. As long as sensor accuracy is tested and calibrated beforehand, letting AI or scripts do this automatically saves time and removes human error.
  * **Where the human MUST STAY in the loop**: **Confirming a bay failure and ordering physical interventions** (like shutting down a pump or adding acid in Screen 2). This action has high stakes (a wrong call can kill a whole harvest of crops) and low reversibility. A human technician must make the final call, no matter how expensive or slow it is.

---

## Q4: What did it build that you never sketched?

### Answer
When comparing my initial sketch against the final shipped product, I noticed that the AI automatically added several features and UI details that I never explicitly asked for in Prompt 1.

1. **What Appeared & When I Noticed It**
I noticed these additions **after the preview page fully loaded, while auditing the result against my Prompt 1 requirements**. In Prompt 1, I only asked for basic monitoring and flagging, but the AI automatically added:
   * **Dynamic Empty & Loading States**: Clear visual messages when data is loading or when no search results are found.
   * **Color-coded Status Badges**: Automatic red and yellow warning tags on bays with bad pH/EC levels, making risks instantly visible.
   * **Search & Quick Filters**: A search bar and "Action Needed" filter button, allowing technicians to isolate bad bays in one click.

2. **Reflection on Over-constraining & Color Palette**
Leaving Prompt 1 relatively open was a good decision because rigid rules might have produced a stiff, outdated UI. However, the AI made an unprompted choice on aesthetics: it used a generic, warm color scheme. For a vertical farm setting, I would have preferred a cooler palette (cool blues, emerald greens, slate greys) to give a clean, high-tech laboratory feel.

3. **The Key Takeaway: How to Catch This Earlier**
To catch these unsketched choices **during the build rather than after the preview renders**, I should have added a "Prompt-to-Architecture Check" step. Before asking the AI to write full code, I should have instructed it to return a **simple Markdown Component Outline** first. Reviewing the proposed UI structure beforehand would have allowed me to catch unasked-for features and correct the color scheme before any code was generated.

---

## Q5: Learning pointers for the organisational context

### Answer
1. **For catching hidden code/server logic**: Managers must mandate that employees require the AI to generate a plain-English "System Architecture & Data Flow Summary" alongside every app, so future teams know how it works if the original creator leaves.
2. **For AI defaults becoming product defaults**: IT leaders must supply pre-approved Prompt Guardrails with standard UI themes and security rules, preventing employees from letting AI defaults dictate company software standards.
3. **For handling errors and code verification**: Team leaders must enforce a "Single-Variable Prompting Rule" (changing only one element at a time), because attempting complex, multi-button layout changes in Prompt 3 triggered a system error (`An internal error occurred`), which was only fixed when I simplified the prompt to a single row adjustment.
