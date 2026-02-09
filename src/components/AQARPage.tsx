import { motion } from 'framer-motion';
import { FileText, CheckCircle, ChevronRight } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AQARPageProps {
  year: string;
}

const AQARPage = ({ year }: AQARPageProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // AQAR Criteria Data - same structure for all years
  const criteria = [
    {
      id: 1,
      title: "CRITERION - 1",
      name: "Curricular Aspects",
      metrics: [
        {
          id: "1.1.1",
          title: "The Institution ensures effective curriculum delivery through a well planned and documented process",
          items: [
            { name: "1.1.1(1) Effective Planning and Delivery", link: "#" },
            { name: "1.1.2 Academic Calendars", link: "#" },
            { name: "1.1.3 Work Load & Time tables", link: "#" }
          ]
        },
        {
          id: "1.2.1",
          title: "Number of Programmes in which Choice Based Credit System (CBCS)/ elective course system has been implemented",
          items: [
            { name: "1.2.1 - Number of Programmes in which Choice Based Credit System (CBCS)/ elective course system has been implemented", link: "#" }
          ]
        },
        {
          id: "1.2.2",
          title: "Number of Add on /Certificate programs offered during the year",
          items: [
            { name: "1.2.2.1 - Number of Add on /Certificate programs offered during the year", link: "#" }
          ]
        },
        {
          id: "1.3.1",
          title: "Institution integrates crosscutting issues relevant to Professional Ethics, Gender, Human Values, Environment and Sustainability into the Curriculum",
          items: [
            { name: "1.2.3 - Number of students enrolled in Certificate/ Add-on programs as against the total number of students during the year", link: "#" },
            { name: "1.3.1 - Institution integrates crosscutting issues relevant to Professional Ethics, Gender, Human Values, Environment and Sustainability into the Curriculum", link: "#" }
          ]
        },
        {
          id: "1.3.2",
          title: "Percentage of students undertaking project work/field work/ internships (Data for the latest completed academic year)",
          items: [
            { name: "1.3.1 - Number of courses that include experiential learning through project work during the year", link: "#" },
            { name: "1.3.2 - Number of courses that include experiential learning through field work during the year", link: "#" },
            { name: "1.3.3 - Number of courses that include experiential learning through internship during the year", link: "#" },
            { name: "1.3.3 - Number of students undertaking project work/field work/ internships", link: "#" }
          ]
        },
        {
          id: "1.4.1",
          title: "Institution obtains feedback on the syllabus and its transaction at the institution from the following stakeholders",
          items: [
            { name: "1.4.1 Feedback Forms of Students, Teachers, Employers and Alumni", link: "#" },
            { name: `1.4.2 Action Taken Report ${year}`, link: "#" }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "CRITERION - 2",
      name: "Teaching-Learning and Evaluation",
      metrics: [
        {
          id: "2.1.1",
          title: "Enrolment Number - Number of students admitted during the year",
          items: [
            { name: `2.1.1(1)-Aproval-${year}`, link: "#" },
            { name: "2.1.1(2)Admitted Students", link: "#" }
          ]
        },
        {
          id: "2.1.2",
          title: "Number of seats filled against seats reserved for various categories (SC, ST, OBC, Divyangjan, etc. as per applicable reservation policy during the year",
          items: [
            { name: "2.1.2(1)-Government Order", link: "#" },
            { name: "2.1.2(2)- List of students admitted from the reserved categories during the year", link: "#" }
          ]
        },
        {
          id: "2.2.1",
          title: "The institution assesses the learning levels of the students and organizes special Programmes for advanced learners and slow learners",
          items: [
            { name: "2.2.1 - The institution assesses the learning levels of the students and organizes special Programmes for advanced learners and slow learners", link: "#" }
          ]
        },
        {
          id: "2.2.2",
          title: "Student- Full time teacher ratio (Data for the latest completed academic year)",
          items: [
            { name: "2.2.2 - Student- Full time teacher ratio", link: "#" }
          ]
        },
        {
          id: "2.3.1",
          title: "Student centric methods, such as experiential learning, participative learning and problem solving methodologies are used for enhancing learning experiences",
          items: [
            { name: "2.3.1 - Student centric methods, such as experiential learning, participative learning and problem solving methodologies are used for enhancing learning experiences", link: "#" }
          ]
        },
        {
          id: "2.3.2",
          title: "Teachers use ICT enabled tools for effective teaching-learning process",
          items: [
            { name: "2.3.2 - Teachers use ICT enabled tools for effective teaching-learning process", link: "#" },
            { name: "2.3.3 - Ratio of students to mentor for academic and other related issues during the year", link: "#" },
            { name: "2.3.3.1 -Faculty Meeting Circular", link: "#" },
            { name: "2.3.3.1(2) - List of full time teachers", link: "#" }
          ]
        },
        {
          id: "2.4.1",
          title: "Number of full time teachers against sanctioned posts during the year",
          items: [
            { name: "2.4.1 - Number of full time teachers against sanctioned posts during the year", link: "#" }
          ]
        },
        {
          id: "2.4.2",
          title: "Number of full time teachers with Ph. D. / D.M. / M.Ch. /D.N.B Superspeciality / D.Sc. / D.Litt. during the year",
          items: [
            { name: "2.4.2.1 - Number of full time teachers with Ph. D. / D.M. / M.Ch. /D.N.C Superspeciality / D.Sc. / D.Litt. during the year", link: "#" }
          ]
        },
        {
          id: "2.4.3",
          title: "Number of years of teaching experience of full time teachers in the same institution",
          items: [
            { name: "2.4.3 - Number of years of teaching experience of full time teachers in the same institution", link: "#" }
          ]
        },
        {
          id: "2.5.1",
          title: "Mechanism of internal assessment is transparent and robust in terms of frequency and mode",
          items: [
            { name: "2.5.1 - Mechanism of internal assessment is transparent and robust in terms of frequency and mode", link: "#" }
          ]
        },
        {
          id: "2.5.2",
          title: "Mechanism to deal with internal examination related grievances is transparent, time- bound and efficient",
          items: [
            { name: "2.5.2 - Mechanism to deal with internal examination related grievances is transparent, time- bound and efficient", link: "#" }
          ]
        },
        {
          id: "2.6.1",
          title: "Programme and course outcomes for all Programmes offered by the institution are stated and displayed on website and communicated to teachers and students",
          items: [
            { name: "2.6.1 - Programme and course outcomes for all Programmes offered by the institution", link: "#" }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "CRITERION - 3",
      name: "Research, Innovations and Extension",
      metrics: [
        {
          id: "3.1.1",
          title: "Grants received from Government and non-governmental agencies for research projects / endowments in the institution during the year",
          items: [
            { name: "3.1.1 - Grants received from Government and non-governmental agencies", link: "#" }
          ]
        },
        {
          id: "3.1.2",
          title: "Number of Ph.D.s registered per eligible teacher during the year",
          items: [
            { name: "3.1.2 - Number of Ph.D.s registered per eligible teacher during the year", link: "#" }
          ]
        },
        {
          id: "3.1.3",
          title: "Number of research papers per teachers in the Journals notified on UGC website during the year",
          items: [
            { name: "3.1.3 - Number of research papers per teachers in the Journals notified on UGC website during the year", link: "#" }
          ]
        },
        {
          id: "3.2.1",
          title: "Number of books and chapters in edited volumes/books published and papers published in national/ international conference proceedings per teacher during the year",
          items: [
            { name: "3.2.1 - Number of books and chapters in edited volumes/books published and papers published", link: "#" }
          ]
        },
        {
          id: "3.3.1",
          title: "Number of extension and outreach Programmes conducted by the institution through NSS/NCC/Red cross/YRC etc., during the year",
          items: [
            { name: "3.3.1 - Number of extension and outreach Programmes conducted by the institution", link: "#" }
          ]
        },
        {
          id: "3.3.2",
          title: "Number of awards and recognitions received for extension activities from government / government recognized bodies during the year",
          items: [
            { name: "3.3.2 - Number of awards and recognitions received for extension activities", link: "#" }
          ]
        },
        {
          id: "3.4.1",
          title: "Number of extension and outreach activities conducted in collaboration with industry, community and Non-Government Organizations during the year",
          items: [
            { name: "3.4.1 - Number of extension and outreach activities conducted in collaboration with industry", link: "#" }
          ]
        }
      ]
    },
    {
      id: 4,
      title: "CRITERION - 4",
      name: "Infrastructure and Learning Resources",
      metrics: [
        {
          id: "4.1.1",
          title: "The Institution has adequate infrastructure and physical facilities for teaching- learning",
          items: [
            { name: "4.1.1 - The Institution has adequate infrastructure and physical facilities for teaching- learning", link: "#" }
          ]
        },
        {
          id: "4.1.2",
          title: "The Institution has adequate facilities for cultural activities, sports, games (indoor, outdoor), gymnasium, yoga centre etc",
          items: [
            { name: "4.1.2 - The Institution has adequate facilities for cultural activities, sports, games", link: "#" }
          ]
        },
        {
          id: "4.1.3",
          title: "Number of classrooms and seminar halls with ICT facilities",
          items: [
            { name: "4.1.3 - Number of classrooms and seminar halls with ICT facilities", link: "#" }
          ]
        },
        {
          id: "4.2.1",
          title: "Library is automated using Integrated Library Management System (ILMS)",
          items: [
            { name: "4.2.1 - Library is automated using Integrated Library Management System (ILMS)", link: "#" }
          ]
        },
        {
          id: "4.3.1",
          title: "Institution frequently updates its IT facilities including Wi-Fi",
          items: [
            { name: "4.3.1 - Institution frequently updates its IT facilities including Wi-Fi", link: "#" }
          ]
        },
        {
          id: "4.4.1",
          title: "Student - Computer ratio (Data for the latest completed academic year)",
          items: [
            { name: "4.4.1 - Student - Computer ratio", link: "#" }
          ]
        }
      ]
    },
    {
      id: 5,
      title: "CRITERION - 5",
      name: "Student Support and Progression",
      metrics: [
        {
          id: "5.1.1",
          title: "Number of students benefited by scholarships and free ships provided by the Institution / Government / Non-Government agencies during the year",
          items: [
            { name: "5.1.1 - Number of students benefited by scholarships and free ships", link: "#" }
          ]
        },
        {
          id: "5.1.2",
          title: "Capacity building and skills enhancement initiatives taken by the institution",
          items: [
            { name: "5.1.2 - Capacity building and skills enhancement initiatives taken by the institution", link: "#" }
          ]
        },
        {
          id: "5.1.3",
          title: "Number of students benefitted by guidance for competitive examinations and career counseling offered by the Institution during the year",
          items: [
            { name: "5.1.3 - Number of students benefitted by guidance for competitive examinations", link: "#" }
          ]
        },
        {
          id: "5.2.1",
          title: "Number of placement of outgoing students and students progressing to higher education during the year",
          items: [
            { name: "5.2.1 - Number of placement of outgoing students and students progressing to higher education", link: "#" }
          ]
        },
        {
          id: "5.2.2",
          title: "Number of students qualifying in state/national/ international level examinations during the year",
          items: [
            { name: "5.2.2 - Number of students qualifying in state/national/ international level examinations", link: "#" }
          ]
        },
        {
          id: "5.3.1",
          title: "Number of awards/medals for outstanding performance in sports/cultural activities at University / state/ national / international level during the year",
          items: [
            { name: "5.3.1 - Number of awards/medals for outstanding performance in sports/cultural activities", link: "#" }
          ]
        },
        {
          id: "5.3.2",
          title: "Institution facilitates students' representation and engagement in various administrative, co-curricular and extracurricular activities",
          items: [
            { name: "5.3.2 - Institution facilitates students' representation and engagement", link: "#" }
          ]
        },
        {
          id: "5.3.3",
          title: "Number of sports and cultural events/competitions in which students of the Institution participated during the year",
          items: [
            { name: "5.3.3.1 - Number of sports and cultural events/competitions in which students of the Institution participated during the year", link: "#" }
          ]
        },
        {
          id: "5.4.1",
          title: "There is a registered Alumni Association that contributes significantly to the development of the institution",
          items: [
            { name: "5.4.1 - There is a registered Alumni Association that contributes significantly to the development of the institution", link: "#" }
          ]
        }
      ]
    },
    {
      id: 6,
      title: "CRITERION - 6",
      name: "Governance, Leadership and Management",
      metrics: [
        {
          id: "6.1.1",
          title: "The governance of the institution is reflective of and in tune with the vision and mission of the institution",
          items: [
            { name: "6.1.1 - The governance of the institution is reflective of and in tune with the vision and mission of the institution", link: "#" }
          ]
        },
        {
          id: "6.1.2",
          title: "The effective leadership is visible in various institutional practices such as decentralization and participative management",
          items: [
            { name: "6.1.2 - The effective leadership is visible in various institutional practices", link: "#" }
          ]
        },
        {
          id: "6.2.1",
          title: "The institutional Strategic/ perspective plan is effectively deployed",
          items: [
            { name: "6.2.1 - The institutional Strategic/ perspective plan is effectively deployed", link: "#" }
          ]
        },
        {
          id: "6.2.2",
          title: "The functioning of the institutional bodies is effective and efficient as visible from policies, administrative setup, appointment and service rules, procedures, etc",
          items: [
            { name: "6.2.2 - The functioning of the institutional bodies is effective and efficient", link: "#" }
          ]
        },
        {
          id: "6.2.3",
          title: "Implementation of e-governance in areas of operation",
          items: [
            { name: "1. Administration", link: "#" },
            { name: "2. Finance and Accounts", link: "#" },
            { name: "3. Student Admission and Support", link: "#" },
            { name: "4. Examination", link: "#" }
          ]
        },
        {
          id: "6.3.1",
          title: "The institution has effective welfare measures for teaching and non- teaching staff",
          items: [
            { name: "6.3.1 - The institution has effective welfare measures for teaching and non- teaching staff", link: "#" }
          ]
        },
        {
          id: "6.3.2",
          title: "Number of teachers provided with financial support to attend conferences/ workshops and towards membership fee of professional bodies during the year",
          items: [
            { name: "6.3.2 - Number of teachers provided with financial support to attend conferences/ workshops", link: "#" }
          ]
        },
        {
          id: "6.3.3",
          title: "Number of professional development /administrative training programs organized by the institution for teaching and non-teaching staff during the year",
          items: [
            { name: "6.3.3 - Number of professional development /administrative training programs organized", link: "#" }
          ]
        },
        {
          id: "6.3.4",
          title: "Number of teachers undergoing online/face-to-face Faculty development Programmes (FDP) during the year",
          items: [
            { name: "6.3.4 - Number of teachers undergoing online/face-to-face Faculty development Programmes", link: "#" }
          ]
        },
        {
          id: "6.3.5",
          title: "Institutions Performance Appraisal System for teaching and non- teaching staff",
          items: [
            { name: "6.3.5 - Institutions Performance Appraisal System for teaching and non- teaching staff", link: "#" }
          ]
        },
        {
          id: "6.4.1",
          title: "Institution conducts internal and external financial audits regularly",
          items: [
            { name: "6.4.1 - Institution conducts internal and external financial audits regularly", link: "#" }
          ]
        },
        {
          id: "6.4.2",
          title: "Funds / Grants received from non-government bodies, individuals, philanthropers during the year",
          items: [
            { name: "6.4.2 - Funds / Grants received from non-government bodies, individuals, philanthropers", link: "#" }
          ]
        },
        {
          id: "6.4.3",
          title: "Institutional strategies for mobilization of funds and the optimal utilization of resources",
          items: [
            { name: "6.4.3 - Institutional strategies for mobilization of funds and the optimal utilization of resources", link: "#" }
          ]
        },
        {
          id: "6.5.1",
          title: "Internal Quality Assurance Cell (IQAC) has contributed significantly for institutionalizing the quality assurance strategies and processes",
          items: [
            { name: "6.5.1 - Internal Quality Assurance Cell (IQAC) has contributed significantly", link: "#" }
          ]
        },
        {
          id: "6.5.2",
          title: "The institution reviews its teaching learning process, structures & methodologies of operations and learning outcomes at periodic intervals through IQAC",
          items: [
            { name: "6.5.2 - The institution reviews its teaching learning process, structures & methodologies", link: "#" }
          ]
        },
        {
          id: "6.5.3",
          title: "Quality assurance initiatives of the institution include",
          items: [
            { name: "1. Regular meeting of Internal Quality Assurance Cell (IQAC); Feedback collected, analyzed and used for improvements", link: "#" },
            { name: "2. Collaborative quality initiatives with other institution(s)", link: "#" },
            { name: "3. Participation in NIRF", link: "#" },
            { name: "4. any other quality audit recognized by state, national or international agencies (ISO Certification, NBA)", link: "#" }
          ]
        }
      ]
    },
    {
      id: 7,
      title: "CRITERION - 7",
      name: "Institutional Values and Best Practices",
      metrics: [
        {
          id: "7.1.1",
          title: "Measures initiated by the Institution for the promotion of gender equity during the year",
          items: [
            { name: "7.1.1 - Measures initiated by the Institution for the promotion of gender equity during the year", link: "#" },
            { name: "7.1.10The Institution Has Disabled-Friendly, Barrier Free Environment", link: "#" }
          ]
        },
        {
          id: "7.1.2",
          title: "The Institution has facilities for alternate sources of energy and energy conservation measures",
          items: [
            { name: "7.1.2 - The Institution has facilities for alternate sources of energy and energy conservation measures", link: "#" },
            { name: "1. Solar energy", link: "#" },
            { name: "2. Biogas plant", link: "#" },
            { name: "3. Wheeling to the Grid", link: "#" },
            { name: "4. Sensor-based energy conservation", link: "#" },
            { name: "5. Use of LED bulbs/ power efficient equipment", link: "#" }
          ]
        },
        {
          id: "7.1.3",
          title: "Describe the facilities in the Institution for the management of the following types of degradable and non-degradable waste",
          items: [
            { name: "7.1.3 - Describe the facilities in the Institution for the management of the following types of degradable and non-degradable waste", link: "#" },
            { name: "1. Solid waste management", link: "#" },
            { name: "2. Liquid waste management", link: "#" },
            { name: "3. Biomedical waste management", link: "#" },
            { name: "4. E-waste management", link: "#" },
            { name: "5. Waste recycling system", link: "#" },
            { name: "6. Hazardous chemicals and radioactive waste management", link: "#" }
          ]
        },
        {
          id: "7.1.4",
          title: "Water conservation facilities available in the Institution",
          items: [
            { name: "7.1.4-Water-conservation-facilities-available-in-the-Institution-1", link: "#" },
            { name: "1. Rain water harvesting", link: "#" },
            { name: "2. Bore well /Open well recharge", link: "#" },
            { name: "3. Construction of tanks and bunds", link: "#" },
            { name: "4. Waste water recycling", link: "#" },
            { name: "5. Maintenance of water bodies and distribution system in the campus", link: "#" }
          ]
        },
        {
          id: "7.1.5",
          title: "Green campus initiatives include",
          items: [
            { name: "7.1.5 green campus initiatives", link: "#" },
            { name: "7.1.5(2) green campus policy", link: "#" },
            { name: "7.1.5.1 - The institutional initiatives for greening the campus are as follows", link: "#" },
            { name: "1. Restricted entry of automobiles", link: "#" },
            { name: "2. Use of bicycles/ Battery-powered vehicles", link: "#" },
            { name: "3. Pedestrian-friendly pathways", link: "#" },
            { name: "4. Ban on use of plastic", link: "#" },
            { name: "5. Landscaping", link: "#" }
          ]
        },
        {
          id: "7.1.6",
          title: "Quality audits on environment and energy are regularly undertaken by the institution",
          items: [
            { name: "7.1.6 - Quality audits on environment and energy are regularly undertaken by the institution", link: "#" }
          ]
        },
        {
          id: "7.1.7",
          title: "The Institution has disabled-friendly, barrier free environment",
          items: [
            { name: "7.1.7 The Institution Has Disabled-Friendly, Barrier Free Environment", link: "#" },
            { name: "7.1.7(2)Policy For Disabled Persons In The College Campus", link: "#" },
            { name: "1. Built environment with ramps/lifts for easy access to classrooms", link: "#" },
            { name: "2. Disabled-friendly washrooms", link: "#" },
            { name: "3. Signage including tactile path, lights, display boards and signposts", link: "#" },
            { name: "4. Assistive technology and facilities for persons with disabilities (Divyangjan) accessible website, screen-reading software, mechanized equipment", link: "#" }
          ]
        },
        {
          id: "7.1.8",
          title: "Describe the Institutional efforts/initiatives in providing an inclusive environment",
          items: [
            { name: "7.1.8 - Describe the Institutional efforts/initiatives in providing an inclusive environment i.e., tolerance and harmony towards cultural, regional, linguistic, communal socioeconomic and other diversities", link: "#" }
          ]
        },
        {
          id: "7.1.9",
          title: "Sensitization of students and employees of the Institution to the constitutional obligations",
          items: [
            { name: "7.1.9 - Sensitization of students and employees of the Institution to the constitutional obligations: values, rights, duties and responsibilities of citizens", link: "#" },
            { name: "7.1.10The Code of Conduct", link: "#" }
          ]
        },
        {
          id: "7.1.11",
          title: "Institution celebrates / organizes national and international commemorative days, events and festivals",
          items: [
            { name: "7.1.11 - Institution celebrates / organizes national and international commemorative days, events and festivals", link: "#" },
            { name: `7.1.11(2)International yoga day,${year.split('-')[0]}`, link: "#" }
          ]
        },
        {
          id: "7.2.1",
          title: "Describe two best practices",
          items: [
            { name: "7.2.1 Describe two best practices", link: "#" }
          ]
        },
        {
          id: "7.3.1",
          title: "Portray the performance of the Institution in one area distinctive to its priority and thrust",
          items: [
            { name: "7.3.1 - Portray the performance of the Institution in one area distinctive to its priority and thrust", link: "#" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <LeaderPageNavbar backHref="/" />
      
      {/* Hero Section */}
      <section className="pb-12 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white" style={{ paddingTop: 'calc(var(--total-header-height, 128px) + 4rem)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              AQAR {year}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Annual Quality Assurance Report - Academic Year {year}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              AQAR Criteria and Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {criteria.map((criterion) => (
                <AccordionItem key={criterion.id} value={`criterion-${criterion.id}`} className="border-b">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">{criterion.id}</span>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{criterion.title}</h3>
                        <p className="text-sm text-muted-foreground">{criterion.name}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {criterion.metrics.map((metric) => (
                        <Card key={metric.id} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-slate-700">
                              {metric.id} - {metric.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {metric.items.map((item, index) => (
                                <li key={index} className="flex items-center gap-2 group">
                                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <a
                                    href={item.link}
                                    className="text-sm text-slate-600 hover:text-primary hover:underline flex items-center gap-2 group-hover:translate-x-1 transition-all"
                                  >
                                    {item.name}
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default AQARPage;

