/**
 * Default facility page content for server-side seeding.
 * Mirrors src/lib/facilityContent/* DEFAULT_*_CONTENT (plain JavaScript).
 */

const DEFAULT_NSS_CONTENT = {
  hero: {
    badge: 'Empowering through service',
    title: 'National Service Scheme',
    description:
      "Not Me, But You — Building tomorrow's leaders through community service and social responsibility.",
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About',
    title: 'About NSS',
    paragraphs: [
      'The National Service Scheme (NSS) at our college is a vibrant platform for students to engage in community service and contribute to nation-building. Since its inception, NSS has been instrumental in developing the personality and character of students through voluntary community service.',
      'Our NSS unit works on the principle of "Education through Service" and aims to instill social and civic responsibility among students while providing opportunities for personal growth through community service.',
    ],
  },
  stats: [
    { value: '500+', label: 'Active Volunteers' },
    { value: '50+', label: 'Annual Projects' },
    { value: '1000+', label: 'Hours of Service' },
    { value: '20+', label: 'Community Partners' },
  ],
  objectives: [
    { title: 'Personality Development', icon: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z' },
    { title: 'Social Responsibility', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    { title: 'Leadership Skills', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
    { title: 'Community Service', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
    { title: 'Bridge Building', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
    { title: 'Value Education', icon: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' },
    { title: 'Awareness Programs', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
    { title: 'National Integration', icon: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z' },
  ],
  activities: [
    { title: 'Blood Donation Camps', icon: 'M12,2C11.5,2 11,2.19 10.59,2.59L2.59,10.59C1.8,11.37 1.8,12.63 2.59,13.41L10.59,21.41C11.37,22.2 12.63,22.2 13.41,21.41L21.41,13.41C22.2,12.63 22.2,11.37 21.41,10.59L13.41,2.59C13,2.19 12.5,2 12,2M12,4L20,12L12,20L4,12L12,4Z' },
    { title: 'Tree Plantation', icon: 'M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z' },
    { title: 'Cleanliness Campaigns', icon: 'M21.03,3L18,20.31C17.83,21.27 17,22 16,22H8C7,22 6.17,21.27 6,20.31L2.97,3H21.03M5.36,5L8,20H16L18.64,5H5.36M9,18V14H13V18H15V14L12,10.5L9,14V18H9Z' },
    { title: 'Health Awareness', icon: 'M19.5,3.5L18,2L16.5,3.5L15,2L13.5,3.5L12,2L10.5,3.5L9,2L7.5,3.5L6,2L4.5,3.5L3,2V22L4.5,20.5L6,22L7.5,20.5L9,22L10.5,20.5L12,22L13.5,20.5L15,22L16.5,20.5L18,22L19.5,20.5L21,22V2L19.5,3.5M19,19H5V5H19V19M6,15H18V17H6V15M6,11H18V13H6V11M6,7H18V9H6V7Z' },
    { title: 'Rural Development', icon: 'M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75M12,15C13.5,15 16.5,15.75 16.5,17.25V18H7.5V17.25C7.5,15.75 10.5,15 12,15Z' },
    { title: 'Literacy Programs', icon: 'M12,3L1,9L5,11.18V17.18L12,21L19,17.18V11.18L21,10.09V17H23V9L12,3M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z' },
    { title: 'Disaster Relief', icon: 'M12,2L4,5V11.09C4,16.14 7.41,20.85 12,22C16.59,20.85 20,16.14 20,11.09V5L12,2M18,11.09C18,15.09 15.45,18.79 12,19.92C8.55,18.79 6,15.1 6,11.09V6.39L12,4.14L18,6.39V11.09M9.5,11A1.5,1.5 0 0,1 11,9.5A1.5,1.5 0 0,1 12.5,11A1.5,1.5 0 0,1 11,12.5A1.5,1.5 0 0,1 9.5,11M14.5,11A1.5,1.5 0 0,1 16,9.5A1.5,1.5 0 0,1 17.5,11A1.5,1.5 0 0,1 16,12.5A1.5,1.5 0 0,1 14.5,11M11,14H13V15.5H11V14Z' },
    { title: 'Women Empowerment', icon: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z' },
    { title: 'Environmental Programs', icon: 'M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z' },
    { title: 'Slum Adoption', icon: 'M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z' },
    { title: 'Community Outreach', icon: 'M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,12.5A1.5,1.5 0 0,1 10.5,11A1.5,1.5 0 0,1 12,9.5A1.5,1.5 0 0,1 13.5,11A1.5,1.5 0 0,1 12,12.5M12,7.2C9.9,7.2 8.2,8.9 8.2,11C8.2,14 12,17.5 12,17.5C12,17.5 15.8,14 15.8,11C15.8,8.9 14.1,7.2 12,7.2Z' },
    { title: 'Youth Development', icon: 'M12,8A3,3 0 0,0 9,11A3,3 0 0,0 12,14A3,3 0 0,0 15,11A3,3 0 0,0 12,8M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z' },
  ],
  specialCamp: {
    title: 'Annual Special Camp',
    description:
      "Every year, our NSS volunteers participate in a 7-day residential special camp in adopted villages. This immersive experience allows students to understand rural life, implement community development projects, and make a tangible difference in people's lives.",
    stats: [
      { value: '7 Days', label: 'Residential Camp' },
      { value: '100+', label: 'Volunteers' },
      { value: 'Multiple', label: 'Villages Adopted' },
    ],
  },
  getInvolved: {
    label: 'Get involved',
    title: 'Join Our NSS Family',
    description:
      'Become a part of our vibrant NSS community and make a difference in society while developing your own personality, leadership skills, and social awareness. Join us in our mission to serve the nation.',
    eligibility: [
      'Currently enrolled student of the college',
      'Willing to volunteer 120 hours per year',
      'Passionate about social service',
      'Committed to community development',
    ],
    benefits: [
      'NSS Certificate on completion',
      'Leadership development opportunities',
      'Personal growth and skill enhancement',
      'Preference in placements and higher studies',
    ],
    ctaText: 'Register for NSS',
    ctaHref: 'mailto:admissions@viet.edu.in?subject=NSS Registration',
  },
  contact: {
    columns: [
      {
        title: 'NSS Programme Officer',
        lines: ['Contact via college office'],
        email: 'admissions@viet.edu.in',
      },
      { title: 'Office Hours', lines: ['Monday – Friday', '9:00 AM – 5:00 PM'] },
      { title: 'Location', lines: ['NSS Office, VIET Campus', 'Narava, Visakhapatnam'] },
    ],
  },
};

const DEFAULT_HOSTEL_CONTENT = {
  hero: {
    badge: 'Facilities',
    title: 'Our Hostel',
    description: 'A safe, comfortable, and vibrant living environment for students. Home away from home.',
    heroImage: '',
    video: '',
  },
  intro: {
    label: 'Home Away From Home',
    title: 'Hostel Life',
    description:
      'Our modern hostel facilities provide a safe, comfortable, and vibrant living environment for both boys and girls in separate, well-maintained blocks. Students forge lifelong friendships and create unforgettable memories while pursuing academic excellence in a secure and supportive community.',
    stats: [
      { value: '500+', label: 'Students Accommodated' },
      { value: '24/7', label: 'Security & Support' },
      { value: '2', label: 'Separate Blocks' },
      { value: '3', label: 'Room Configurations' },
    ],
  },
  boysHostel: {
    title: 'Boys Hostel',
    description:
      'State-of-the-art residential facility designed for male students, offering a secure and conducive environment for academic growth and personal development.',
    features: [
      'Male wardens & support staff',
      'Spacious common areas',
      'Study-friendly environment',
      'Sports & fitness facilities',
    ],
  },
  girlsHostel: {
    title: 'Girls Hostel',
    description:
      'Premium accommodation exclusively for female students with enhanced security measures, creating a safe haven for learning and building lasting friendships.',
    features: [
      'Female wardens available 24/7',
      'Enhanced security protocols',
      'Well-lit & monitored premises',
      'Comfortable living spaces',
    ],
  },
  facilities: [
    { title: 'Residential Blocks', icon: 'M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z' },
    { title: 'Dining Hall', icon: 'M8.1,13.34L2,20.34V22H22V20.34L15.9,13.34C15.29,12.73 14.68,12.11 14.13,11.5C13.5,10.78 12.78,10.12 12,9.5C11.22,10.12 10.5,10.78 9.87,11.5C9.32,12.11 8.71,12.73 8.1,13.34M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2Z' },
    { title: 'Recreation Rooms', icon: 'M6,9H8V11H10V9H12V7H10V5H8V7H6V9M15.5,12A1.5,1.5 0 0,1 14,10.5A1.5,1.5 0 0,1 15.5,9A1.5,1.5 0 0,1 17,10.5A1.5,1.5 0 0,1 15.5,12M18.5,9A1.5,1.5 0 0,1 17,7.5A1.5,1.5 0 0,1 18.5,6A1.5,1.5 0 0,1 20,7.5A1.5,1.5 0 0,1 18.5,9M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z' },
    { title: 'Study Rooms', icon: 'M12,3L1,9L5,11.18V17.18L12,21L19,17.18V11.18L21,10.09V17H23V9L12,3M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z' },
    { title: 'Gym & Sports', icon: 'M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z' },
    { title: 'Medical Care', icon: 'M19.5,3.5L18,2L16.5,3.5L15,2L13.5,3.5L12,2L10.5,3.5L9,2L7.5,3.5L6,2L4.5,3.5L3,2V22L4.5,20.5L6,22L7.5,20.5L9,22L10.5,20.5L12,22L13.5,20.5L15,22L16.5,20.5L18,22L19.5,20.5L21,22V2L19.5,3.5M19,19H5V5H19V19M6,15H18V17H6V15M6,11H18V13H6V11M6,7H18V9H6V7Z' },
    { title: 'Laundry Service', icon: 'M16,21H8A1,1 0 0,1 7,20V12.07L5.7,13.37C4.8,14.27 4.3,15.57 4.3,16.97V20A1,1 0 0,1 3,21H1V20A3,3 0 0,1 4,17V12A2,2 0 0,1 6,10H9V8A2,2 0 0,1 11,6H13A2,2 0 0,1 15,8V10H18A2,2 0 0,1 20,12V17A3,3 0 0,1 23,20V21H21A1,1 0 0,1 20,20V16.97C20,15.57 19.5,14.27 18.6,13.37L17,11.77V20A1,1 0 0,1 16,21Z' },
    { title: 'High-Speed WiFi', icon: 'M1,9L3,11C7.97,6.03 16.03,6.03 21,11L23,9C16.93,2.93 7.08,2.93 1,9M9,17L12,20L15,17C13.35,15.34 10.66,15.34 9,17M5,13L7,15C9.76,12.24 14.24,12.24 17,15L19,13C15.14,9.14 8.87,9.14 5,13Z' },
  ],
  rooms: [
    {
      type: 'Single Occupancy',
      capacity: '1 student',
      amenities: 'Attached bathroom, study table, wardrobe, AC',
    },
    {
      type: 'Double Occupancy',
      capacity: '2 students',
      amenities: 'Shared bathroom, study tables, wardrobes, fan',
    },
    {
      type: 'Triple Occupancy',
      capacity: '3 students',
      amenities: 'Common bathroom, study space, storage units',
    },
  ],
  community: {
    label: 'Beyond Academics',
    title: 'A Vibrant Community Experience',
    description:
      "Our hostel is more than just a place to sleep. It's a thriving community where students from diverse backgrounds come together, share experiences, and build networks that last a lifetime.",
    items: [
      'Cultural festivals and celebrations',
      'Sports tournaments and competitions',
      'Study groups and peer learning',
      'Weekend movie nights and events',
      'Student-led clubs and activities',
    ],
  },
  rules: {
    title: 'Hostel Rules & Guidelines',
    rules: [
      { title: 'Curfew Hours', detail: 'Entry restricted after 10:00 PM on weekdays' },
      { title: 'Visitor Policy', detail: 'Guests allowed in common areas with prior permission' },
      { title: 'Mess Timings', detail: 'Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM' },
      { title: 'Cleanliness', detail: 'Maintain room hygiene and common area etiquette' },
    ],
  },
  cta: {
    title: 'Need More Information?',
    description:
      'Our hostel administration team is here to answer all your questions about accommodation, facilities, and hostel life.',
    buttonText: 'Contact Hostel Office',
    buttonHref: '/about',
  },
  contact: {
    columns: [
      {
        title: 'Hostel Warden',
        lines: ['Contact via college office'],
        email: 'admissions@viet.edu.in',
      },
      { title: 'Office Hours', lines: ['Monday – Friday', '9:00 AM – 5:00 PM'] },
      { title: 'Location', lines: ['Hostel Block, VIET Campus', 'Narava, Visakhapatnam'] },
    ],
  },
};

const DEFAULT_LIBRARY_CONTENT = {
  hero: {
    badge: 'Facilities',
    title: 'Our Library',
    description: 'A place of knowledge, inspiration, and academic excellence.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About our library',
    title: 'About Our Library',
    paragraphs: [
      'The college library is the heart of our academic community. Established in 1985, our library has grown to house over 50,000 books, covering all major disciplines including Science, Arts, Commerce, Engineering, and Humanities.',
      'Our library provides a peaceful and conducive environment for learning, research, and intellectual growth. With modern facilities and dedicated staff, we are committed to supporting the academic success of every student.',
    ],
  },
  features: [
    {
      icon: 'book-open',
      title: 'Vast Collection',
      description: '50,000+ books, journals, magazines, and reference materials',
    },
    {
      icon: 'users',
      title: 'Spacious Reading Hall',
      description: 'Seating capacity for 500+ students with comfortable furniture',
    },
    {
      icon: 'wifi',
      title: 'Free Wi-Fi',
      description: 'High-speed internet access for research and online resources',
    },
    {
      icon: 'clock',
      title: 'Extended Hours',
      description: 'Open from 8 AM to 8 PM on weekdays, 9 AM to 5 PM on weekends',
    },
    {
      icon: 'coffee',
      title: 'Refreshment Zone',
      description: 'Cafeteria nearby for snacks and beverages',
    },
    {
      icon: 'map-pin',
      title: 'Central Location',
      description: 'Located in the main academic building, easily accessible',
    },
  ],
  collection: {
    label: 'At a glance',
    title: 'Our Collection',
    stats: [
      { value: '50,000+', label: 'Books' },
      { value: '200+', label: 'Journals' },
      { value: '500+', label: 'Magazines' },
      { value: '1,000+', label: 'E-Books' },
    ],
  },
  timings: [
    { day: 'Monday - Friday', time: '8:00 AM - 8:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 5:00 PM' },
    { day: 'Sunday', time: '10:00 AM - 4:00 PM' },
  ],
  rules: [
    'Maintain silence in the reading area',
    'Valid ID card required for entry',
    'Books can be borrowed for 14 days',
    'No food or drinks inside the library',
    'Handle books with care',
  ],
  librarian: {
    label: 'Library leadership',
    title: 'Meet Our Librarian',
    name: 'College Librarian',
    designation: 'Librarian',
    qualification: '',
    intro: 'Supporting learning, research, and access to knowledge across the institution.',
    image: '',
    message:
      'The library team is committed to helping students and faculty discover, access, and use academic resources effectively in a welcoming learning environment.',
    phone: '',
    email: 'admissions@viet.edu.in',
  },
};

const DEFAULT_LABORATORY_CONTENT = {
  hero: {
    badge: 'Facilities',
    title: 'Our Laboratories',
    description: 'Where theory meets practice — advanced engineering labs.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About our labs',
    title: 'About Our Laboratories',
    paragraph:
      'Our state-of-the-art laboratories form the backbone of practical engineering education. Established with cutting-edge technology and industry-standard equipment, we provide students with hands-on experience across 8+ specialized labs covering all major B.Tech disciplines including Computer Science, Electronics, VLSI Design, Embedded Systems, and Networking. Each lab is supervised by experienced technical staff and lab assistants who guide students through practical sessions, ensuring safety and maximum learning outcomes.',
  },
  labs: [
    {
      id: 'dbms',
      name: 'DBMS Lab',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
      description:
        'Database Management Systems laboratory equipped with SQL Server, MySQL, Oracle, and MongoDB installations. Students gain hands-on experience in database design, normalization, query optimization, and transaction management with industry-standard tools.',
      features: ['50+ Workstations', 'Multiple DBMS Platforms', 'Query Optimization Tools', 'Dedicated Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'simulation',
      name: 'Simulation Lab',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      description:
        'Advanced simulation laboratory featuring MATLAB, Simulink, NS-2/NS-3, and LabVIEW software for modeling and simulating complex systems. Students work on network simulations, signal processing, control systems, and virtual prototyping projects.',
      features: ['High-Performance PCs', 'Licensed Software', 'Virtual Instruments', 'Expert Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'vlsi',
      name: 'VLSI Design Lab',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      description:
        'Cutting-edge VLSI laboratory equipped with Cadence, Xilinx ISE, and Synopsys tools for chip design and verification. Students learn RTL design, FPGA programming, circuit simulation, and physical design using industry-standard EDA tools.',
      features: ['EDA Tool Suite', 'FPGA Development Kits', 'HDL Simulators', 'Technical Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'embedded',
      name: 'Embedded Systems Lab',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      description:
        'Comprehensive embedded systems lab with ARM Cortex, Arduino, Raspberry Pi, and 8051 microcontroller kits. Students develop real-time embedded applications, IoT projects, and firmware programming with hands-on hardware interfacing experience.',
      features: ['Development Boards', 'IoT Kits', 'Debugging Tools', 'Skilled Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'networking',
      name: 'Networking Lab',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      description:
        'Modern networking laboratory with Cisco routers, switches, and network simulation tools. Students configure LAN/WAN networks, implement routing protocols, network security, and troubleshoot real-world networking scenarios using Packet Tracer and GNS3.',
      features: ['Cisco Equipment', 'Network Simulators', 'Security Tools', 'Certified Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'it-workshop',
      name: 'IT Workshop Lab',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop',
      description:
        'Comprehensive IT workshop with software development environments, cloud platforms, and collaborative tools. Students work on full-stack development, DevOps, cloud computing, and agile methodologies with access to AWS, Azure, and Google Cloud platforms.',
      features: ['Cloud Platforms', 'Development Tools', 'Version Control', 'Expert Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
  ],
  resources: {
    label: 'At a glance',
    title: 'Our Lab Resources',
    stats: [
      { value: '8+', label: 'Specialized Labs' },
      { value: '200+', label: 'Lab Equipment' },
      { value: '15+', label: 'Lab Assistants' },
      { value: '300+', label: 'Workstations' },
    ],
  },
};

const DEFAULT_SPORTS_CONTENT = {
  hero: {
    badge: 'Facilities',
    title: 'Sports & Games',
    description:
      'A dedicated indoor sports room, expert PT staff, and a wide range of indoor and outdoor games for fitness and fun.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About',
    title: 'Sports at VIET',
    paragraphs: [
      'Our college encourages students to stay active and build team spirit through a variety of sports and games. We offer volleyball, cricket, kho-kho, badminton, table tennis, chess, carroms, throw ball, and other indoor games.',
      'We have a dedicated indoor sports room for indoor games and expertised Physical Training (PT) staff to guide and train students in sports and fitness.',
    ],
  },
  gallery: [
    { image: '/GALLERY/section2.jpg', title: 'Sports achievements', caption: 'Our teams in action' },
    { image: '/GALLERY/section3.jpg', title: 'Tournaments & events', caption: 'Inter-college competitions' },
    { image: '/GALLERY/bg1.jpg', title: 'Indoor sports', caption: 'Dedicated sports room' },
    { image: '/GALLERY/bg2.jpg', title: 'PT & fitness', caption: 'Expert training and guidance' },
    { image: '/GALLERY/bg3.jpg', title: 'Campus sports', caption: 'Building team spirit' },
  ],
  hallOfFame: [
    {
      name: 'Student Achiever',
      achievement: 'Gold medal at Inter-College Cricket Tournament',
      sport: 'Cricket',
      year: '2024',
    },
    {
      name: 'Team Champions',
      achievement: 'Runners-up at Zonal Volleyball Championship',
      sport: 'Volleyball',
      year: '2024',
    },
    {
      name: 'Individual Excellence',
      achievement: 'Best player award at District Badminton Meet',
      sport: 'Badminton',
      year: '2023',
    },
    {
      name: 'Kho-Kho Squad',
      achievement: 'Winners at State Inter-College Kho-Kho',
      sport: 'Kho-Kho',
      year: '2023',
    },
  ],
  sportsOffered: [
    { name: 'Volleyball', category: 'Outdoor' },
    { name: 'Cricket', category: 'Outdoor' },
    { name: 'Kho-Kho', category: 'Outdoor' },
    { name: 'Badminton', category: 'Indoor' },
    { name: 'Table Tennis', category: 'Indoor' },
    { name: 'Chess', category: 'Indoor' },
    { name: 'Carroms', category: 'Indoor' },
    { name: 'Throw Ball', category: 'Outdoor' },
    { name: 'Other Indoor Games', category: 'Indoor' },
  ],
  facilities: [
    {
      title: 'Dedicated Indoor Sports Room',
      description:
        'A fully equipped indoor sports room for badminton, table tennis, chess, carroms, and other indoor games. Available for practice and inter-college events.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      title: 'Expertised Physical Training (PT)',
      description:
        'Our college has dedicated and experienced PT staff to train students in various sports, conduct fitness sessions, and prepare teams for tournaments.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
  ],
  contact: {
    label: 'Contact',
    title: 'Interested in sports?',
    description:
      'For sports activities, PT sessions, or representing the college in tournaments, get in touch with the sports cell or PT staff at the campus.',
    ctaText: 'Contact sports cell',
    ctaHref: 'mailto:admissions@viet.edu.in?subject=Sports enquiry',
  },
};

const DEFAULT_SCOUTS_CONTENT = {
  hero: {
    badge: 'Facilities',
    title: 'Scouts & Guides',
    description:
      'Building character, confidence, leadership, and a spirit of service through scouting activities at VIET.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About',
    title: 'Scouting at VIET',
    paragraphs: [
      'The Scouts and Guides unit at VIET encourages students to become responsible citizens through discipline, teamwork, outdoor learning, and community service.',
      'Students participate in camps, awareness drives, service programmes, leadership activities, and skill-building events that nurture confidence and social responsibility.',
    ],
  },
  eventsSection: {
    label: 'Events & activities',
    title: 'Scouts in Action',
    description: 'Highlights from camps, service programmes, celebrations, and leadership activities.',
  },
  events: [
    { image: '/GALLERY/section2.jpg', title: 'Community Service', caption: 'Serving society together' },
    { image: '/GALLERY/section3.jpg', title: 'Scouting Camp', caption: 'Learning through outdoor activities' },
    { image: '/GALLERY/bg1.jpg', title: 'Leadership Activities', caption: 'Building confidence and teamwork' },
  ],
  activities: [
    'Community service and awareness drives',
    'Scouting camps and outdoor activities',
    'First-aid and emergency preparedness',
    'Leadership and team-building programmes',
    'Environmental conservation initiatives',
    'National and institutional celebrations',
  ],
  leader: {
    label: 'Leadership',
    title: 'Scouts Leader',
    name: 'Scouts Coordinator',
    designation: 'Scouts & Guides Unit Leader',
    qualification: '',
    intro: 'Guiding students through service, discipline, and leadership.',
    image: '',
    message:
      'Our Scouts and Guides unit provides students with opportunities to develop practical skills, a service mindset, and the confidence to lead with responsibility.',
    phone: '',
    email: 'admissions@viet.edu.in',
  },
};

const DEFAULT_CAFETERIA_CONTENT = {
  hero: {
    badge: 'Facilities',
    title: 'Cafeteria & Canteen',
    description:
      'A hygienic, spacious cafeteria offering a variety of meals, snacks, and beverages at affordable prices for students and staff.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About',
    title: 'Cafeteria at VIET',
    paragraphs: [
      'Our college cafeteria provides a clean, comfortable space for students and staff to enjoy meals and refreshments throughout the day. We focus on hygiene, variety, and affordability so that everyone on campus can eat well without leaving the premises.',
      'The cafeteria is open during college hours and serves breakfast, lunch, and evening snacks. It also doubles as a social space where students can take a break, catch up with friends, and recharge before the next class.',
    ],
  },
  gallery: [
    {
      image: '/GALLERY/section2.jpg',
      title: 'Dining area',
      caption: 'Spacious and comfortable seating',
      large: true,
    },
    { image: '/GALLERY/section3.jpg', title: 'Food counter', caption: 'Variety of meals and snacks' },
    { image: '/GALLERY/bg1.jpg', title: 'Cafeteria space', caption: 'Clean and hygienic environment' },
    { image: '/GALLERY/bg2.jpg', title: 'Refreshments', caption: 'Beverages and light bites' },
    { image: '/GALLERY/bg3.jpg', title: 'Campus dining', caption: 'A place to relax and refuel' },
    {
      image: '/GALLERY/bg4.jpg',
      title: 'Student hub',
      caption: 'Where students gather and connect',
      wide: true,
    },
  ],
  features: [
    {
      title: 'Hygienic kitchen & serving',
      description:
        'Our cafeteria follows strict hygiene standards. Food is prepared in a clean kitchen and served in a well-maintained dining area for the safety and health of our students and staff.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      title: 'Variety of food',
      description:
        'From breakfast to lunch and evening snacks, we offer a range of vegetarian options, rice meals, curries, snacks, and beverages at affordable prices to suit different tastes.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
    {
      title: 'Comfortable seating',
      description:
        'The cafeteria has ample seating so students and staff can enjoy their meals in a relaxed environment. It also serves as a social space for breaks between classes.',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    },
  ],
  contact: {
    label: 'Contact',
    title: 'Visit the cafeteria',
    description:
      'The cafeteria is located on campus and is open during college hours. For any queries regarding food services or timings, please contact the administration or visit the cafeteria in person.',
    ctaText: 'Enquire',
    ctaHref: 'mailto:admissions@viet.edu.in?subject=Cafeteria enquiry',
  },
};

export const FACILITY_SEED_CONTENT = {
  nss: DEFAULT_NSS_CONTENT,
  hostel: DEFAULT_HOSTEL_CONTENT,
  library: DEFAULT_LIBRARY_CONTENT,
  laboratory: DEFAULT_LABORATORY_CONTENT,
  sports: DEFAULT_SPORTS_CONTENT,
  scouts: DEFAULT_SCOUTS_CONTENT,
  cafeteria: DEFAULT_CAFETERIA_CONTENT,
};

export function mergeDedicatedFacilityContent(existing = {}, seed = {}) {
  // Deep merge: existing user edits win, but fill missing/empty sections from seed
  // If existing.objectives is missing or empty array, use seed.objectives
  // Same for activities, about, stats, labs, gallery, etc.
  // Hero: merge fields, existing wins if non-empty
  const out = { ...seed, ...existing };
  out.hero = { ...(seed.hero || {}), ...(existing.hero || {}) };
  const arrayKeys = ['stats','objectives','activities','facilities','rooms','features','gallery','events','hallOfFame','sportsOffered','labs','rules','timings'];
  for (const key of arrayKeys) {
    const ex = existing[key];
    const sd = seed[key];
    if ((!Array.isArray(ex) || ex.length === 0) && Array.isArray(sd) && sd.length > 0) {
      out[key] = sd;
    }
  }
  // nested objects: about, intro, specialCamp, getInvolved, contact, boysHostel, girlsHostel, community, rules, cta, collection, resources
  for (const key of ['about','intro','specialCamp','getInvolved','contact','boysHostel','girlsHostel','community','collection','resources','cta','eventsSection','leader','librarian']) {
    if (seed[key] && typeof seed[key] === 'object') {
      out[key] = { ...seed[key], ...(existing[key] || {}) };
      // if existing nested object has empty paragraphs array, use seed
      if (Array.isArray(seed[key].paragraphs) && (!existing[key]?.paragraphs || existing[key].paragraphs.length === 0)) {
        out[key].paragraphs = seed[key].paragraphs;
      }
    }
  }
  if (seed.contact?.columns && (!existing.contact?.columns || existing.contact.columns.length === 0)) {
    out.contact = { ...out.contact, columns: seed.contact.columns };
  }
  if (Array.isArray(seed.rules) && (!existing.rules || existing.rules.length === 0)) {
    out.rules = seed.rules;
  }
  return out;
}
