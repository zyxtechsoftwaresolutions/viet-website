import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, 'data');

// Departments data based on ProgramsSection
const departments = [
  // Diploma Programs
  { id: 1, name: 'Agriculture Engineering', stream: 'DIPLOMA', level: 'Diploma', image: '/assets/civil-department.svg', createdAt: new Date().toISOString() },
  { id: 2, name: 'Civil Engineering', stream: 'DIPLOMA', level: 'Diploma', image: '/assets/civil-department.svg', createdAt: new Date().toISOString() },
  { id: 3, name: 'Computer Science Engineering', stream: 'DIPLOMA', level: 'Diploma', image: '/assets/cse-department.jpg', createdAt: new Date().toISOString() },
  { id: 4, name: 'ECE', stream: 'DIPLOMA', level: 'Diploma', image: '/assets/ece-department.svg', createdAt: new Date().toISOString() },
  { id: 5, name: 'EEE', stream: 'DIPLOMA', level: 'Diploma', image: '/assets/eee-department.svg', createdAt: new Date().toISOString() },
  { id: 6, name: 'Mechanical Engineering', stream: 'DIPLOMA', level: 'Diploma', image: '/assets/mechanical-department.jpg', createdAt: new Date().toISOString() },
  
  // Engineering UG Programs
  { id: 7, name: 'Automobile Engineering (AME)', stream: 'ENGINEERING', level: 'UG', image: '/assets/mechanical-department.jpg', createdAt: new Date().toISOString() },
  { id: 8, name: 'Basic Science and Humanities (BS&H)', stream: 'ENGINEERING', level: 'UG', image: '/assets/management-department.jpg', createdAt: new Date().toISOString() },
  { id: 9, name: 'Civil Engineering (CIV)', stream: 'ENGINEERING', level: 'UG', image: '/assets/civil-department.svg', createdAt: new Date().toISOString() },
  { id: 10, name: 'Computer Science and Engineering (CSE)', stream: 'ENGINEERING', level: 'UG', image: '/assets/cse-department.jpg', createdAt: new Date().toISOString() },
  { id: 11, name: 'CSE DataScience (CSD)', stream: 'ENGINEERING', level: 'UG', image: '/assets/cse-department.jpg', createdAt: new Date().toISOString() },
  { id: 12, name: 'CSE CyberSecurity (CSC)', stream: 'ENGINEERING', level: 'UG', image: '/assets/cse-department.jpg', createdAt: new Date().toISOString() },
  { id: 13, name: 'CSE MachineLearning (CSM)', stream: 'ENGINEERING', level: 'UG', image: '/assets/cse-department.jpg', createdAt: new Date().toISOString() },
  { id: 14, name: 'Electronics and Communication Engineering (ECE)', stream: 'ENGINEERING', level: 'UG', image: '/assets/ece-department.svg', createdAt: new Date().toISOString() },
  { id: 15, name: 'Electrical and Electronics Engineering (EEE)', stream: 'ENGINEERING', level: 'UG', image: '/assets/eee-department.svg', createdAt: new Date().toISOString() },
  { id: 16, name: 'Mechanical Engineering (Mech)', stream: 'ENGINEERING', level: 'UG', image: '/assets/mechanical-department.jpg', createdAt: new Date().toISOString() },
  
  // Engineering PG Programs
  { id: 17, name: 'CAD/CAM', stream: 'ENGINEERING', level: 'PG', image: '/assets/mechanical-department.jpg', createdAt: new Date().toISOString() },
  { id: 18, name: 'Computer Science and Engineering (CSE)', stream: 'ENGINEERING', level: 'PG', image: '/assets/cse-department.jpg', createdAt: new Date().toISOString() },
  { id: 19, name: 'Power Systems', stream: 'ENGINEERING', level: 'PG', image: '/assets/eee-department.svg', createdAt: new Date().toISOString() },
  { id: 20, name: 'Structural Engineering', stream: 'ENGINEERING', level: 'PG', image: '/assets/civil-department.svg', createdAt: new Date().toISOString() },
  { id: 21, name: 'Thermal Engineering', stream: 'ENGINEERING', level: 'PG', image: '/assets/mechanical-department.jpg', createdAt: new Date().toISOString() },
  { id: 22, name: 'VLSI and Embedded Systems', stream: 'ENGINEERING', level: 'PG', image: '/assets/ece-department.svg', createdAt: new Date().toISOString() },
  
  // Management UG Programs
  { id: 23, name: 'BBA', stream: 'MANAGEMENT', level: 'UG', image: '/assets/management-department.jpg', createdAt: new Date().toISOString() },
  { id: 24, name: 'BCA', stream: 'MANAGEMENT', level: 'UG', image: '/assets/cse-department.jpg', createdAt: new Date().toISOString() },
  
  // Management PG Programs
  { id: 25, name: 'MBA', stream: 'MANAGEMENT', level: 'PG', image: '/assets/management-department.jpg', createdAt: new Date().toISOString() },
  { id: 26, name: 'MCA', stream: 'MANAGEMENT', level: 'PG', image: '/assets/cse-department.jpg', createdAt: new Date().toISOString() },
];

// Carousel images
const carouselImages = [
  { id: 1, src: '/assets/carousel-1.jpg', title: 'WELCOME TO VIET', subtitle: 'Your Gateway to Excellence', createdAt: new Date().toISOString() },
  { id: 2, src: '/assets/carousel-2.jpg', title: '', subtitle: '', createdAt: new Date().toISOString() },
  { id: 3, src: '/assets/carousel-3.jpg', title: '', subtitle: '', createdAt: new Date().toISOString() },
  { id: 4, src: '/assets/carousel-4.jpg', title: '', subtitle: '', createdAt: new Date().toISOString() },
  { id: 5, src: '/assets/carousel-5.jpg', title: '', subtitle: '', createdAt: new Date().toISOString() },
  { id: 6, src: '/assets/carousel-6.jpg', title: '', subtitle: '', createdAt: new Date().toISOString() },
];

async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Seed Departments
    const departmentsPath = join(DATA_DIR, 'departments.json');
    const existingDepts = JSON.parse(await fs.readFile(departmentsPath, 'utf-8'));
    
    // Only add departments that don't already exist
    const existingDeptNames = new Set(existingDepts.departments.map(d => d.name));
    const newDepartments = departments.filter(d => !existingDeptNames.has(d.name));
    
    if (newDepartments.length > 0) {
      existingDepts.departments.push(...newDepartments);
      await fs.writeFile(departmentsPath, JSON.stringify(existingDepts, null, 2));
      console.log(`✓ Added ${newDepartments.length} departments`);
    } else {
      console.log('✓ All departments already exist');
    }

    // Seed Carousel
    const carouselPath = join(DATA_DIR, 'carousel.json');
    const existingCarousel = JSON.parse(await fs.readFile(carouselPath, 'utf-8'));
    
    // Only add carousel images that don't already exist
    const existingCarouselSrcs = new Set(existingCarousel.images.map(img => img.src));
    const newCarouselImages = carouselImages.filter(img => !existingCarouselSrcs.has(img.src));
    
    if (newCarouselImages.length > 0) {
      existingCarousel.images.push(...newCarouselImages);
      await fs.writeFile(carouselPath, JSON.stringify(existingCarousel, null, 2));
      console.log(`✓ Added ${newCarouselImages.length} carousel images`);
    } else {
      console.log('✓ All carousel images already exist');
    }

    console.log('\n✅ Data seeding completed successfully!');
    console.log(`Total Departments: ${existingDepts.departments.length}`);
    console.log(`Total Carousel Images: ${existingCarousel.images.length}`);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();





