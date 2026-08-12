export const INITIAL_CANDIDATES = [
  {
    id: "cand-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    role: "Software Engineer",
    experience: "Fresher",
    experienceYears: 0,
    skills: ["Java", "SQL", "Spring Boot", "Git"],
    status: "Shortlisted",
    appliedDate: "2026-08-01",
    location: "Bengaluru, India",
    education: {
      degree: "B.Tech in Computer Science",
      institution: "Indian Institute of Technology, Madras",
      year: "2026",
      gpa: "8.9 / 10"
    },
    projects: [
      {
        title: "Enterprise Distributed Task Scheduler",
        description: "Built a high-throughput async task queue using Java Spring Boot, Redis, and MySQL.",
        techStack: ["Java", "Spring Boot", "Redis", "MySQL"],
        link: "github.com/rahulsharma/task-scheduler"
      },
      {
        title: "Database Query Optimizer Visualizer",
        description: "Interactive web dashboard visualizing SQL execution plans and index usage.",
        techStack: ["React", "Java", "PostgreSQL"],
        link: "github.com/rahulsharma/sql-viz"
      }
    ],
    resume: {
      fileName: "Rahul_Sharma_Resume.pdf",
      fileSize: "1.4 MB",
      uploadedAt: "2026-08-01",
      previewText: "Rahul Sharma — Software Engineer graduate from IIT Madras with solid fundamentals in Java backend engineering, data structures, relational database query optimization, and REST API design."
    },
    interviewFeedback: [
      {
        id: "fb-1",
        interviewer: "Priya Nair (Senior Tech Lead)",
        date: "2026-08-04",
        rating: 4.5,
        stage: "Technical Screening",
        comments: "Excellent understanding of Java memory model and SQL index structures. Strong problem-solving speed."
      }
    ]
  },
  {
    id: "cand-2",
    name: "Ananya Patel",
    email: "ananya.patel@example.com",
    phone: "+91 98123 67890",
    role: "AI Engineer",
    experience: "Fresher",
    experienceYears: 0,
    skills: ["Python", "AI", "PyTorch", "TensorFlow", "FastAPI"],
    status: "Interview Scheduled",
    appliedDate: "2026-08-02",
    location: "Hyderabad, India",
    education: {
      degree: "M.S. in Data Science & AI",
      institution: "BITS Pilani",
      year: "2026",
      gpa: "9.2 / 10"
    },
    projects: [
      {
        title: "Multimodal Medical Image Classifier",
        description: "Trained Vision Transformer & CNN models on radiological scans with 94.2% accuracy.",
        techStack: ["Python", "PyTorch", "FastAPI", "Docker"],
        link: "github.com/ananyapatel/med-ai"
      },
      {
        title: "Real-time RAG Agent for Enterprise Docs",
        description: "Built vector search QA bot with LangChain, FAISS, and Llama 3.",
        techStack: ["Python", "LangChain", "VectorDB"],
        link: "github.com/ananyapatel/doc-rag"
      }
    ],
    resume: {
      fileName: "Ananya_Patel_AI_CV.pdf",
      fileSize: "2.1 MB",
      uploadedAt: "2026-08-02",
      previewText: "Ananya Patel — AI & Machine Learning engineer specialized in Deep Learning, PyTorch, Large Language Model fine-tuning, and scalable inference deployment."
    },
    interviewFeedback: [
      {
        id: "fb-2",
        interviewer: "Dr. Vikram Sethi (Head of AI)",
        date: "2026-08-05",
        rating: 4.8,
        stage: "AI & Math Assessment",
        comments: "Clear understanding of attention mechanisms and gradient optimization. Recommended for Onsite Interview."
      }
    ]
  },
  {
    id: "cand-3",
    name: "Vikram Sengupta",
    email: "vikram.s@example.com",
    phone: "+91 97654 32109",
    role: "Software Engineer",
    experience: "3 Years",
    experienceYears: 3,
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL"],
    status: "Selected",
    appliedDate: "2026-07-20",
    location: "Mumbai, India",
    education: {
      degree: "B.E. in Computer Engineering",
      institution: "Mumbai University",
      year: "2023",
      gpa: "8.7 / 10"
    },
    projects: [
      {
        title: "SaaS Analytics Dashboard",
        description: "Real-time chart streaming dashboard serving 50k DAU with React and WebSocket server.",
        techStack: ["React", "TypeScript", "Node.js", "Recharts"],
        link: "github.com/vikrams/saas-dashboard"
      }
    ],
    resume: {
      fileName: "Vikram_Sengupta_Senior.pdf",
      fileSize: "1.8 MB",
      uploadedAt: "2026-07-20",
      previewText: "Vikram Sengupta — 3+ years experience building enterprise React applications, state management architectures, micro-frontends, and GraphQL backends."
    },
    interviewFeedback: [
      {
        id: "fb-3",
        interviewer: "Karan Johar (Director of Engg)",
        date: "2026-07-28",
        rating: 5.0,
        stage: "System Design & Architecture",
        comments: "Outstanding candidate. Clear communication, top-tier system design skills. Offered position."
      }
    ]
  },
  {
    id: "cand-4",
    name: "Neha Kulkarni",
    email: "neha.kulkarni@example.com",
    phone: "+91 99887 76655",
    role: "Product Manager",
    experience: "4 Years",
    experienceYears: 4,
    skills: ["Product Strategy", "Agile", "User Research", "Mixpanel", "Jira"],
    status: "Shortlisted",
    appliedDate: "2026-08-03",
    location: "Pune, India",
    education: {
      degree: "MBA in Tech Management",
      institution: "IIM Ahmedabad",
      year: "2022",
      gpa: "3.8 / 4.0"
    },
    projects: [
      {
        title: "FinTech Mobile App Redesign",
        description: "Led product strategy resulting in 35% increase in user retention and 1M+ downloads.",
        techStack: ["Product Roadmap", "Figma", "Mixpanel"],
        link: "behance.net/nehak/fintech"
      }
    ],
    resume: {
      fileName: "Neha_Kulkarni_PM_Resume.pdf",
      fileSize: "1.1 MB",
      uploadedAt: "2026-08-03",
      previewText: "Neha Kulkarni — Data-driven Product Manager with 4 years scaling SaaS and B2C fintech platforms from concept to product-market fit."
    },
    interviewFeedback: []
  },
  {
    id: "cand-5",
    name: "Siddharth Rao",
    email: "siddharth.rao@example.com",
    phone: "+91 91234 56789",
    role: "Data Scientist",
    experience: "2 Years",
    experienceYears: 2,
    skills: ["Python", "SQL", "Pandas", "Scikit-Learn", "BigQuery"],
    status: "Interview Scheduled",
    appliedDate: "2026-08-04",
    location: "Gurugram, India",
    education: {
      degree: "B.S. in Statistics & Computer Science",
      institution: "Delhi University",
      year: "2024",
      gpa: "9.0 / 10"
    },
    projects: [
      {
        title: "E-Commerce Customer Churn Predictor",
        description: "Built XGBoost classifier integrated into BigQuery ML for real-time customer churn alerts.",
        techStack: ["Python", "XGBoost", "BigQuery", "Flask"],
        link: "github.com/siddharthr/churn-pred"
      }
    ],
    resume: {
      fileName: "Siddharth_Rao_DataScience.pdf",
      fileSize: "1.6 MB",
      uploadedAt: "2026-08-04",
      previewText: "Siddharth Rao — Data Scientist with hands-on experience in predictive modeling, A/B testing frameworks, statistical analysis, and cloud data warehousing."
    },
    interviewFeedback: []
  },
  {
    id: "cand-6",
    name: "Meera Deshmukh",
    email: "meera.d@example.com",
    phone: "+91 98321 45678",
    role: "Frontend Developer",
    experience: "Fresher",
    experienceYears: 0,
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS"],
    status: "Shortlisted",
    appliedDate: "2026-08-05",
    location: "Noida, India",
    education: {
      degree: "B.Tech in Information Technology",
      institution: "NIT Trichy",
      year: "2026",
      gpa: "8.8 / 10"
    },
    projects: [
      {
        title: "Interactive Web Code Editor",
        description: "Browser-based code playground supporting live preview, themes, and syntax highlighting.",
        techStack: ["React", "Monaco Editor", "Tailwind CSS"],
        link: "github.com/meerad/code-editor"
      }
    ],
    resume: {
      fileName: "Meera_Deshmukh_Frontend.pdf",
      fileSize: "1.2 MB",
      uploadedAt: "2026-08-05",
      previewText: "Meera Deshmukh — Enthusiastic Frontend Developer with a keen eye for UI/UX micro-interactions, responsive layouts, web accessibility, and modern React patterns."
    },
    interviewFeedback: []
  },
  {
    id: "cand-7",
    name: "Arjun Verma",
    email: "arjun.verma@example.com",
    phone: "+91 97112 23344",
    role: "AI Engineer",
    experience: "2 Years",
    experienceYears: 2,
    skills: ["Python", "PyTorch", "NLP", "Transformers", "LangChain"],
    status: "Selected",
    appliedDate: "2026-07-15",
    location: "Bengaluru, India",
    education: {
      degree: "M.Tech in Artificial Intelligence",
      institution: "IISc Bangalore",
      year: "2024",
      gpa: "9.5 / 10"
    },
    projects: [
      {
        title: "Autonomous Document Summarization Agent",
        description: "Fine-tuned Llama-3 model for legal contract analysis achieving 40% reduction in review time.",
        techStack: ["PyTorch", "HuggingFace", "FastAPI"],
        link: "github.com/arjunv/doc-agent"
      }
    ],
    resume: {
      fileName: "Arjun_Verma_AI_Resume.pdf",
      fileSize: "2.3 MB",
      uploadedAt: "2026-07-15",
      previewText: "Arjun Verma — AI Engineer specializing in NLP, Large Language Models, Fine-tuning, and RAG architectures."
    },
    interviewFeedback: [
      {
        id: "fb-7",
        interviewer: "Dr. Vikram Sethi",
        date: "2026-07-22",
        rating: 4.9,
        stage: "Technical Lead Interview",
        comments: "Exceptional depth in transformer architecture and deployment optimization."
      }
    ]
  },
  {
    id: "cand-8",
    name: "Kavya Iyer",
    email: "kavya.iyer@example.com",
    phone: "+91 96543 21098",
    role: "UI/UX Designer",
    experience: "1 Year",
    experienceYears: 1,
    skills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    status: "Interview Scheduled",
    appliedDate: "2026-08-06",
    location: "Chennai, India",
    education: {
      degree: "B.Des in Communication Design",
      institution: "NID Ahmedabad",
      year: "2025",
      gpa: "8.9 / 10"
    },
    projects: [
      {
        title: "Enterprise HR Portal Design System",
        description: "Created comprehensive accessible UI component library for enterprise web apps.",
        techStack: ["Figma", "Tokens", "Design Specs"],
        link: "figma.com/@kavyaiyer/hr-system"
      }
    ],
    resume: {
      fileName: "Kavya_Iyer_Portfolio.pdf",
      fileSize: "4.5 MB",
      uploadedAt: "2026-08-06",
      previewText: "Kavya Iyer — Product Designer passionate about accessible interfaces, user research, micro-interactions, and design systems."
    },
    interviewFeedback: []
  },
  {
    id: "cand-9",
    name: "Rohan Gupta",
    email: "rohan.gupta@example.com",
    phone: "+91 98989 89898",
    role: "Software Engineer",
    experience: "5+ Years",
    experienceYears: 5,
    skills: ["Java", "Spring Cloud", "Kubernetes", "Microservices", "Kafka"],
    status: "Selected",
    appliedDate: "2026-07-10",
    location: "Hyderabad, India",
    education: {
      degree: "B.Tech in Computer Science",
      institution: "IIT Hyderabad",
      year: "2021",
      gpa: "9.1 / 10"
    },
    projects: [
      {
        title: "High Frequency Payment Gateway",
        description: "Architected payment processing engine handling 10,000 TPS with 99.999% uptime.",
        techStack: ["Java", "Kafka", "Redis", "Docker", "Kubernetes"],
        link: "github.com/rohangupta/payment-core"
      }
    ],
    resume: {
      fileName: "Rohan_Gupta_Senior_Backend.pdf",
      fileSize: "1.9 MB",
      uploadedAt: "2026-07-10",
      previewText: "Rohan Gupta — Senior Backend Engineer with 5+ years experience in high-concurrency microservices, event streaming, distributed caching, and cloud infrastructure."
    },
    interviewFeedback: [
      {
        id: "fb-9",
        interviewer: "Anil Kumar (Principal Architect)",
        date: "2026-07-18",
        rating: 5.0,
        stage: "Architectural Interview",
        comments: "Top tier architect candidate. Strong distributed system trade-off knowledge."
      }
    ]
  },
  {
    id: "cand-10",
    name: "Pooja Banerjee",
    email: "pooja.b@example.com",
    phone: "+91 94567 89012",
    role: "DevOps Engineer",
    experience: "2 Years",
    experienceYears: 2,
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Python"],
    status: "Shortlisted",
    appliedDate: "2026-08-07",
    location: "Kolkata, India",
    education: {
      degree: "B.Tech in CSE",
      institution: "Jadavpur University",
      year: "2024",
      gpa: "8.6 / 10"
    },
    projects: [
      {
        title: "Zero Downtime K8s Deployment Pipeline",
        description: "Automated GitOps pipeline using ArgoCD and Terraform on AWS EKS.",
        techStack: ["Kubernetes", "ArgoCD", "Terraform", "GitHub Actions"],
        link: "github.com/poojab/k8s-gitops"
      }
    ],
    resume: {
      fileName: "Pooja_Banerjee_DevOps.pdf",
      fileSize: "1.5 MB",
      uploadedAt: "2026-08-07",
      previewText: "Pooja Banerjee — Cloud Infrastructure & DevOps engineer skilled in AWS, Kubernetes infrastructure provisioning, automated CI/CD pipelines, and security compliance."
    },
    interviewFeedback: []
  }
];

// Generate candidates up to 48 total to meet MindMatrix sample card count requirements
const ROLES = ["Software Engineer", "AI Engineer", "Product Manager", "Data Scientist", "Frontend Developer", "DevOps Engineer", "UI/UX Designer"];
const STAGES = ["Shortlisted", "Interview Scheduled", "Selected", "Applied", "Rejected"];
const EXPERIENCES = ["Fresher", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"];

const ADDITIONAL_NAMES = [
  "Aarav Mehta", "Diya Sharma", "Ishaan Roy", "Sanya Malhotra", "Tanmay Joshi",
  "Rhea Kapoor", "Kabir Bhatia", "Aditi Rao", "Devansh Nanda", "Kriti Sanon",
  "Yash Vardhan", "Priya Sen", "Harsh Singhal", "Simran Kaur", "Nikhil Saxena",
  "Tarun Grover", "Bhavna Rastogi", "Varun Dhawan", "Aakanksha Seth", "Gaurav Misra",
  "Sneha Agarwal", "Kunal Shah", "Ruchika Varma", "Manish Pandey", "Pooja Hegde",
  "Aman Gupta", "Nidhi Agarwal", "Saurabh Tiwari", "Shruti Haasan", "Mohit Suri",
  "Esha Deol", "Raghav Jaitly", "Chitra Viswanathan", "Tushar Kapoor", "Deepika Padukone",
  "Ranveer Singh", "Alia Bhatt", "Sid Malhotra"
];

// Seed to hit stats around: Total 48, Shortlisted 18, Interview 13, Selected 5, Rejected/Applied 12
const STAGE_DISTRIBUTION = [
  "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted", "Shortlisted",
  "Interview Scheduled", "Interview Scheduled", "Interview Scheduled", "Interview Scheduled", "Interview Scheduled", "Interview Scheduled", "Interview Scheduled", "Interview Scheduled", "Interview Scheduled", "Interview Scheduled",
  "Selected", "Selected",
  "Rejected", "Rejected", "Rejected", "Rejected", "Rejected", "Rejected",
  "Applied", "Applied", "Applied", "Applied", "Applied", "Applied"
];

ADDITIONAL_NAMES.forEach((name, idx) => {
  const role = ROLES[idx % ROLES.length];
  const exp = EXPERIENCES[idx % EXPERIENCES.length];
  const expYears = exp === "Fresher" ? 0 : parseInt(exp);
  const status = STAGE_DISTRIBUTION[idx % STAGE_DISTRIBUTION.length];
  const firstName = name.toLowerCase().split(" ")[0];
  const lastName = name.toLowerCase().split(" ")[1];

  INITIAL_CANDIDATES.push({
    id: `cand-${idx + 11}`,
    name: name,
    email: `${firstName}.${lastName}@example.com`,
    phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
    role: role,
    experience: exp,
    experienceYears: expYears,
    skills: role === "Software Engineer" ? ["Java", "SQL", "Spring Boot", "Git"] :
            role === "AI Engineer" ? ["Python", "AI", "PyTorch", "LLM"] :
            role === "Product Manager" ? ["Product Strategy", "Agile", "Roadmapping"] :
            role === "Data Scientist" ? ["Python", "SQL", "Pandas", "Machine Learning"] :
            role === "Frontend Developer" ? ["React", "TypeScript", "CSS3", "HTML5"] :
            role === "DevOps Engineer" ? ["AWS", "Docker", "Kubernetes", "CI/CD"] :
            ["Figma", "UI/UX", "User Research", "Wireframing"],
    status: status,
    appliedDate: `2026-08-0${(idx % 8) + 1}`,
    location: idx % 2 === 0 ? "Bengaluru, India" : idx % 3 === 0 ? "Hyderabad, India" : "Pune, India",
    education: {
      degree: `B.Tech in ${role.includes("AI") || role.includes("Data") ? "Data Science" : "Computer Engineering"}`,
      institution: idx % 2 === 0 ? "IIT Bombay" : "BITS Pilani",
      year: "2025",
      gpa: "8.5 / 10"
    },
    projects: [
      {
        title: `${role} Key Initiative`,
        description: `Designed and deployed core components for enterprise ${role.toLowerCase()} platform.`,
        techStack: [role, "Cloud", "Git"],
        link: `github.com/${firstName}${lastName}/project`
      }
    ],
    resume: {
      fileName: `${name.replace(" ", "_")}_Resume.pdf`,
      fileSize: "1.3 MB",
      uploadedAt: `2026-08-0${(idx % 8) + 1}`,
      previewText: `${name} — Professional candidate with expertise in ${role}. Demonstrated track record of delivering clean code, effective collaboration, and software reliability.`
    },
    interviewFeedback: status === "Interview Scheduled" || status === "Selected" ? [
      {
        id: `fb-gen-${idx}`,
        interviewer: "Recruitment Panel",
        date: "2026-08-08",
        rating: 4.2,
        stage: "Technical Screening",
        comments: "Strong candidate fundamentals. Good communication."
      }
    ] : []
  });
});
