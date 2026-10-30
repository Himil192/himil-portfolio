export const site = {
  name: "Himil Prajapati",
  role: "Frontend Developer",
  location: "Gujarat, India",
  availability: "Open to frontend developer roles",
  email: "himilprajapati@gmail.com",
  // Set NEXT_PUBLIC_SITE_URL at build time so share previews and the sitemap use the live domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  resume: "/resume.pdf",
  resumeFilename: "Himil-Prajapati-Resume.pdf",
  intro:
    "I build responsive web applications with React and Next.js, from API-integrated features to interfaces that feel considered.",
  facts: [
    { value: "1+ year", label: "Professional frontend experience" },
    { value: "React / Next.js", label: "Core stack" },
    { value: "8.43 CGPA", label: "B.E. Computer Science, GTU" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/Himil192" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/himil-prajapati" },
    { label: "LeetCode", href: "https://leetcode.com/u/himilprajapati2611/" },
    { label: "HackerRank", href: "https://www.hackerrank.com/profile/himilprajapati21" },
  ],
};

export const chapters = [
  {
    kicker: "01 / Scene",
    title: "Written, not modelled.",
    body: "This form is a Three.js scene written for this site, with no 3D modelling tool involved.",
    range: [0, 0.22],
  },
  {
    kicker: "02 / Render",
    title: "Rendered to frames.",
    body: "Playwright steps through the scene and sharp compresses it into 240 desktop and 120 mobile WebP frames.",
    range: [0.26, 0.5],
  },
  {
    kicker: "03 / Playback",
    title: "Loaded in stages.",
    body: "Sparse key frames arrive first so scrubbing works early, then the rest fill in behind them.",
    range: [0.54, 0.76],
  },
  {
    kicker: "04 / Respect",
    title: "Only when wanted.",
    body: "Frames load near this section, reduced motion gets a single still, and Save-Data gets key frames only.",
    range: [0.82, 1],
  },
] as const;

export const experience = [
  {
    role: "Frontend Developer",
    company: "Cognihive LLC",
    period: "Aug 2025 – Jun 2026",
    points: [
      "Developed and maintained responsive web applications using React.js and Next.js",
      "Built frontend features and user interfaces for the Cognihive application",
      "Improved application performance and cross-browser compatibility",
      "Integrated reusable UI components with backend APIs",
    ],
  },
  {
    role: "Junior React Developer Intern",
    company: "Neonat Health",
    period: "Jan 2025 – Apr 2025",
    points: [
      "Built a nutritional calculator processing 500+ food items with real-time data",
      "Integrated 3+ REST APIs for protein, carbohydrate, and fat predictions",
      "Reduced page load time through component optimization and state management",
      "Took part in code reviews and testing with design and backend teams",
    ],
  },
];

export const projects = [
  {
    title: "TerraBloom",
    tag: "Sustainable living platform",
    description:
      "An eco-focused commerce and content platform with sustainability guides, product suggestions, and login, deployed through a Firebase Hosting CI/CD pipeline.",
    stack: ["React", "Vite", "Tailwind CSS", "Firebase", "Cloudinary"],
    shader: "liquid",
    links: [
      { label: "Live site", href: "https://terrabloom-8dc91.web.app/" },
      { label: "Source", href: "https://github.com/Himil192/TerraBloom" },
    ],
  },
  {
    title: "Karolina Kobiałka",
    tag: "Client website",
    description: "A WordPress website and portfolio created for Karolina Kobiałka.",
    stack: ["WordPress"],
    shader: "silk",
    links: [{ label: "Live site", href: "https://karolinakobialka.pl/" }],
  },
  {
    title: "JavaScript DOM Projects",
    tag: "Vanilla JS practice",
    description: "A collection of browser projects built directly on the DOM, without a framework.",
    stack: ["JavaScript", "HTML", "CSS"],
    shader: "contour",
    links: [
      { label: "Live demo", href: "https://stackblitz.com/edit/dom-project-chaiaurcode-zq1kdwzu" },
      { label: "Source", href: "https://github.com/Himil192/javascript-projects-DOM-" },
    ],
  },
  {
    title: "College ERP",
    tag: "Management system",
    description: "A college management system built with Django.",
    stack: ["Django", "Python"],
    shader: "cells",
    links: [
      { label: "Source", href: "https://github.com/Himil192/ERP-College-management-system-using-Django" },
    ],
  },
] as const;

export const skills = [
  { group: "Languages", items: ["JavaScript", "HTML5", "CSS", "PHP", "Python", "C", "Java"] },
  { group: "Frameworks", items: ["React.js", "Next.js", "Tailwind CSS", "Vite", "Bootstrap"] },
  { group: "Cloud", items: ["Firebase", "AWS", "Google Cloud"] },
  { group: "Tools", items: ["GitHub", "CI/CD", "WordPress", "MySQL Workbench", "VS Code"] },
];

export const education = {
  degree: "B.E. in Computer Science and Engineering",
  school: "Shri S'ad Vidhya Mandal Institute of Technology, affiliated to GTU",
  period: "2021 – 2025",
  score: "CGPA 8.43",
};

export const certifications = [
  {
    label: "Google Cloud Skills Boost Badges",
    href: "https://www.cloudskillsboost.google/public_profiles/9cf12c81-987c-4653-af81-b66ba0c96bab",
  },
  {
    label: "Ask Questions to Make Data-Driven Decisions",
    href: "https://www.coursera.org/account/accomplishments/certificate/3C8F3JZYH36P",
  },
  {
    label: "Foundations: Data, Data, Everywhere",
    href: "https://www.coursera.org/account/accomplishments/certificate/9PGLW8Y6SX4C",
  },
  { label: "HackerRank SQL (Basic)", href: "https://www.hackerrank.com/certificates/7a7f1155eea2" },
  { label: "HackerRank CSS (Basic)", href: "https://www.hackerrank.com/certificates/e9c210f7c348" },
  {
    label: "C++ Advanced, IIT Bombay",
    href: "https://drive.google.com/file/d/17KkE_4ePWPwUxS_fkJGnLaTFBPdNegh1/view",
  },
  {
    label: "Google Career Practitioners Program 2022",
    href: "https://www.cloudskillsboost.google/public_profiles/e3993b20-62d5-432a-9935-b0a3bde11cad",
  },
];

export const achievements = [
  "1st team rank, Internal Hackathon 2022, SVMIT",
  "2nd team rank, Internal Hackathon 2023, SVMIT",
  "Hackathon volunteer for the Student Start-up and Innovation Policy (SSIP)",
];
