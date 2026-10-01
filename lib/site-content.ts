import { industrySolutionPages } from "@/lib/industry-page-content";

export type PageSummary = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  keywords: string[];
  heroPoints: string[];
  outcomes: string[];
  sections: Array<{
    title: string;
    body: string;
    points: string[];
  }>;
};

export const primaryKeywords = [
  "LMS software for coaching institutes",
  "online academy software",
  "course selling platform",
  "coaching institute management software",
  "learning management system India",
  "white label LMS",
  "live class management software",
  "online course platform",
  "student management system",
  "education CRM software",
  "course payment software",
  "certificate management software",
  "online test platform",
  "faculty management software",
  "EdTech software platform",
];

export const featurePages: PageSummary[] = [
  {
    slug: "course-selling-platform",
    eyebrow: "Course selling platform",
    title: "Sell online courses from your own branded academy website.",
    description:
      "KASA gives coaching institutes and trainers a complete course selling platform with course pages, checkout, learner accounts, orders, coupons, and instant course access.",
    keywords: [
      "course selling platform",
      "sell courses online",
      "online course platform",
      "academy website with checkout",
    ],
    heroPoints: ["Course storefront", "Cart and checkout", "Instant access"],
    outcomes: [
      "Publish recorded, live, and hybrid programs with clear course pages.",
      "Collect payments and open course access without manual follow-up.",
      "Track orders, learners, and course performance from one admin panel.",
    ],
    sections: [
      {
        title: "A branded storefront, not a marketplace profile",
        body: "Your institute keeps its own identity, domain, logo, pricing, course positioning, and admission flow. KASA makes the buying experience feel like your own product.",
        points: ["Own academy website", "Course landing pages", "Lead and enquiry capture"],
      },
      {
        title: "Checkout connected to learning access",
        body: "Every successful order can unlock the right course, learner dashboard, invoices, and future communication without splitting sales and teaching into different tools.",
        points: ["Course checkout", "Coupons and invoices", "Automatic enrolment"],
      },
    ],
  },
  {
    slug: "live-class-management",
    eyebrow: "Live class management software",
    title: "Run live classes, batches, schedules, and replays in one LMS.",
    description:
      "KASA helps institutes manage live classes, faculty-led batches, class calendars, recordings, reminders, assignments, and learner access from one platform.",
    keywords: [
      "live class management software",
      "online class management",
      "batch management software",
      "faculty led LMS",
    ],
    heroPoints: ["Live batches", "Class calendar", "Replay library"],
    outcomes: [
      "Give students a clear place for class links and updates.",
      "Help faculty manage assigned batches, sessions, and learners.",
      "Keep recordings and class resources attached to course progress.",
    ],
    sections: [
      {
        title: "Built for coaching batches",
        body: "KASA supports the way institutes actually teach: cohorts, schedules, trainers, assignments, replays, reminders, and learner communication.",
        points: ["Batch calendars", "Trainer workspace", "Class reminders"],
      },
      {
        title: "Live and self-paced together",
        body: "Use live classes for active cohorts while keeping recorded lessons and resources available for revision, make-up classes, or hybrid learning.",
        points: ["Hybrid delivery", "Replay access", "Resource library"],
      },
    ],
  },
  {
    slug: "exams-assignments-certificates",
    eyebrow: "Assessment and certificate software",
    title: "Online exams, assignment evaluation, results, and branded certificates.",
    description:
      "KASA assessment and certificate software connects online exams, assignment submissions, faculty evaluation, results, completion rules, and branded course certificates with the learner record.",
    keywords: [
      "online test platform",
      "certificate management software",
      "assignment management LMS",
      "course completion certificates",
      "online examination software for coaching institutes",
      "LMS with exams and certificates",
      "student assignment submission system",
    ],
    heroPoints: ["Online exams", "Assignments", "Certificates"],
    outcomes: [
      "Measure learning outcomes without sending students to another tool.",
      "Issue certificates based on lecture completion or exam performance.",
      "Keep assessment history attached to learner records.",
    ],
    sections: [
      {
        title: "Assess inside the learning flow",
        body: "Tests and assignments sit alongside courses, batches, and learner dashboards, so students understand what to complete next.",
        points: ["Quizzes and tests", "Assignment submissions", "Result tracking"],
      },
      {
        title: "Certificates with real completion rules",
        body: "Starter, Plus, and Enterprise plans can use different certificate rules, making certificates match the seriousness of your program.",
        points: ["Lecture completion rules", "Exam-pass rules", "Branded certificate output"],
      },
    ],
  },
  {
    slug: "payments-coupons-orders",
    eyebrow: "Payments and orders",
    title: "Manage course fees, coupons, orders, invoices, and access control.",
    description:
      "KASA connects course payments with orders, invoices, coupons, learner access, refunds, and revenue visibility for growing online academies.",
    keywords: [
      "course payment software",
      "online course checkout",
      "LMS payment system",
      "course coupon management",
    ],
    heroPoints: ["Payments", "Coupons", "Invoices"],
    outcomes: [
      "Sell courses with pricing, GST-ready totals, and clear order records.",
      "Run offers without losing control of course access.",
      "Connect purchase history with student accounts and support workflows.",
    ],
    sections: [
      {
        title: "Revenue and delivery stay connected",
        body: "When a learner purchases a course, KASA keeps the order, invoice, access, and learner record in sync for your admin team.",
        points: ["Order dashboard", "Invoice records", "Learner access mapping"],
      },
      {
        title: "Offers without operational mess",
        body: "Use coupons and campaign pricing when needed, while keeping usage rules and reporting visible to your team.",
        points: ["Coupon campaigns", "Offer tracking", "Refund workflow"],
      },
    ],
  },
  {
    slug: "student-faculty-management",
    eyebrow: "Student and faculty management",
    title: "Manage students, faculty, roles, batches, and learning progress.",
    description:
      "KASA gives institutes a student management system and faculty workspace for course delivery, batch progress, reminders, learner records, and role-based operations.",
    keywords: [
      "student management system",
      "faculty management software",
      "coaching institute student portal",
      "role based LMS",
    ],
    heroPoints: ["Student portal", "Faculty dashboard", "Role control"],
    outcomes: [
      "Give each learner a focused dashboard for courses and progress.",
      "Let faculty manage only the classes and learners assigned to them.",
      "Keep admin control over users, permissions, and sensitive settings.",
    ],
    sections: [
      {
        title: "A clean learner workspace",
        body: "Students can find enrolled courses, live classes, exams, certificates, orders, and notifications without depending on chat messages.",
        points: ["My courses", "Progress view", "Certificates and orders"],
      },
      {
        title: "Faculty workflows with admin control",
        body: "Faculty teams can manage delivery work while admins retain system-level control of settings, pricing, reports, and roles.",
        points: ["Assigned batches", "Exam reviews", "Role-based permissions"],
      },
    ],
  },
  {
    slug: "education-crm-leads",
    eyebrow: "Education CRM software",
    title: "Capture leads, follow enquiries, and convert learners faster.",
    description:
      "KASA includes lead capture and education CRM workflows so coaching institutes can connect marketing enquiries, demo requests, admissions follow-up, and student records.",
    keywords: [
      "education CRM software",
      "coaching institute CRM",
      "admission lead management",
      "LMS lead capture",
    ],
    heroPoints: ["Lead capture", "Demo requests", "Follow-up context"],
    outcomes: [
      "Know which page, CTA, or campaign created each enquiry.",
      "Route serious demo and pricing leads into one admin workspace.",
      "Connect admissions work with the same system used for delivery.",
    ],
    sections: [
      {
        title: "Marketing leads with context",
        body: "KASA forms can capture the user intent, source, CTA, page URL, and notes, so your team does not treat every enquiry the same.",
        points: ["Demo leads", "Pricing leads", "Contact leads"],
      },
      {
        title: "Admissions and operations in one view",
        body: "Once a lead becomes a learner, the same system can support enrolment, course access, payments, and learner progress.",
        points: ["Lead records", "Student conversion", "Operational continuity"],
      },
    ],
  },
  {
    slug: "academy-website-builder",
    eyebrow: "Academy website builder",
    title: "Build a professional academy website with course pages and enquiry funnels.",
    description:
      "KASA helps institutes create a branded academy website with SEO pages, course pages, contact forms, demo requests, pricing CTAs, and learner login.",
    keywords: ["academy website builder", "coaching institute website", "course website builder"],
    heroPoints: ["SEO pages", "Course pages", "Lead forms"],
    outcomes: [
      "Launch a credible academy website without custom web development.",
      "Connect every enquiry form with lead source and CTA context.",
      "Keep course discovery, pricing, and learner login under one brand.",
    ],
    sections: [
      {
        title: "A website built for education buyers",
        body: "KASA pages explain courses, delivery models, outcomes, pricing, and demos in a way that helps serious learners and institute decision makers move forward.",
        points: ["Home page", "Course pages", "Demo CTAs"],
      },
      {
        title: "Search-ready structure",
        body: "Feature, solution, comparison, and guide pages create a stronger SEO base than a single landing page.",
        points: ["Internal links", "Canonical URLs", "Keyword clusters"],
      },
    ],
  },
  {
    slug: "admin-dashboard-reporting",
    eyebrow: "Admin dashboard and reports",
    title: "Control courses, users, payments, leads, and reports from one admin dashboard.",
    description:
      "KASA gives academy teams an admin dashboard for users, courses, orders, coupons, refunds, leads, certificates, settings, roles, and operating reports.",
    keywords: ["LMS admin dashboard", "academy reporting software", "course admin panel"],
    heroPoints: ["Admin panel", "Reports", "Role control"],
    outcomes: [
      "Reduce back-office work across courses, users, and payments.",
      "Give teams visibility into sales, learners, and operations.",
      "Protect sensitive settings with role-based controls.",
    ],
    sections: [
      {
        title: "Built for repeat admin work",
        body: "Course publishing, user management, order tracking, refunds, and settings need a clean control room. KASA keeps that work organized.",
        points: ["Users", "Orders", "Settings"],
      },
      {
        title: "Reports that match growth decisions",
        body: "Track the signals that matter: leads, sales, active learners, course performance, and operational health.",
        points: ["Revenue", "Learners", "Course performance"],
      },
    ],
  },
  {
    slug: "white-label-lms",
    eyebrow: "White label LMS",
    title: "Run your academy under your own brand with a white label LMS.",
    description:
      "KASA works as a white label LMS for institutes and trainers that want their own branded course website, learner portal, payments, and certificate experience.",
    keywords: ["white label LMS", "branded LMS", "own branded course platform"],
    heroPoints: ["Own domain", "Own brand", "Own learner journey"],
    outcomes: [
      "Avoid sending learners to a third-party marketplace identity.",
      "Create trust with a professional branded academy experience.",
      "Keep pricing, policies, and learner communication under your control.",
    ],
    sections: [
      {
        title: "Your brand stays visible",
        body: "From the first visit to certificate completion, learners see your academy identity instead of a generic platform wrapper.",
        points: ["Logo", "Domain", "Brand colors"],
      },
      {
        title: "A serious product experience",
        body: "White label should not mean shallow. KASA includes the delivery, admin, and commerce workflows needed for a complete academy.",
        points: ["Courses", "Payments", "Certificates"],
      },
    ],
  },
  {
    slug: "learner-dashboard-progress",
    eyebrow: "Learner dashboard",
    title: "Give every learner a clean dashboard for courses, progress, classes, and certificates.",
    description:
      "KASA learner dashboards help students access enrolled courses, live classes, tests, assignments, certificates, orders, and progress from one place.",
    keywords: ["learner dashboard", "student course dashboard", "LMS progress tracking"],
    heroPoints: ["My courses", "Progress", "Certificates"],
    outcomes: [
      "Make it easy for students to find what to study next.",
      "Reduce support questions about links, progress, and certificates.",
      "Improve completion with visible progress and pending work.",
    ],
    sections: [
      {
        title: "A focused student experience",
        body: "Learners should not search through chat threads for classes, recordings, resources, and exams. KASA keeps them in one dashboard.",
        points: ["Courses", "Classes", "Resources"],
      },
      {
        title: "Progress creates momentum",
        body: "Clear completion indicators, pending tasks, and certificate status help learners stay engaged.",
        points: ["Completion tracking", "Pending exams", "Certificate status"],
      },
    ],
  },
];

export const solutionPages: PageSummary[] = [
  {
    slug: "coaching-institutes",
    eyebrow: "For coaching institutes",
    title: "LMS software for coaching institutes: batches, students, fees, tests, and classes.",
    description:
      "KASA is coaching institute management software for admissions, course selling, live and recorded batches, student and faculty management, fees, tests, certificates, and reporting under your own brand.",
    keywords: [
      "LMS software for coaching institutes",
      "coaching institute management software",
      "coaching institute app",
      "online coaching platform",
      "student management software for coaching institutes",
      "coaching class management software",
      "coaching institute student portal",
      "online coaching LMS India",
    ],
    heroPoints: ["Course sales", "Live batches", "Student operations"],
    outcomes: [
      "Move from scattered tools to one branded institute platform.",
      "Run recorded, live, and hybrid programs from the same LMS.",
      "Manage admissions, students, faculty, payments, and certificates together.",
    ],
    sections: [
      {
        title: "Your institute under your brand",
        body: "KASA gives your coaching institute a professional front website and learner portal without depending on marketplace identity.",
        points: ["Own domain", "Branded course pages", "Admin dashboard"],
      },
      {
        title: "Built for daily coaching operations",
        body: "From batches and replays to exams and fee collection, KASA covers the workflows coaching teams repeat every day.",
        points: ["Batches", "Exams", "Payments"],
      },
    ],
  },
  {
    slug: "online-academies",
    eyebrow: "For online academies",
    title: "Online academy software for selling and delivering digital courses.",
    description:
      "KASA helps online academies launch a course website, sell programs, deliver lessons, automate access, manage learners, and grow beyond manual operations.",
    keywords: [
      "online academy software",
      "online course platform",
      "digital academy LMS",
      "course website software",
    ],
    heroPoints: ["Academy website", "Course delivery", "Growth tracking"],
    outcomes: [
      "Create a full academy experience around your courses.",
      "Give learners a polished dashboard after purchase.",
      "Track leads, purchases, progress, and certificates in one system.",
    ],
    sections: [
      {
        title: "A complete academy, not just a course page",
        body: "KASA supports course discovery, checkout, login, learning, progress, certificates, and support workflows.",
        points: ["Storefront", "Learner dashboard", "Certificates"],
      },
      {
        title: "Ready for campaigns and launches",
        body: "Use landing pages, pricing plans, demo requests, and lead capture to support paid ads and organic search.",
        points: ["SEO pages", "Ad funnels", "Lead forms"],
      },
    ],
  },
  {
    slug: "trainers-creators",
    eyebrow: "For trainers and creators",
    title: "White label LMS for trainers who want to sell under their own brand.",
    description:
      "KASA gives trainers and course creators a branded LMS with course selling, learner dashboards, payments, certificates, and growth workflows.",
    keywords: [
      "white label LMS",
      "LMS for trainers",
      "sell courses under own brand",
      "course creator platform",
    ],
    heroPoints: ["White label LMS", "Zero marketplace dependency", "Launch support"],
    outcomes: [
      "Own the brand relationship with learners.",
      "Sell recorded or live programs without custom development.",
      "Start simple and upgrade as your audience grows.",
    ],
    sections: [
      {
        title: "Keep your brand in front",
        body: "Your website, your pricing, your course positioning, and your learner experience remain under one brand.",
        points: ["Logo and brand", "Course offers", "Learner accounts"],
      },
      {
        title: "Less tech work, more course growth",
        body: "KASA handles the LMS and operational base so trainers can focus on content, cohorts, and conversions.",
        points: ["Course setup", "Payment flow", "Learner progress"],
      },
    ],
  },
  {
    slug: "edtech-startups",
    eyebrow: "For EdTech startups",
    title: "EdTech platform software for teams building a serious learning business.",
    description:
      "KASA helps EdTech startups move faster with a ready LMS foundation for course commerce, live learning, student operations, certificates, and admin control.",
    keywords: [
      "EdTech software platform",
      "LMS for EdTech startups",
      "education SaaS platform",
      "learning platform for startups",
    ],
    heroPoints: ["Ready LMS core", "Admin control", "Scalable workflows"],
    outcomes: [
      "Launch faster without building every LMS workflow from scratch.",
      "Use plan-based licensing, modules, and operations from day one.",
      "Keep room for custom rollout and enterprise workflows later.",
    ],
    sections: [
      {
        title: "A production-ready foundation",
        body: "KASA gives teams a strong base for learner journeys, content operations, monetization, and admin management.",
        points: ["Course engine", "User roles", "Module controls"],
      },
      {
        title: "Built to grow beyond MVP",
        body: "The platform supports multiple delivery models, reporting needs, and operational complexity as the business expands.",
        points: ["Self learning", "Faculty-led programs", "Hybrid courses"],
      },
    ],
  },
  {
    slug: "skill-development-centres",
    eyebrow: "For skill development centres",
    title: "LMS for skill development centres with courses, tests, and certificates.",
    description:
      "KASA supports skill development centres with program pages, learner enrolment, assessments, certificates, faculty workflows, and outcome tracking.",
    keywords: [
      "LMS for skill development centre",
      "skill training software",
      "certificate course platform",
      "vocational training LMS",
    ],
    heroPoints: ["Skill programs", "Assessments", "Certificates"],
    outcomes: [
      "Organize skill programs with clear learning paths.",
      "Measure progress through tests and assignments.",
      "Issue completion certificates with your centre identity.",
    ],
    sections: [
      {
        title: "Structured programs for practical learning",
        body: "Build programs with lessons, resources, assignments, and trainer guidance for repeatable delivery.",
        points: ["Course modules", "Resources", "Trainer support"],
      },
      {
        title: "Proof of progress",
        body: "Use tests, completion rules, and certificates to show learner outcomes clearly.",
        points: ["Assessments", "Results", "Certificates"],
      },
    ],
  },
];

export const comparisonPages: PageSummary[] = [
  {
    slug: "kasa-vs-custom-lms-development",
    eyebrow: "Comparison",
    title: "KASA vs custom LMS development: launch faster without starting from zero.",
    description:
      "Compare KASA with custom LMS development for coaching institutes that need course selling, live classes, payments, certificates, and admin control without a long build cycle.",
    keywords: ["KASA vs custom LMS", "custom LMS development alternative", "ready LMS software"],
    heroPoints: ["Faster launch", "Lower implementation risk", "Ready workflows"],
    outcomes: [
      "Avoid rebuilding common LMS workflows from scratch.",
      "Start with proven course, payment, learner, and admin modules.",
      "Keep room for custom rollout needs after the business validates demand.",
    ],
    sections: [
      {
        title: "Custom code is powerful, but slow to reach market",
        body: "Most institutes do not need to invent course access, student dashboards, invoices, certificates, and roles before testing their online academy. KASA gives that base immediately.",
        points: ["Shorter launch cycle", "Lower first-version risk", "Operational modules included"],
      },
      {
        title: "Use KASA when the business needs momentum",
        body: "KASA is best when you want to start selling and teaching quickly, then tune workflows based on actual learners and admissions data.",
        points: ["Launch first", "Measure demand", "Improve with real usage"],
      },
    ],
  },
  {
    slug: "kasa-vs-marketplaces",
    eyebrow: "Comparison",
    title: "KASA vs course marketplaces: own your brand, data, and learner journey.",
    description:
      "See why coaching institutes and trainers choose a branded LMS like KASA instead of depending only on course marketplaces.",
    keywords: ["course marketplace alternative", "own course platform", "white label course website"],
    heroPoints: ["Own brand", "Own learner data", "No marketplace dependency"],
    outcomes: [
      "Keep your institute identity in front of every learner.",
      "Control pricing, admissions, communication, and remarketing.",
      "Build long-term brand equity instead of only renting marketplace traffic.",
    ],
    sections: [
      {
        title: "Marketplaces help discovery, but limit ownership",
        body: "A marketplace can bring reach, but your brand, pricing, policies, and learner relationship stay constrained. KASA gives you a separate owned academy system.",
        points: ["Owned domain", "Direct student accounts", "Independent pricing"],
      },
      {
        title: "KASA is built for direct sales",
        body: "Your ads, SEO pages, demo requests, leads, checkout, and learner portal can all point to one branded platform.",
        points: ["Ad funnels", "SEO pages", "Direct checkout"],
      },
    ],
  },
  {
    slug: "kasa-vs-wordpress-lms",
    eyebrow: "Comparison",
    title: "KASA vs WordPress LMS plugins for serious coaching operations.",
    description:
      "Compare KASA with WordPress LMS plugins when your institute needs courses, payments, live classes, roles, learner dashboards, and operations in one managed product.",
    keywords: ["WordPress LMS alternative", "LMS plugin alternative", "coaching LMS software"],
    heroPoints: ["Less plugin friction", "Connected workflows", "Operations-first LMS"],
    outcomes: [
      "Avoid stitching many plugins for course sales, access, tests, and reports.",
      "Give admins, faculty, and learners a consistent product experience.",
      "Reduce the risk of plugin conflicts as operations grow.",
    ],
    sections: [
      {
        title: "Plugins can work, but operations get fragmented",
        body: "WordPress LMS stacks often need multiple plugins for checkout, certificates, coupons, roles, CRM, and reporting. KASA brings these workflows into one product.",
        points: ["One admin panel", "Built-in roles", "Connected learner records"],
      },
      {
        title: "Choose KASA when education workflows matter most",
        body: "KASA is focused on institute workflows rather than generic website publishing, so teaching and operations stay central.",
        points: ["Course delivery", "Faculty workflows", "Learner progress"],
      },
    ],
  },
  {
    slug: "best-lms-for-coaching-institutes",
    eyebrow: "Buying guide",
    title: "What makes the best LMS for coaching institutes in India?",
    description:
      "A practical comparison guide for choosing LMS software for coaching institutes, online academies, trainers, and EdTech teams.",
    keywords: ["best LMS for coaching institutes", "best LMS software India", "coaching LMS buying guide"],
    heroPoints: ["Buyer checklist", "Institute workflows", "Growth readiness"],
    outcomes: [
      "Understand what a coaching institute should check before buying LMS software.",
      "Compare course selling, live classes, payments, roles, and certificates.",
      "Pick a platform that supports both launch and scale.",
    ],
    sections: [
      {
        title: "A good coaching LMS must support more than lessons",
        body: "Institutes need admissions, fees, batches, faculty, tests, certificates, reports, and student communication, not just video hosting.",
        points: ["Admissions", "Course delivery", "Operations"],
      },
      {
        title: "KASA covers the full academy workflow",
        body: "KASA is designed around the journey from visitor to lead, buyer, learner, certificate holder, and repeat student.",
        points: ["Lead capture", "Checkout", "Learner success"],
      },
    ],
  },
];

export const resourcePages: PageSummary[] = [
  {
    slug: "start-online-academy-india",
    eyebrow: "Guide",
    title: "How to start an online academy in India: a practical launch guide.",
    description:
      "Plan and launch an online academy in India with a clear course offer, pricing, payments, learner delivery, support, assessments, certificates, and an owned academy website.",
    keywords: [
      "how to start online academy in India",
      "start online course business in India",
      "online academy setup",
      "create online course website India",
      "launch online coaching academy",
    ],
    heroPoints: ["Academy setup", "Course sales", "Learner delivery"],
    outcomes: [
      "Plan the website, courses, pricing, and learner journey before launch.",
      "Avoid scattered tools for admissions, payments, and teaching.",
      "Use KASA to bring the academy workflow together faster.",
    ],
    sections: [
      {
        title: "Start with a clear learner journey",
        body: "Before tools, define how a visitor becomes a lead, buyer, learner, and certificate holder. KASA is built around that complete path.",
        points: ["Lead capture", "Checkout", "Learning dashboard"],
      },
      {
        title: "Build for operations from day one",
        body: "Even small academies need course updates, student support, payment records, and progress tracking. A connected LMS avoids future rework.",
        points: ["Course operations", "Student support", "Reports"],
      },
    ],
  },
  {
    slug: "sell-recorded-courses-online",
    eyebrow: "Guide",
    title: "How to sell recorded courses online from your own branded platform.",
    description:
      "Learn how institutes and trainers can sell recorded courses online with a branded course website, checkout, learner dashboard, and certificates.",
    keywords: ["sell recorded courses online", "recorded course platform", "sell video courses"],
    heroPoints: ["Recorded courses", "Course checkout", "Self-paced learning"],
    outcomes: [
      "Create course pages that explain outcomes and value clearly.",
      "Let learners buy and start studying without manual setup.",
      "Track progress and certificates from the same LMS.",
    ],
    sections: [
      {
        title: "Recorded courses need structure, not just videos",
        body: "A strong recorded course needs modules, lessons, resources, progress, support, and completion rules. KASA keeps these pieces together.",
        points: ["Modules", "Resources", "Progress"],
      },
      {
        title: "Connect sales with course access",
        body: "The best experience is simple: learner pays, account opens, course appears, and progress starts tracking immediately.",
        points: ["Payment", "Access", "Progress"],
      },
    ],
  },
  {
    slug: "run-live-online-classes",
    eyebrow: "Guide",
    title: "How to run live online classes with batches, replays, and student tracking.",
    description:
      "A guide for coaching institutes that want to organize live online classes with schedules, faculty, recordings, assignments, and learner progress.",
    keywords: ["run live online classes", "live class software", "online batch management"],
    heroPoints: ["Live schedules", "Replays", "Batch tracking"],
    outcomes: [
      "Plan live class batches with clear schedules and faculty ownership.",
      "Keep recordings and resources available after class.",
      "Track learner progress across live and self-paced work.",
    ],
    sections: [
      {
        title: "Live classes need a batch system",
        body: "A professional live program needs batches, calendars, reminders, replays, and learner lists. KASA gives that structure.",
        points: ["Batches", "Calendar", "Faculty"],
      },
      {
        title: "Hybrid learning keeps students engaged",
        body: "Combine live teaching with recorded lessons, assignments, tests, and certificates for a stronger learning journey.",
        points: ["Recorded revision", "Assignments", "Certificates"],
      },
    ],
  },
  {
    slug: "lms-seo-for-academies",
    eyebrow: "Guide",
    title: "How academies can bring more students from their own website.",
    description:
      "Learn how online academies can use course pages, solution pages, useful guides, and clear website structure to reach students who are already searching online.",
    keywords: ["online academy website growth", "coaching institute website", "academy website guide"],
    heroPoints: ["Course pages", "Helpful guides", "Clear structure"],
    outcomes: [
      "Use separate pages for separate search intent.",
      "Build internal links between features, solutions, resources, and pricing.",
      "Turn your academy website into a long-term acquisition channel.",
    ],
    sections: [
      {
        title: "One landing page cannot rank for everything",
        body: "High-intent LMS and academy keywords need focused pages. KASA's website structure is built to support that expansion.",
        points: ["Feature pages", "Solution pages", "Comparison pages"],
      },
      {
        title: "Internal linking creates topical authority",
        body: "Pages should connect naturally: coaching institute pages link to live classes, certificates, payments, CRM, and pricing.",
        points: ["Topic clusters", "Buyer intent", "Conversion paths"],
      },
    ],
  },
  {
    slug: "course-certificates-best-practices",
    eyebrow: "Guide",
    title: "Course certificate best practices for coaching institutes and trainers.",
    description:
      "Understand when to issue certificates, how to use completion rules, and how certificates can improve perceived value for online courses.",
    keywords: ["course certificate best practices", "online course certificates", "certificate LMS"],
    heroPoints: ["Certificate rules", "Completion proof", "Learner value"],
    outcomes: [
      "Choose certificate rules based on course seriousness.",
      "Use exams or lecture completion depending on the plan.",
      "Keep certificates branded and connected to learner records.",
    ],
    sections: [
      {
        title: "Certificates should match course quality",
        body: "Simple courses may use lecture completion, while serious programs may require exam pass rules. KASA supports both approaches.",
        points: ["Lecture completion", "Exam pass", "Branded proof"],
      },
      {
        title: "Certificates help learners show outcomes",
        body: "A clean certificate workflow increases learner motivation and improves the perceived value of the course.",
        points: ["Motivation", "Completion", "Shareable proof"],
      },
    ],
  },
  {
    slug: "online-course-pricing-guide",
    eyebrow: "Guide",
    title: "Online course pricing guide for trainers and coaching institutes.",
    description:
      "A practical guide for pricing online courses, live batches, hybrid programs, discounts, and certificates in a way that supports growth.",
    keywords: ["online course pricing", "course pricing guide", "pricing online coaching courses"],
    heroPoints: ["Course pricing", "Offers", "Revenue tracking"],
    outcomes: [
      "Price courses based on transformation, support, and delivery model.",
      "Use coupons carefully without weakening your brand.",
      "Track revenue and learner conversion inside your LMS.",
    ],
    sections: [
      {
        title: "Pricing should match delivery depth",
        body: "Recorded courses, live cohorts, hybrid programs, and certificate courses should not all be priced the same.",
        points: ["Recorded", "Live", "Hybrid"],
      },
      {
        title: "Use offers with control",
        body: "Coupons can help campaigns, but the system should track orders, usage, and access clearly.",
        points: ["Coupons", "Orders", "Access control"],
      },
    ],
  },
];

export const homeHighlights = [
  {
    title: "Launch a branded academy website",
    body: "Create a premium online presence with course pages, pricing sections, enquiry forms, and learner login under your own domain.",
    href: "/features/course-selling-platform",
  },
  {
    title: "Run recorded, live, and hybrid courses",
    body: "Use one LMS for self-paced lessons, live batches, replays, assignments, exams, and certificates.",
    href: "/features/live-class-management",
  },
  {
    title: "Connect leads, payments, and learner progress",
    body: "Bring admissions, orders, coupons, users, faculty workflows, and learner reports into one operating system.",
    href: "/features/education-crm-leads",
  },
];

export function getFeaturePage(slug: string) {
  return featurePages.find((page) => page.slug === slug);
}

export function getSolutionPage(slug: string) {
  return allSolutionPages.find((page) => page.slug === slug);
}

export function getComparisonPage(slug: string) {
  return comparisonPages.find((page) => page.slug === slug);
}

export function getResourcePage(slug: string) {
  return resourcePages.find((page) => page.slug === slug);
}

export const allSolutionPages = [...solutionPages, ...industrySolutionPages];

export const allSeoPages = [
  ...featurePages.map((page) => ({ ...page, href: `/features/${page.slug}`, group: "Features" })),
  ...allSolutionPages.map((page) => ({ ...page, href: `/solutions/${page.slug}`, group: "Solutions" })),
  ...comparisonPages.map((page) => ({ ...page, href: `/compare/${page.slug}`, group: "Compare" })),
  ...resourcePages.map((page) => ({ ...page, href: `/resources/${page.slug}`, group: "Resources" })),
];

type SeoPage = (typeof allSeoPages)[number];

const relatedPageStopWords = new Set([
  "academy",
  "and",
  "best",
  "build",
  "business",
  "coaching",
  "course",
  "for",
  "from",
  "guide",
  "help",
  "india",
  "institute",
  "kasa",
  "learning",
  "lms",
  "management",
  "online",
  "platform",
  "software",
  "support",
  "system",
  "team",
  "that",
  "the",
  "their",
  "this",
  "through",
  "with",
  "your",
]);

const relatedPageAliases: Record<string, string> = {
  assignment: "assessment",
  checkout: "commerce",
  exam: "assessment",
  fee: "commerce",
  invoice: "commerce",
  learner: "student",
  order: "commerce",
  payment: "commerce",
  pricing: "commerce",
  quiz: "assessment",
  replay: "recorded",
  revenue: "commerce",
  teacher: "faculty",
  test: "assessment",
  trainer: "faculty",
};

function relatedPageTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 2)
    .map((token) => {
      if (token.endsWith("ies") && token.length > 5) return `${token.slice(0, -3)}y`;
      if (token.endsWith("s") && !token.endsWith("ss") && token.length > 4) {
        return token.slice(0, -1);
      }
      return token;
    })
    .filter((token) => !relatedPageStopWords.has(token))
    .map((token) => relatedPageAliases[token] ?? token);
}

function relatedPageTerms(page: PageSummary) {
  const terms = new Map<string, number>();
  const add = (values: string[], weight: number) => {
    relatedPageTokens(values.join(" ")).forEach((token) => {
      terms.set(token, Math.max(terms.get(token) ?? 0, weight));
    });
  };

  add(page.keywords, 5);
  add([page.title, page.eyebrow], 4);
  add(page.heroPoints, 3);
  add(
    page.sections.flatMap((section) => [section.title, section.body, ...section.points]),
    2,
  );
  add([page.description, ...page.outcomes], 1);

  return terms;
}

function relatedPageScore(source: SeoPage, candidate: SeoPage) {
  const sourceTerms = relatedPageTerms(source);
  const candidateTerms = relatedPageTerms(candidate);
  let score = source.group === candidate.group ? 0 : 2;

  sourceTerms.forEach((sourceWeight, term) => {
    const candidateWeight = candidateTerms.get(term);
    if (candidateWeight) score += Math.min(sourceWeight, candidateWeight);
  });

  return score;
}

export function getRelatedSeoPages(page: PageSummary, limit = 6) {
  const source = allSeoPages.find((candidate) => candidate.slug === page.slug);
  if (!source) return [];

  const ranked = allSeoPages
    .filter((candidate) => candidate.slug !== page.slug)
    .map((candidate) => ({
      candidate,
      score: relatedPageScore(source, candidate),
    }))
    .sort((left, right) =>
      right.score - left.score || left.candidate.title.localeCompare(right.candidate.title),
    );

  const selected: SeoPage[] = [];
  const groupCounts = new Map<string, number>();
  const canAdd = (candidate: SeoPage) => {
    const groupLimit = candidate.group === source.group ? 1 : 2;
    return (groupCounts.get(candidate.group) ?? 0) < groupLimit;
  };
  const add = (candidate: SeoPage) => {
    if (selected.some((item) => item.slug === candidate.slug)) return;
    selected.push(candidate);
    groupCounts.set(candidate.group, (groupCounts.get(candidate.group) ?? 0) + 1);
  };

  ranked.forEach(({ candidate, score }) => {
    if (selected.length < limit && score > 2 && canAdd(candidate)) add(candidate);
  });
  ranked.forEach(({ candidate }) => {
    if (selected.length < limit && canAdd(candidate)) add(candidate);
  });
  ranked.forEach(({ candidate }) => {
    if (selected.length < limit) add(candidate);
  });

  return selected.slice(0, limit);
}
