import { useState, useRef, useEffect } from "react";
import { X, Send, User, Phone, Mail, HelpCircle } from "lucide-react";

interface UserDetails {
  name: string;
  mobile: string;
  email: string;
  purpose: string;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface KnowledgeEntry {
  keywords: string[];
  phrases: string[];
  answer: string;
}

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["about", "viet", "college", "institute", "institution", "history", "founded", "established", "started", "when", "year"],
    phrases: ["tell me about", "what is viet", "about the college", "about viet", "about this college", "college details", "what is this", "know about", "information about"],
    answer: "Visakha Institute of Engineering & Technology (VIET) was founded by 'Varaha Lakshmi Narasimha Swamy Educational Trust' (VLNS Educational Trust) at Narava in 2008. It is located on a sprawling 15-acre campus on the west side of Visakhapatnam city, nearby several industries and Visakhapatnam Export Processing Zone (VEPZ). VIET is affiliated to JNTU Kakinada, Andhra Pradesh and holds UGC Autonomous status."
  },
  {
    keywords: ["admission", "admissions", "apply", "application", "enroll", "enrollment", "join", "form", "seat", "intake"],
    phrases: ["how to join", "how to apply", "how to get admission", "admission process", "want to join", "want admission", "how can i join", "get into", "admission procedure", "i want to study", "can i join"],
    answer: "For admissions at VIET, you can fill the Online Admission Form available on our website. Admissions are available for Diploma, B.Tech, M.Tech, BBA, BCA, MBA, and MCA programs. Contact us at +91-9959617476 or +91-9959617477 for more details about eligibility, seats, and admission process."
  },
  {
    keywords: ["fee", "fees", "tuition", "cost", "charges", "payment", "expensive", "affordable", "price"],
    phrases: ["how much", "fee structure", "what is the fee", "total cost", "yearly fee", "semester fee", "fee details"],
    answer: "For the latest fee structure details, please contact the admissions office at +91-9959617476 or +91-9959617477, or email us at vietvsp@gmail.com."
  },
  {
    keywords: ["placement", "placements", "placed", "package", "salary", "recruit", "recruiter", "companies", "job", "offer", "hired", "hiring"],
    phrases: ["placement record", "placement details", "do you have placements", "how are placements", "placement statistics", "are placements good", "get placed", "campus placement", "placement cell", "which companies", "companies come", "companies visit"],
    answer: "VIET has an excellent placement record for 2024-2025:\n• Highest Package: 10 LPA (Rinex Technologies)\n• Average Package: 4.5 LPA\n• Total Offers: 250+\n• Companies Visited: 53+\n• Placement Rate: 95%\n\nTop recruiters include Rinex Technologies (10 LPA), Intellipaat (9 LPA), WPG Holding (7.2 LPA), Tech Mahindra, TCS, HCL, Infocepts, TensorGo, 24/7 AI, Schneider Electrics, Renault Nissan, DBS, and many more."
  },
  {
    keywords: ["highest package", "top package", "best package", "maximum", "lpa"],
    phrases: ["highest offer", "best offer", "top salary", "maximum package", "what is the highest"],
    answer: "The highest package offered at VIET for 2024-2025 is 10 LPA by Rinex Technologies. Other top offers include:\n• 9 LPA - Intellipaat Software Solutions\n• 7.2 LPA - WPG Holding Limited\n• 7 LPA - Ocean Link Sea Services, Infocepts, Emipro Technologies\n• 6.4 LPA - Keeves Technologies\n• 6 LPA - TensorGo, Capsitech, Nuvoco Vistas, BavisTech"
  },
  {
    keywords: ["course", "courses", "program", "programs", "branch", "branches", "department", "departments", "stream", "offered", "available"],
    phrases: ["what courses", "which courses", "courses offered", "programs available", "what branches", "which branches", "departments available", "courses available", "what can i study", "what programs", "list of courses"],
    answer: "VIET offers 15+ programs:\n\n📘 Diploma: Civil, Computer, ECE, EEE, Mechanical\n\n🎓 B.Tech: CSE, CSE (Data Science), CSE (Cyber Security), CSE (AI & ML), ECE, EEE, Civil, Mechanical\n\n📗 M.Tech: CAD/CAM, Power Electronics, Structural Engineering, Thermal Engineering, VLSI/Embedded Systems\n\n📙 Management: BBA, BCA, MBA, MCA\n\nTotal Students: 4,900+ | Faculty: 200+"
  },
  {
    keywords: ["cse", "computer science", "computer engineering", "cs"],
    phrases: ["about cse", "cse department", "computer science department", "tell me about cse"],
    answer: "The CSE Department at VIET offers B.Tech in Computer Science & Engineering with specializations in Data Science, Cyber Security, and AI & ML.\n\n• Facilities: Computer & Networking Labs, AI & ML Lab, Wi-Fi Campus\n• R&D: 25+ Papers published, 8 Ph.D Faculty, 5 Ongoing research projects, 3 Patents\n• Placements: 95% rate, 50+ companies, Highest: ₹8.5L, Average: ₹4.2L\n• Research Areas: AI & ML, Cybersecurity, Data Science, IoT, Computer Vision, NLP, Blockchain"
  },
  {
    keywords: ["data science", "csd", "big data", "analytics"],
    phrases: ["about data science", "data science course", "data science branch"],
    answer: "CSE - Data Science (CSD) is a B.Tech specialization at VIET, covering Big Data, Machine Learning, Data Analytics, and Statistical Modeling. The department has excellent lab facilities and industry-aligned curriculum as prescribed by JNTU Kakinada."
  },
  {
    keywords: ["cyber", "security", "cybersecurity", "csc", "hacking", "ethical"],
    phrases: ["about cyber security", "cyber security course", "cyber security branch"],
    answer: "CSE - Cyber Security (CSC) is a B.Tech specialization at VIET covering network security, ethical hacking, cryptography, and information security. Research areas include Cybersecurity monitoring and advanced threat detection."
  },
  {
    keywords: ["ai", "ml", "artificial intelligence", "machine learning", "aiml", "csm"],
    phrases: ["about ai ml", "ai course", "machine learning course", "aiml branch", "artificial intelligence"],
    answer: "CSE - AI & Machine Learning (CSM) is a B.Tech specialization at VIET. Research areas include AI & ML, Computer Vision, NLP, and IoT. The department has a dedicated AI & ML Lab and faculty actively involved in research publications and patents."
  },
  {
    keywords: ["ece", "electronics", "communication"],
    phrases: ["about ece", "ece department", "electronics department", "tell me about ece"],
    answer: "The ECE (Electronics & Communication Engineering) department offers B.Tech and is one of the core engineering programs at VIET with well-equipped labs and experienced faculty. M.Tech in VLSI/Embedded Systems is also available."
  },
  {
    keywords: ["eee", "electrical"],
    phrases: ["about eee", "eee department", "electrical department", "tell me about eee"],
    answer: "The EEE (Electrical & Electronics Engineering) department offers B.Tech programs at VIET. M.Tech in Power Electronics/Power Systems is also available."
  },
  {
    keywords: ["mechanical", "mech"],
    phrases: ["about mechanical", "mechanical department", "mechanical engineering"],
    answer: "The Mechanical Engineering department at VIET offers B.Tech and M.Tech (CAD/CAM, Thermal Engineering) programs with well-equipped workshops and labs."
  },
  {
    keywords: ["civil"],
    phrases: ["about civil", "civil department", "civil engineering"],
    answer: "The Civil Engineering department at VIET offers B.Tech and M.Tech (Structural Engineering) programs. Diploma in Civil Engineering is also available."
  },
  {
    keywords: ["automobile", "auto", "ame"],
    phrases: ["about automobile", "automobile engineering", "automobile department"],
    answer: "The Automobile Engineering (AME) department at VIET provides specialized training in automotive technology. Available at both Diploma and B.Tech levels."
  },
  {
    keywords: ["diploma"],
    phrases: ["about diploma", "diploma courses", "diploma programs", "polytechnic"],
    answer: "VIET offers Diploma programs in: Civil, Computer, ECE, EEE, and Mechanical Engineering. Total Diploma students: 1,400+."
  },
  {
    keywords: ["mtech", "m.tech", "postgraduate", "pg", "masters", "post graduation"],
    phrases: ["about mtech", "pg courses", "post graduate", "after btech", "higher studies"],
    answer: "VIET offers M.Tech programs in:\n• CAD/CAM\n• Power Electronics / Power Systems\n• Structural Engineering\n• Thermal Engineering\n• VLSI / Embedded Systems\n\nAlso available: MBA and MCA. Total PG students: 600+."
  },
  {
    keywords: ["mba", "bba", "management", "business"],
    phrases: ["about mba", "mba course", "business course", "management course"],
    answer: "VIET offers Management programs: BBA (undergraduate) and MBA (postgraduate) under the Management department."
  },
  {
    keywords: ["mca", "bca", "computer application"],
    phrases: ["about mca", "mca course", "bca course", "computer applications"],
    answer: "VIET offers BCA (undergraduate) and MCA (postgraduate) programs in Computer Applications."
  },
  {
    keywords: ["hostel", "accommodation", "stay", "room", "boarding", "living"],
    phrases: ["is there hostel", "hostel facility", "hostel available", "can i stay", "accommodation available", "where to stay"],
    answer: "VIET provides hostel facilities for students on campus. For details about rooms, fees, and amenities, please contact the college at +91-9959617476."
  },
  {
    keywords: ["transport", "bus", "travel", "route", "commute", "pick", "drop"],
    phrases: ["is there bus", "transport facility", "bus facility", "how to reach", "bus routes", "college bus"],
    answer: "VIET provides transport facilities covering major routes across Visakhapatnam. Visit the Transport section on our website for route details and timings."
  },
  {
    keywords: ["library", "books", "reading", "journal"],
    phrases: ["is there library", "library facility", "about library", "books available"],
    answer: "VIET has a Central Library with a vast collection of textbooks, reference books, journals, and digital resources including e-journals and online databases."
  },
  {
    keywords: ["lab", "laboratory", "labs", "practical"],
    phrases: ["is there lab", "lab facility", "what labs", "laboratory facility", "labs available"],
    answer: "VIET has well-equipped laboratories including:\n• Computer & Networking Labs\n• AI & ML Lab\n• Department-specific labs for ECE, EEE, Mechanical, Civil\n\nThe college has state-of-the-art technology in all laboratories with spacious, well-maintained infrastructure."
  },
  {
    keywords: ["sports", "games", "athletics", "ground", "playground"],
    phrases: ["is there sports", "sports facility", "sports ground", "games facility", "playground available"],
    answer: "VIET has sports facilities on campus. The Binary Sports club organizes inter-college tournaments and fitness activities for students."
  },
  {
    keywords: ["cafeteria", "canteen", "food", "mess", "eating", "lunch"],
    phrases: ["is there canteen", "food facility", "canteen available", "where to eat", "cafeteria available"],
    answer: "VIET has a canteen facility on campus serving food for students and staff."
  },
  {
    keywords: ["campus", "campus life", "events", "cultural", "fest", "festival", "club", "activities", "extracurricular"],
    phrases: ["campus life", "what about events", "any clubs", "student activities", "extra curricular", "college life", "cultural activities", "is there any club"],
    answer: "VIET has vibrant campus life with various clubs and activities:\n• Code Crafters - Programming club (Hackathons, open source)\n• ThinkTank Trivia - Quiz Club (Competitive quizzes)\n• Binary Sports - Sports & Fitness (Inter-college tournaments)\n• Fusion Fantasia - Cultural Events (Music, dance, arts, drama)\n\nThe Idea Cell has 50+ ideas submitted, 15+ startups launched, 25+ mentors, and 5 awards won!"
  },
  {
    keywords: ["chairman", "satyanarayana", "trust", "founder", "owner"],
    phrases: ["who is chairman", "about chairman", "chairman name", "who founded", "who started", "who owns"],
    answer: "Chairman: Sri G. Satyanarayana Garu (M.Tech, MBA)\nTrust: Varaha Lakshmi Narasimha Swamy Educational Trust (VLNS)\n\nChairman's message: \"It is my vision to provide the nation with motivated, responsible and disciplined youth to form a better future. Our experienced and dedicated faculty nurtures and ignites the young minds through strong academics, co-curricular and extra-curricular activities.\""
  },
  {
    keywords: ["principal", "vidya", "pradeep", "head"],
    phrases: ["who is principal", "about principal", "principal name", "college head", "who is the head"],
    answer: "Principal: Prof. G Vidya Pradeep Varma (M.Tech, Ph.D)\n\nPrincipal's message: \"VIET is most admired institution for pursuing technical education. The institution aims to provide support to faculty and students to attain the knowledge as well as the skills that they aspire for. The College has excellent infrastructure, imposing buildings with spacious class rooms, and Laboratories with state of the art technology.\""
  },
  {
    keywords: ["dean", "academics", "santha"],
    phrases: ["who is dean", "about dean", "dean academics", "academic head"],
    answer: "Dean Academics: Dr. D. Santha Rao (Ph.D. from AU, M.E. from NIT Tiruchirappalli)\n\nMessage: \"We're committed to provide a world-class education that equips with the technical skills, knowledge, and mind-set needed to excel in the field of engineering, Management and Computer applications.\""
  },
  {
    keywords: ["innovation", "entrepreneurship", "startup", "idea", "ranga", "incubation"],
    phrases: ["about innovation", "startup support", "idea cell", "entrepreneurship cell", "dean innovation"],
    answer: "Dean Innovation & Student Projects: Dr. Ranga Rao Velamala (Ph.D. from AU, M.Tech IT)\n\nVIET fosters a culture of innovation and entrepreneurship with ideas labs, entrepreneurship programs, and mentorship.\n• 50+ Ideas submitted\n• 15+ Startups launched\n• 25+ Mentors\n• 5 Awards won"
  },
  {
    keywords: ["naac", "accreditation", "accredited", "grade", "quality"],
    phrases: ["is naac accredited", "naac grade", "what grade", "accreditation status", "is it accredited", "naac rating"],
    answer: "VIET is accredited with 'A' Grade by NAAC (awarded in 2023). This ensures quality assurance, industry recognition, better career opportunities, and academic excellence for students."
  },
  {
    keywords: ["ranking", "nirf", "ranked", "rank"],
    phrases: ["what is the ranking", "nirf ranking", "is it ranked", "college ranking", "any ranking"],
    answer: "VIET is ranked among the Top Engineering Colleges in NIRF rankings. The college also holds NAAC 'A' Grade, UGC Autonomous status, AICTE approval, and ISO 9001:2015 certification."
  },
  {
    keywords: ["ugc", "autonomous", "autonomy"],
    phrases: ["is it autonomous", "autonomous status", "ugc status", "is viet autonomous"],
    answer: "VIET has been conferred Autonomous status and Category I status by UGC for academic excellence and self-governance. This gives VIET the freedom to design curriculum and conduct examinations independently while being affiliated to JNTU Kakinada."
  },
  {
    keywords: ["aicte", "approved", "approval"],
    phrases: ["is it aicte approved", "aicte approval", "aicte status"],
    answer: "VIET is continuously approved by AICTE since 2008, ensuring quality technical education for over 18 years."
  },
  {
    keywords: ["iso", "certified", "certification"],
    phrases: ["is it iso certified", "iso certification", "quality certification"],
    answer: "VIET is ISO 9001:2015 certified for quality management systems and institutional processes."
  },
  {
    keywords: ["affiliation", "affiliated", "university", "jntu", "jntuk"],
    phrases: ["which university", "affiliated to", "university affiliation", "under which university"],
    answer: "VIET is affiliated to Jawaharlal Nehru Technological University (JNTU), Kakinada, Andhra Pradesh. The Institute follows the curriculum as prescribed by JNTU Kakinada. VIET also holds UGC Autonomous status allowing it to design its own curriculum."
  },
  {
    keywords: ["research", "r&d", "patent", "publication", "paper"],
    phrases: ["any research", "research work", "research papers", "research facility", "patents filed", "research cell"],
    answer: "VIET's R&D highlights:\n• 25+ Research papers published\n• 8 Ph.D Faculty members\n• 5 Ongoing research projects\n• 3 Patents\n\nResearch areas: AI & ML, Cybersecurity, Data Science, IoT, Computer Vision, NLP, and Blockchain."
  },
  {
    keywords: ["exam", "examination", "result", "marks", "test"],
    phrases: ["about exams", "exam schedule", "how are exams", "examination pattern", "exam system"],
    answer: "Being autonomous, VIET conducts its own examinations. VIET follows Outcome Based Education (OBE) for undergraduate programs. Check the Examinations section on the website for UG/PG and Diploma exam details."
  },
  {
    keywords: ["location", "address", "where", "reach", "map", "direction", "visakhapatnam", "vizag", "narava", "situated", "located"],
    phrases: ["where is viet", "where is the college", "college address", "how to reach", "location of college", "which city", "which place"],
    answer: "VIET is located at:\n📍 88th Division, Narava, GVMC, Visakhapatnam, Andhra Pradesh 530027, India\n\nThe campus is on the west side of Visakhapatnam city, nearby several industries and Visakhapatnam Export Processing Zone (VEPZ). Campus area: 15 acres."
  },
  {
    keywords: ["contact", "phone", "call", "number", "email", "reach", "enquiry", "inquiry"],
    phrases: ["how to contact", "contact number", "phone number", "email id", "contact details", "how to reach you", "give me number", "college number"],
    answer: "Contact VIET:\n📞 +91-9959617476\n📞 +91-9959617477\n📞 +91-9550957054\n📧 website@viet.edu.in\n📧 vietvsp@gmail.com\n📍 88th Division, Narava, GVMC, Visakhapatnam, AP 530027"
  },
  {
    keywords: ["faculty", "teacher", "professor", "staff", "lecturer", "teaching"],
    phrases: ["about faculty", "how many teachers", "faculty quality", "teaching staff", "qualified faculty", "experienced faculty"],
    answer: "VIET has 200+ highly qualified and experienced faculty members across all departments, many with Ph.D. qualifications. The CSE department alone has 8 faculty with Ph.D. degrees. Faculty nurtures students through strong academics, co-curricular, and extra-curricular activities."
  },
  {
    keywords: ["scholarship", "financial", "aid", "concession", "waiver"],
    phrases: ["any scholarship", "scholarship available", "financial help", "fee concession", "any aid"],
    answer: "For scholarship and financial aid information, please contact the admissions office at +91-9959617476 or email vietvsp@gmail.com."
  },
  {
    keywords: ["committee", "committees", "anti-ragging", "grievance", "cell", "ragging", "complaint"],
    phrases: ["any committees", "grievance cell", "anti ragging", "complaint cell", "safety measures", "is it safe"],
    answer: "VIET has various committees including Anti-Ragging Committee, Grievance Redressal Cell, Internal Complaints Committee, and IQAC (Internal Quality Assurance Cell) to ensure a safe and quality campus experience."
  },
  {
    keywords: ["aqar", "iqac"],
    phrases: ["aqar report", "quality report", "iqac report"],
    answer: "VIET submits Annual Quality Assurance Reports (AQAR) regularly. Reports are available for 2021-2022, 2022-2023, and 2023-2024 on the website."
  },
  {
    keywords: ["vision", "mission", "goal", "objective"],
    phrases: ["what is the vision", "what is the mission", "college vision", "college mission", "goals of college"],
    answer: "Vision: \"To be an exemplary institution that thrives on its commitment to the transformative power of value-based education, providing the impetus to develop the expansiveness to harmonize both scientific knowledge and spiritual understanding, to utilize knowledge for societal benefit.\"\n\nMission: VIET focuses on Education for Life (value-based learning), Excellence Driven Research (addressing global technology challenges), and Global Impact (solving scientific and societal challenges)."
  },
  {
    keywords: ["infrastructure", "building", "campus area", "facility", "facilities", "amenities"],
    phrases: ["what facilities", "campus facilities", "infrastructure details", "what amenities", "college infrastructure", "facilities available"],
    answer: "VIET campus highlights:\n• 15-acre sprawling campus\n• Spacious classrooms with modern infrastructure\n• State-of-the-art laboratories\n• Central Library\n• Computer & Networking Labs\n• AI & ML Lab\n• Hostel facilities\n• Transport\n• Sports grounds\n• Canteen\n• Wi-Fi enabled Campus\n• Medical facility"
  },
  {
    keywords: ["student", "students", "strength", "total", "how many"],
    phrases: ["how many students", "total students", "student strength", "number of students"],
    answer: "VIET has 4,900+ students:\n• Diploma students: 1,400+\n• Undergraduate (B.Tech) students: 2,900+\n• Postgraduate students: 600+\n\nFaculty: 200+ members across 15+ programs."
  },
  {
    keywords: ["ecap", "camu", "login", "portal", "student portal", "erp"],
    phrases: ["student login", "how to login", "student portal", "online portal", "attendance portal"],
    answer: "VIET has online portals:\n• ECAP Login: webprosindia.com/viet\n• CAMU Staff Login: camu.in\n• CAMU Student Login: mycamu.co.in\n\nThese portals provide access to academic records, attendance, and other student/staff services."
  },
  {
    keywords: ["social media", "facebook", "instagram", "linkedin", "follow"],
    phrases: ["social media", "facebook page", "instagram page", "follow on social media", "online presence"],
    answer: "Follow VIET on social media:\n• Facebook: facebook.com/vietvizag\n• Instagram: @visakha_college_official\n• LinkedIn: Visakha Institute of Engineering & Technology"
  },
  {
    keywords: ["industrial visit", "industry", "industrial", "exposure"],
    phrases: ["industrial visits", "industry exposure", "industry connections", "industrial training"],
    answer: "VIET arranges industrial visits to bridge the gap between theoretical knowledge and industrial applications. The college is located near several industries and Visakhapatnam Export Processing Zone (VEPZ), providing excellent exposure to students."
  },
  {
    keywords: ["wifi", "internet", "wi-fi", "net"],
    phrases: ["is there wifi", "internet facility", "wifi available", "wifi campus"],
    answer: "VIET has a Wi-Fi enabled campus, providing internet access to students and faculty throughout the campus for academic and research purposes."
  },
  {
    keywords: ["vlns", "group", "trust"],
    phrases: ["about the trust", "vlns group", "parent organization", "management group"],
    answer: "VIET is part of the VLNS Group of Institutions, managed by Varaha Lakshmi Narasimha Swamy Educational Trust. Founded by Chairman Sri G. Satyanarayana Garu, the group has emerged as a proficient modern technical group of educational institutions in Andhra Pradesh, India."
  },
  {
    keywords: ["good", "best", "worth", "recommend", "review", "opinion"],
    phrases: ["is it good", "is viet good", "should i join", "is it worth", "good college", "how is the college", "college review", "is it a good college", "would you recommend"],
    answer: "VIET is recognized as one of the leading institutions in Andhra Pradesh with:\n• NAAC 'A' Grade accreditation\n• UGC Autonomous status (Category I)\n• AICTE approved since 2008\n• NIRF ranked among top engineering colleges\n• 95% placement rate\n• 10 LPA highest package\n• 200+ qualified faculty\n• 15-acre campus with modern infrastructure\n\nThe college emphasizes holistic development through academics, research, and extracurricular activities."
  },
  {
    keywords: ["eligibility", "criteria", "qualification", "required", "marks", "percentage", "cutoff"],
    phrases: ["eligibility criteria", "what marks needed", "minimum marks", "qualification required", "who can apply", "cutoff marks", "required percentage"],
    answer: "For eligibility criteria and cutoff details for various programs (Diploma, B.Tech, M.Tech, BBA, BCA, MBA, MCA), please contact the admissions office at +91-9959617476 or +91-9959617477. You can also fill the Online Admission Form on our website."
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings", "hii", "hlo", "helo"],
    phrases: ["hello", "hi there", "hey there", "good morning", "good afternoon", "good evening"],
    answer: "Hello! I'm Prerana, your VIET assistant. Welcome to Visakha Institute of Engineering & Technology! How can I help you today?\n\nYou can ask me about admissions, courses, placements, facilities, or anything about our college."
  },
  {
    keywords: ["thank", "thanks", "thank you", "bye", "goodbye", "ok", "okay", "got it"],
    phrases: ["thank you", "thanks a lot", "bye bye", "see you", "that's all", "no more questions"],
    answer: "You're welcome! If you have any more questions about VIET, feel free to ask anytime. You can also reach us directly at +91-9959617476. Have a great day!"
  },
  {
    keywords: ["help", "assist", "support", "what can"],
    phrases: ["help me", "what can you do", "what can you help", "how can you help", "what do you know", "what topics"],
    answer: "I'm Prerana, and I can help you with information about VIET:\n\n• Admissions & Eligibility\n• Courses & Departments (Diploma, B.Tech, M.Tech, BBA, BCA, MBA, MCA)\n• Placements & Recruiters (10 LPA highest)\n• Campus Facilities (Hostel, Library, Labs, Transport)\n• Accreditations (NAAC A, UGC Autonomous, AICTE, NIRF)\n• Faculty & Research\n• Campus Life & Clubs\n• Contact Information & Location\n• Vision & Mission\n• College Leadership\n\nJust ask your question!"
  },
  {
    keywords: ["medical", "health", "hospital", "clinic", "doctor"],
    phrases: ["medical facility", "health center", "is there hospital", "medical help", "doctor available"],
    answer: "VIET has a medical facility on campus to attend to the health needs of students and staff."
  },
  {
    keywords: ["girls", "women", "female", "coed", "co-ed", "boys"],
    phrases: ["is it for girls", "boys and girls", "co education", "only for girls", "only for boys", "is it coed"],
    answer: "VIET (Visakha Institute of Engineering & Technology) is a co-educational institution open to both male and female students. For more details about admissions, contact +91-9959617476."
  },
  {
    keywords: ["website", "site", "online", "url", "web"],
    phrases: ["college website", "official website", "website address", "website url"],
    answer: "You're currently on the official VIET website! You can explore various sections including About Us, Courses, Placements, Facilities, Accreditations, and more through the navigation menu. For any additional queries, contact us at +91-9959617476."
  }
];

function findAnswer(question: string): string {
  const q = question.toLowerCase().trim().replace(/[?!.,]/g, "");

  if (q.length < 2) {
    return "Could you please elaborate your question? I'm Prerana, and I'm here to help with information about VIET (Visakha Institute of Engineering & Technology).";
  }

  let bestMatch = { score: 0, answer: "" };

  for (const entry of knowledgeBase) {
    let score = 0;

    for (const phrase of entry.phrases) {
      if (q.includes(phrase.toLowerCase())) {
        score += phrase.length * 3;
      }
    }

    for (const keyword of entry.keywords) {
      const kw = keyword.toLowerCase();
      if (q.includes(kw)) {
        score += kw.length + 2;
      }
      const words = q.split(/\s+/);
      for (const word of words) {
        if (word === kw) {
          score += 5;
        }
        if (word.length > 3 && kw.length > 3 && (word.includes(kw) || kw.includes(word))) {
          score += 3;
        }
      }
    }

    if (score > bestMatch.score) {
      bestMatch = { score, answer: entry.answer };
    }
  }

  if (bestMatch.score >= 5) {
    return bestMatch.answer;
  }

  return "I'm sorry, I can only answer questions related to VIET (Visakha Institute of Engineering & Technology). Please ask about admissions, courses, placements, facilities, accreditations, faculty, or other college-related topics.\n\nType 'help' to see what I can assist with.\n\nOr contact us directly at +91-9959617476.";
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"details" | "chat">("details");
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    mobile: "",
    email: "",
    purpose: ""
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (step === "chat" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.name.trim() || !userDetails.mobile.trim()) return;

    setStep("chat");
    setMessages([
      {
        id: 1,
        text: `Hi ${userDetails.name}! I'm Prerana, your VIET assistant. Welcome to Visakha Institute of Engineering & Technology!\n\nHow can I help you today? You can ask about admissions, courses, placements, facilities, or anything about our college.`,
        sender: "bot",
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: messages.length + 1,
      text: trimmed,
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(trimmed);
      const botMsg: Message = {
        id: messages.length + 2,
        text: answer,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setStep("details");
    setMessages([]);
    setUserDetails({ name: "", mobile: "", email: "", purpose: "" });
    setInputValue("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-[60px] h-[60px] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 group overflow-hidden border-2 border-[#E1731A]"
        aria-label="Chat with Prerana"
      >
        {isOpen ? (
          <div className="w-full h-full bg-gradient-to-br from-[#E1731A] to-[#c25e10] flex items-center justify-center">
            <X className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-90" />
          </div>
        ) : (
          <>
            <img
              src="/prerana-bot.png"
              alt="Prerana - VIET Assistant"
              className="w-full h-full object-cover"
            />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[370px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E1731A] to-[#d4650f] p-4 text-white flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
              <img
                src="/prerana-bot.png"
                alt="Prerana"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Prerana</h3>
              <p className="text-xs text-white/80">VIET College Assistant</p>
            </div>
            {step === "chat" && (
              <button
                onClick={resetChat}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition-colors"
                title="Start new chat"
              >
                New
              </button>
            )}
          </div>

          {/* Details Form */}
          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-center mb-2">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#E1731A]/30 mb-2">
                  <img src="/prerana-bot.png" alt="Prerana" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-medium text-gray-700">Hi! I'm Prerana</p>
                <p className="text-xs text-gray-500 mt-1">Please provide your details to start chatting</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E1731A]/40 focus:border-[#E1731A] transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={userDetails.mobile}
                    onChange={(e) => setUserDetails({ ...userDetails, mobile: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E1731A]/40 focus:border-[#E1731A] transition-all"
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email (Optional)"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E1731A]/40 focus:border-[#E1731A] transition-all"
                  />
                </div>

                <div>
                  <select
                    value={userDetails.purpose}
                    onChange={(e) => setUserDetails({ ...userDetails, purpose: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E1731A]/40 focus:border-[#E1731A] transition-all text-gray-600"
                  >
                    <option value="">Purpose of Inquiry</option>
                    <option value="admission">Admission Inquiry</option>
                    <option value="placement">Placement Information</option>
                    <option value="courses">Course Details</option>
                    <option value="facilities">Campus Facilities</option>
                    <option value="general">General Information</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#E1731A] to-[#c25e10] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Chat
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                Your information is secure and will only be used to assist you.
              </p>
            </form>
          )}

          {/* Chat Messages */}
          {step === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-2`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-[#E1731A]/30 mt-1">
                        <img src="/prerana-bot.png" alt="Prerana" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === "user"
                          ? "bg-gradient-to-br from-[#E1731A] to-[#c25e10] text-white rounded-br-md"
                          : "bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-[#E1731A]/30 mt-1">
                      <img src="/prerana-bot.png" alt="Prerana" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl rounded-bl-md border border-gray-200 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-200 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask Prerana about VIET..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#E1731A]/40 focus:border-[#E1731A] transition-all"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E1731A] to-[#c25e10] text-white flex items-center justify-center hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
