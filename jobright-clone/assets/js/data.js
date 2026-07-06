/* ============================================================
   JobRight clone — mock data
   In the real product this comes from a crawler + matching API;
   here it's a static dataset the client-side matcher scores.
   ============================================================ */

const SKILL_BANK = [
  "SIEM", "Splunk", "Microsoft Sentinel", "Wireshark", "Active Directory",
  "Azure", "AWS", "Incident Response", "Vulnerability Management", "Nessus",
  "NIST", "Threat Detection", "Phishing Analysis", "Python", "PowerShell",
  "Linux", "Networking", "Firewalls", "EDR", "SOC Operations",
  "JavaScript", "React", "Node.js", "SQL", "Docker", "Kubernetes", "CI/CD"
];

const JOBS = [
  {
    id: 1, title: "SOC Analyst I", company: "SentinelWorks", location: "Newark, NJ",
    workMode: "Hybrid", level: "Entry", salary: [70000, 85000], h1b: false, postedDays: 1,
    skills: ["SIEM", "Splunk", "Threat Detection", "Incident Response", "Networking"],
    description: "Monitor and triage security alerts in a 24/7 SOC. Investigate suspicious activity using Splunk, escalate confirmed incidents, and help tune detection rules. Great first seat for a security-focused grad who has built hands-on labs.",
    responsibilities: ["Triage SIEM alerts and classify true/false positives", "Perform initial incident investigation and escalation", "Document findings in the case management system", "Assist with detection rule tuning"],
    connections: 3
  },
  {
    id: 2, title: "Cloud Security Analyst", company: "Azurite Systems", location: "Jersey City, NJ",
    workMode: "Hybrid", level: "Entry", salary: [80000, 100000], h1b: true, postedDays: 2,
    skills: ["Azure", "Microsoft Sentinel", "SIEM", "Threat Detection", "PowerShell"],
    description: "Help secure our Azure estate: review Sentinel analytics rules, investigate cloud alerts, and harden identity and network configurations against benchmark baselines.",
    responsibilities: ["Investigate Microsoft Sentinel incidents", "Review Azure security posture with Defender for Cloud", "Harden AAD / Entra ID configurations", "Contribute KQL detection queries"],
    connections: 2
  },
  {
    id: 3, title: "Security Engineer", company: "CloudShield", location: "Remote (US)",
    workMode: "Remote", level: "Mid", salary: [120000, 150000], h1b: true, postedDays: 1,
    skills: ["AWS", "Python", "EDR", "Incident Response", "CI/CD", "Linux"],
    description: "Build and automate detection and response tooling across a multi-cloud environment. You'll write Python integrations between our EDR, SIEM, and ticketing systems.",
    responsibilities: ["Automate response playbooks in Python", "Manage EDR policy across 5,000 endpoints", "Integrate security checks into CI/CD", "Lead incident response bridges"],
    connections: 1
  },
  {
    id: 4, title: "Vulnerability Management Analyst", company: "TenSecure", location: "New York, NY",
    workMode: "Onsite", level: "Entry", salary: [75000, 92000], h1b: false, postedDays: 3,
    skills: ["Vulnerability Management", "Nessus", "NIST", "Networking", "Linux"],
    description: "Own the scan-to-remediation lifecycle. Run Nessus/Tenable scans, prioritize findings by risk, and chase remediation with system owners against NIST-aligned SLAs.",
    responsibilities: ["Schedule and validate Tenable scans", "Risk-rank vulnerabilities and assign owners", "Track remediation SLAs", "Report posture metrics to leadership"],
    connections: 4
  },
  {
    id: 5, title: "Incident Response Analyst", company: "Redline Defense", location: "Remote (US)",
    workMode: "Remote", level: "Mid", salary: [105000, 130000], h1b: false, postedDays: 5,
    skills: ["Incident Response", "EDR", "Wireshark", "Phishing Analysis", "PowerShell"],
    description: "Join our IR team handling escalations from managed SOC clients: phishing compromises, ransomware precursors, and insider threat cases. Deep packet and endpoint forensics daily.",
    responsibilities: ["Lead containment and eradication for client incidents", "Analyze pcaps and endpoint telemetry", "Write post-incident reports", "Run tabletop exercises"],
    connections: 0
  },
  {
    id: 6, title: "Junior Penetration Tester", company: "BreakPoint Labs", location: "Philadelphia, PA",
    workMode: "Hybrid", level: "Entry", salary: [78000, 95000], h1b: false, postedDays: 6,
    skills: ["Networking", "Linux", "Python", "Active Directory", "Firewalls"],
    description: "Assist senior consultants on internal network and Active Directory penetration tests. You'll learn our methodology, run tooling, and draft findings for client reports.",
    responsibilities: ["Run recon and enumeration phases", "Test AD misconfigurations under supervision", "Draft finding writeups with remediation guidance", "Maintain lab environments"],
    connections: 1
  },
  {
    id: 7, title: "GRC Analyst (NIST/ISO)", company: "Complyant", location: "Remote (US)",
    workMode: "Remote", level: "Entry", salary: [72000, 88000], h1b: true, postedDays: 2,
    skills: ["NIST", "Vulnerability Management", "SOC Operations"],
    description: "Map controls to NIST 800-53 and ISO 27001, coordinate evidence collection for audits, and help business units understand their compliance obligations.",
    responsibilities: ["Maintain the control matrix", "Coordinate audit evidence requests", "Run vendor security reviews", "Update policies and standards"],
    connections: 2
  },
  {
    id: 8, title: "SOC Analyst II — Night Shift", company: "NightWatch MSSP", location: "Remote (US)",
    workMode: "Remote", level: "Mid", salary: [88000, 105000], h1b: false, postedDays: 1,
    skills: ["SIEM", "Splunk", "Microsoft Sentinel", "Incident Response", "Threat Detection", "EDR"],
    description: "Senior seat on our overnight pod covering multiple client SIEMs (Splunk + Sentinel). Mentor tier-1 analysts and own escalated investigations end to end.",
    responsibilities: ["Own escalated investigations", "Mentor tier-1 analysts", "Tune multi-tenant detections", "Handle client comms during incidents"],
    connections: 2
  },
  {
    id: 9, title: "IT Security Specialist", company: "Garden State Health", location: "New Brunswick, NJ",
    workMode: "Onsite", level: "Entry", salary: [68000, 82000], h1b: false, postedDays: 8,
    skills: ["Active Directory", "Firewalls", "Networking", "Phishing Analysis", "PowerShell"],
    description: "Generalist security role at a regional healthcare network: manage AD access reviews, respond to phishing reports, and maintain firewall rules with the network team.",
    responsibilities: ["Run quarterly AD access reviews", "Investigate reported phishing", "Maintain firewall change tickets", "Support HIPAA security assessments"],
    connections: 5
  },
  {
    id: 10, title: "Detection Engineer", company: "HuntCraft", location: "Remote (US)",
    workMode: "Remote", level: "Mid", salary: [125000, 155000], h1b: true, postedDays: 4,
    skills: ["SIEM", "Threat Detection", "Python", "Splunk", "Linux"],
    description: "Turn threat intel into detections. Write and test SPL/Sigma rules, build detection-as-code pipelines, and measure coverage against MITRE ATT&CK.",
    responsibilities: ["Author detections from intel and hunts", "Maintain detection-as-code CI pipeline", "Map coverage to ATT&CK", "Partner with IR on gaps"],
    connections: 0
  },
  {
    id: 11, title: "Frontend Engineer", company: "Brightlane", location: "New York, NY",
    workMode: "Hybrid", level: "Mid", salary: [130000, 160000], h1b: true, postedDays: 2,
    skills: ["JavaScript", "React", "Node.js", "CI/CD"],
    description: "Ship user-facing features on our fintech dashboard. React + TypeScript front end backed by Node services, deployed continuously.",
    responsibilities: ["Build React features end to end", "Improve web performance budgets", "Write component and e2e tests", "Participate in design reviews"],
    connections: 1
  },
  {
    id: 12, title: "Junior Software Engineer", company: "Stackfield", location: "Hoboken, NJ",
    workMode: "Hybrid", level: "Entry", salary: [85000, 105000], h1b: true, postedDays: 3,
    skills: ["JavaScript", "Node.js", "SQL", "Docker"],
    description: "Early-career engineering seat on our platform team. You'll fix bugs, ship small features, and grow into service ownership with close mentorship.",
    responsibilities: ["Ship bug fixes and small features", "Write unit and integration tests", "Participate in code review", "Learn our deployment tooling"],
    connections: 2
  },
  {
    id: 13, title: "Security Operations Intern → FT", company: "Meridian Bank", location: "New York, NY",
    workMode: "Onsite", level: "Entry", salary: [65000, 75000], h1b: false, postedDays: 7,
    skills: ["SOC Operations", "SIEM", "Phishing Analysis", "Networking"],
    description: "6-month conversion program inside the bank's security operations center. Rotations across monitoring, phishing response, and threat intel with full-time conversion for strong performers.",
    responsibilities: ["Rotate across SOC functions", "Assist alert triage", "Support phishing takedowns", "Shadow threat intel briefings"],
    connections: 3
  },
  {
    id: 14, title: "Threat Intelligence Analyst", company: "DarkMap", location: "Washington, DC",
    workMode: "Hybrid", level: "Mid", salary: [98000, 120000], h1b: false, postedDays: 9,
    skills: ["Threat Detection", "Python", "Phishing Analysis", "SOC Operations"],
    description: "Track threat actors targeting the financial sector, produce intel reports, and feed IOCs and TTPs to detection engineering.",
    responsibilities: ["Produce weekly intel reports", "Track actor infrastructure", "Curate IOC feeds", "Brief SOC and IR teams"],
    connections: 0
  },
  {
    id: 15, title: "Cybersecurity Analyst (New Grad)", company: "Delta Consulting", location: "Remote (US)",
    workMode: "Remote", level: "Entry", salary: [70000, 85000], h1b: true, postedDays: 1,
    skills: ["SIEM", "NIST", "Vulnerability Management", "Incident Response", "Azure"],
    description: "New grad program across our federal and commercial security practices. You'll be staffed to a client engagement matching your skills — SOC, vuln management, or cloud security.",
    responsibilities: ["Support client security engagements", "Learn firm methodologies", "Earn certifications on our dime", "Rotate practices in year one"],
    connections: 6
  },
  {
    id: 16, title: "Identity & Access Management Analyst", company: "KeyStone Insurance", location: "Newark, NJ",
    workMode: "Hybrid", level: "Entry", salary: [74000, 90000], h1b: false, postedDays: 5,
    skills: ["Active Directory", "Azure", "PowerShell", "SOC Operations"],
    description: "Administer joiner/mover/leaver access across AD and Entra ID, automate provisioning with PowerShell, and support access certification campaigns.",
    responsibilities: ["Process access requests and reviews", "Automate provisioning scripts", "Maintain role-based access model", "Support SOX access audits"],
    connections: 2
  },
  {
    id: 17, title: "Network Security Engineer", company: "PortAuthority Tech", location: "New York, NY",
    workMode: "Onsite", level: "Mid", salary: [115000, 140000], h1b: false, postedDays: 10,
    skills: ["Firewalls", "Networking", "Wireshark", "Linux"],
    description: "Own firewall and network segmentation architecture across data centers and cloud. Heavy packet-level troubleshooting and change management.",
    responsibilities: ["Design segmentation policy", "Manage firewall estates", "Troubleshoot with packet captures", "Review network change requests"],
    connections: 1
  },
  {
    id: 18, title: "DevSecOps Engineer", company: "Shipfast", location: "Remote (US)",
    workMode: "Remote", level: "Senior", salary: [150000, 185000], h1b: true, postedDays: 4,
    skills: ["CI/CD", "Docker", "Kubernetes", "AWS", "Python", "Linux"],
    description: "Embed security into our delivery platform: SAST/DAST in pipelines, K8s policy enforcement, and secrets management across 40 product teams.",
    responsibilities: ["Own pipeline security gates", "Enforce K8s admission policies", "Run the secrets management program", "Coach teams on secure delivery"],
    connections: 0
  },
  {
    id: 19, title: "SIEM Engineer (Splunk)", company: "LogHarbor", location: "Remote (US)",
    workMode: "Remote", level: "Mid", salary: [110000, 135000], h1b: true, postedDays: 2,
    skills: ["Splunk", "SIEM", "Linux", "Python", "Networking"],
    description: "Administer a 2TB/day Splunk deployment: onboarding new log sources, managing indexers and forwarders, and building dashboards for SOC consumers.",
    responsibilities: ["Onboard and normalize log sources", "Maintain indexer cluster health", "Build SOC dashboards and alerts", "Optimize license usage"],
    connections: 1
  },
  {
    id: 20, title: "Information Security Analyst", company: "Rutgers University", location: "Piscataway, NJ",
    workMode: "Hybrid", level: "Entry", salary: [66000, 80000], h1b: false, postedDays: 12,
    skills: ["SIEM", "Incident Response", "Phishing Analysis", "Vulnerability Management", "Active Directory"],
    description: "Protect the university community: monitor alerts, respond to compromised accounts, run phishing awareness campaigns, and support vulnerability remediation across schools.",
    responsibilities: ["Monitor and triage security alerts", "Respond to compromised accounts", "Run awareness campaigns", "Support campus vuln scanning"],
    connections: 8
  },
  {
    id: 21, title: "Data Analyst", company: "MetroHealth Analytics", location: "New York, NY",
    workMode: "Hybrid", level: "Entry", salary: [72000, 88000], h1b: true, postedDays: 6,
    skills: ["SQL", "Python"],
    description: "Build reporting for hospital operations teams: SQL pipelines, dashboards, and ad-hoc analyses that drive staffing and capacity decisions.",
    responsibilities: ["Write and maintain SQL pipelines", "Build operational dashboards", "Run ad-hoc analyses", "Present findings to ops leaders"],
    connections: 1
  },
  {
    id: 22, title: "Platform Engineer", company: "Orbital Cloud", location: "Remote (US)",
    workMode: "Remote", level: "Senior", salary: [155000, 190000], h1b: true, postedDays: 8,
    skills: ["Kubernetes", "AWS", "Docker", "CI/CD", "Python", "Linux"],
    description: "Build the internal developer platform: cluster lifecycle, golden paths, and self-service infrastructure for 200+ engineers.",
    responsibilities: ["Operate multi-region K8s", "Build self-service tooling", "Own platform SLOs", "Mentor infra engineers"],
    connections: 0
  },
  {
    id: 23, title: "Endpoint Security Administrator", company: "TriState Logistics", location: "Edison, NJ",
    workMode: "Onsite", level: "Entry", salary: [70000, 84000], h1b: false, postedDays: 4,
    skills: ["EDR", "Active Directory", "PowerShell", "Firewalls"],
    description: "Administer EDR and endpoint hardening across 3,000 devices in warehouses and offices. Policy management, exception handling, and threat response support.",
    responsibilities: ["Manage EDR policies and exclusions", "Harden endpoint baselines", "Support threat containment", "Report endpoint hygiene metrics"],
    connections: 1
  },
  {
    id: 24, title: "Application Security Engineer", company: "PayFrame", location: "New York, NY",
    workMode: "Hybrid", level: "Senior", salary: [160000, 195000], h1b: true, postedDays: 11,
    skills: ["Python", "JavaScript", "CI/CD", "AWS", "Threat Detection"],
    description: "Partner with payment product teams on threat modeling, secure design review, and building paved-road security controls into the SDLC.",
    responsibilities: ["Run threat modeling sessions", "Review high-risk designs", "Triage bug bounty reports", "Build SDLC guardrails"],
    connections: 0
  }
];

/* Canned Orion copilot knowledge — keyword → response */
const ORION_RESPONSES = [
  {
    keys: ["resume", "cv"],
    reply: "Here's how I'd sharpen your resume:\n\n1. **Lead with outcomes, not duties** — \"Reduced false-positive alerts 30% by tuning Splunk correlation rules\" beats \"Responsible for monitoring alerts.\"\n2. **Mirror the job description** — for each application, work its top 5 keywords into your bullets (honestly). ATS systems and recruiters both scan for them.\n3. **Put hands-on labs front and center** — homelabs like an Azure honeypot or AD attack/defense environment are legitimate experience for entry-level security roles. Give each one a bullet with tools used and what you found.\n4. **Certs above the fold** — if a posting lists Security+ and you have it, it should be visible in the top third of page one.\n\nOpen any matched job and I can tell you which of your skills to emphasize for it."
  },
  {
    keys: ["interview", "prepare", "prep"],
    reply: "Interview prep plan:\n\n**For SOC / security analyst roles**, expect these areas:\n• Walk me through how you'd triage a suspicious login alert\n• Difference between IDS/IPS, TCP handshake, common ports\n• A phishing email lands — what do you do first?\n• Tell me about your homelab (this is your superpower — practice a 2-minute tour)\n\n**Behavioral**: prepare 3 STAR stories — one incident/problem you investigated, one time you learned a tool fast, one collaboration story.\n\n**Ask them**: \"What does your alert-to-analyst ratio look like?\" and \"How does tier-1 grow into tier-2 here?\" — both signal you understand SOC life.\n\nWant me to run a mock question?"
  },
  {
    keys: ["salary", "negotiate", "offer", "pay"],
    reply: "Salary negotiation basics:\n\n1. **Never give the first number** if you can avoid it — \"I'm focused on fit; what range has been budgeted for this role?\"\n2. **Know your market** — the jobs I've matched you with show the current range for your level; use the 50th–75th percentile as your anchor.\n3. **Negotiate the package, not just base** — sign-on bonus, cert/training budget, and remote flexibility are often easier for them to move than base salary.\n4. **Get competing timelines aligned** — if you're interviewing at several matches, tell later-stage companies about earlier deadlines. Deadlines create offers.\n\nEntry-level security roles in the NYC/NJ metro are typically **$68K–$95K** right now depending on shift and clearance requirements."
  },
  {
    keys: ["match", "matched", "why", "score"],
    reply: "Your match scores are computed from four signals:\n\n• **Skills overlap (45%)** — how many of the job's required skills appear in your profile\n• **Experience fit (25%)** — your years vs. the role's level (Entry/Mid/Senior)\n• **Work mode (15%)** — remote/hybrid/onsite vs. your preference\n• **Visa fit (15%)** — whether the company sponsors, if you need it\n\nAnything ≥85% is a **STRONG MATCH** — apply to those first. 70–84% is a **GOOD MATCH** worth a tailored resume. Below that, only apply if you love the company.\n\nTip: adding skills you genuinely have in **My Profile** re-scores everything instantly."
  },
  {
    keys: ["h1b", "visa", "sponsor"],
    reply: "On visa sponsorship: use the **H1B sponsor** filter in the job list — it limits results to companies with a sponsorship history. A few honest notes:\n\n• Entry-level sponsorship in security is competitive; consulting firms and larger tech companies sponsor far more often than small MSSPs.\n• Apply early in the fiscal cycle — many companies pause sponsorship as the annual cap approaches.\n• In interviews, wait until they signal intent (or the offer stage) to confirm sponsorship logistics, but never hide the requirement if asked directly."
  },
  {
    keys: ["cover letter"],
    reply: "Keep cover letters short — 150–200 words, three paragraphs:\n\n1. **Hook**: one line on why this company specifically.\n2. **Proof**: your single most relevant achievement, with a number in it.\n3. **Close**: what you'd do in the first 90 days.\n\nMost recruiters skim them in under 10 seconds, so front-load. For any matched job, open it and I can suggest which achievement to lead with based on the skills it requires."
  },
  {
    keys: ["cert", "certification", "security+", "study"],
    reply: "Certification roadmap for a security-focused career:\n\n• **Have Security+?** Great — that's the HR filter for most entry SOC roles. ✔\n• **Next best value**: BTL1 or CySA+ for blue-team depth, or the SC-200 if you're targeting Microsoft Sentinel shops (several of your matches use it).\n• **Cloud**: AZ-500 (Azure) pairs perfectly with Sentinel experience; Security Specialty if the role is AWS-heavy.\n• **Skip for now**: CISSP (needs 5 yrs experience) and OSCP unless you're committed to offensive work.\n\nCerts get interviews; homelabs win them. Keep doing both."
  }
];

const ORION_DEFAULT = "Great question! Here's my take: focus your energy on the **STRONG MATCH** jobs (85%+) first — those are the ones where your profile clears the bar recruiters screen for. For each one: tailor your resume to its top skills, check the insider connections tab for a referral path, and apply within 48 hours of posting (early applicants get 8x more responses).\n\nYou can also ask me about: **resumes**, **interview prep**, **salary negotiation**, **certifications**, **H1B sponsorship**, or **why your matches are scored the way they are**.";
