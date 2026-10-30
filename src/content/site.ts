import type { ShaderName } from "@/shaders";

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
    kicker: "01 / Data",
    title: "It starts with data.",
    body: "At Neonat Health that meant 3+ REST APIs and 500+ food items.",
    range: [0, 0.22],
  },
  {
    kicker: "02 / Components",
    title: "Built into components.",
    body: "At Cognihive I connected reusable UI components to backend APIs.",
    range: [0.26, 0.5],
  },
  {
    kicker: "03 / Interface",
    title: "Shaped into an interface.",
    body: "Responsive layouts, tuned for performance and cross-browser compatibility.",
    range: [0.54, 0.76],
  },
  {
    kicker: "04 / Shipped",
    title: "Shipped in React and Next.js.",
    body: "From the first API call to a working product.",
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

export type Project = {
  title: string;
  tag: string;
  description: string;
  built: string;
  result?: string;
  stack: string[];
  shader: ShaderName;
  image: string;
  imageAlt: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    title: "Cognihive",
    tag: "Enterprise AI platform",
    description: "A platform that orchestrates AI agents, workflows, and enterprise systems.",
    built:
      "Built the frontend features and interfaces in React and Next.js, connected reusable components to backend APIs, and improved performance and cross-browser compatibility.",
    stack: ["React", "Next.js"],
    shader: "cells",
    image: "/projects/cognihive.webp",
    imageAlt: "Cognihive home page with the headline Amplify Human Decision Making",
    links: [],
  },
  {
    title: "This portfolio",
    tag: "Design and engineering",
    description: "A fast, static site where the visuals are written in code.",
    built:
      "Wrote the GLSL shaders and Three.js scene, rendered the scene to WebP frames, and built staged frame loading with reduced-motion and Save-Data support.",
    stack: ["Next.js", "TypeScript", "Three.js", "GSAP"],
    shader: "liquid",
    image: "/projects/portfolio.webp",
    imageAlt: "Portfolio hero with a liquid metal shader behind the name Himil Prajapati",
    links: [{ label: "Source", href: "https://github.com/Himil192/himil-portfolio" }],
  },
  {
    title: "TerraBloom",
    tag: "Sustainable living platform",
    description: "An eco-focused commerce and content platform with guides and product suggestions.",
    built:
      "Built the responsive React interface, added login with Firebase Authentication and Firestore, stored images on Cloudinary, and deployed through a Firebase Hosting CI/CD pipeline.",
    stack: ["React", "Vite", "Tailwind CSS", "Firebase", "Cloudinary"],
    shader: "contour",
    image: "/projects/terrabloom.webp",
    imageAlt: "TerraBloom home page with the headline Live Greener, Bloom Brighter",
    links: [
      { label: "Live site", href: "https://terrabloom-8dc91.web.app/" },
      { label: "Source", href: "https://github.com/Himil192/TerraBloom" },
    ],
  },
];

export const otherProjects = [
  {
    title: "Karolina Kobiałka",
    note: "WordPress website and portfolio for a client",
    links: [{ label: "Live site", href: "https://karolinakobialka.pl/" }],
  },
  {
    title: "JavaScript DOM Projects",
    note: "Browser projects built without a framework",
    links: [
      { label: "Live demo", href: "https://stackblitz.com/edit/dom-project-chaiaurcode-zq1kdwzu" },
      { label: "Source", href: "https://github.com/Himil192/javascript-projects-DOM-" },
    ],
  },
  {
    title: "College ERP",
    note: "College management system in Django and Python",
    links: [
      { label: "Source", href: "https://github.com/Himil192/ERP-College-management-system-using-Django" },
    ],
  },
];

// Approximate values per 100 g, for the lab's demo calculator only.
export const sampleFoods = [
  { name: "Cooked rice", protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Cooked moong dal", protein: 7, carbs: 19, fat: 0.4 },
  { name: "Paneer", protein: 18, carbs: 1.2, fat: 20 },
  { name: "Boiled egg", protein: 13, carbs: 1.1, fat: 11 },
  { name: "Cooked chicken breast", protein: 31, carbs: 0, fat: 3.6 },
  { name: "Banana", protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Oats", protein: 17, carbs: 66, fat: 7 },
  { name: "Almonds", protein: 21, carbs: 22, fat: 49 },
];

export const skills = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "HTML5", "CSS", "GLSL"] },
  { group: "Frameworks", items: ["React.js", "Next.js", "Tailwind CSS", "Vite", "Bootstrap"] },
  { group: "Motion and 3D", items: ["Three.js", "React Three Fiber", "GSAP"] },
  { group: "Cloud", items: ["Firebase", "AWS", "Google Cloud"] },
  { group: "Tools", items: ["GitHub", "CI/CD", "WordPress", "MySQL Workbench", "VS Code"] },
  { group: "Also familiar", items: ["PHP", "Python", "C", "Java"] },
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
