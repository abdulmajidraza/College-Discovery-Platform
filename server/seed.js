const mongoose = require('mongoose');
const dotenv = require('dotenv');
const College = require('./models/College');
const User = require('./models/User');

dotenv.config();

const demoColleges = [
  {
    name: "IIT Delhi",
    location: "Delhi",
    category: "Engineering",
    fees: 220000,
    rating: 4.9,
    overview: "A premier public technical university known for engineering, research, entrepreneurship, and strong industry connections.",
    placements: "Excellent placements across product, consulting, analytics, and core engineering roles.",
    averagePackage: 25,
    highestPackage: 82,
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years" },
      { name: "M.Tech Artificial Intelligence", duration: "2 years" },
      { name: "MBA Technology Management", duration: "2 years" },
    ],
    reviews: [
      { userName: "Aarav", rating: 4.9, comment: "Great research culture and very active placement support." },
      { userName: "Meera", rating: 4.8, comment: "Competitive, but the peer group and clubs are worth it." },
    ],
  },
  {
    name: "IIT Bombay",
    location: "Mumbai",
    category: "Engineering",
    fees: 230000,
    rating: 4.8,
    overview: "A top-ranked institute with a strong startup ecosystem, global alumni network, and interdisciplinary programs.",
    placements: "Outstanding placements with high demand from software, finance, and research teams.",
    averagePackage: 27,
    highestPackage: 90,
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    courses: [
      { name: "B.Tech Electrical Engineering", duration: "4 years" },
      { name: "B.Tech Computer Science", duration: "4 years" },
      { name: "M.Des", duration: "2 years" },
    ],
    reviews: [
      { userName: "Kabir", rating: 4.8, comment: "Amazing campus life and access to startup opportunities." },
    ],
  },
  {
    name: "NIT Trichy",
    location: "Tamil Nadu",
    category: "Engineering",
    fees: 150000,
    rating: 4.6,
    overview: "One of India's strongest NITs, known for disciplined academics, technical clubs, and consistent placements.",
    placements: "Strong placements in software, analytics, and core engineering companies.",
    averagePackage: 16,
    highestPackage: 52,
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
    courses: [
      { name: "B.Tech Mechanical Engineering", duration: "4 years" },
      { name: "B.Tech Computer Science", duration: "4 years" },
      { name: "MCA", duration: "3 years" },
    ],
    reviews: [
      { userName: "Sneha", rating: 4.6, comment: "The placement cell is organized and seniors are helpful." },
    ],
  },
  {
    name: "BITS Pilani",
    location: "Rajasthan",
    category: "Engineering",
    fees: 260000,
    rating: 4.7,
    overview: "A private institute with flexible academics, strong alumni, and a respected practice school model.",
    placements: "Excellent placements with strong internship conversion opportunities.",
    averagePackage: 22,
    highestPackage: 60,
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    courses: [
      { name: "B.E. Computer Science", duration: "4 years" },
      { name: "B.E. Electronics", duration: "4 years" },
      { name: "M.Sc. Economics", duration: "2 years" },
    ],
    reviews: [
      { userName: "Ishaan", rating: 4.7, comment: "Flexible curriculum and strong internship culture." },
    ],
  },
  {
    name: "IIIT Hyderabad",
    location: "Hyderabad",
    category: "Engineering",
    fees: 320000,
    rating: 4.8,
    overview: "A research-led institute famous for computer science, AI, language technology, and coding culture.",
    placements: "Top-tier placements in product engineering, AI, and research roles.",
    averagePackage: 30,
    highestPackage: 74,
    imageUrl: "https://images.unsplash.com/photo-1607013407627-6ee814329547?auto=format&fit=crop&w=1200&q=80",
    courses: [
      { name: "B.Tech CSE", duration: "4 years" },
      { name: "B.Tech ECE", duration: "4 years" },
      { name: "MS by Research", duration: "2 years" },
    ],
    reviews: [
      { userName: "Nisha", rating: 4.9, comment: "Best place if you like research and serious coding." },
    ],
  },
  {
    name: "VIT Vellore",
    location: "Tamil Nadu",
    category: "Engineering",
    fees: 198000,
    rating: 4.3,
    overview: "A large private university with many engineering programs, active events, and broad recruiter coverage.",
    placements: "Good placements with many service, product, and mass hiring companies.",
    averagePackage: 9,
    highestPackage: 45,
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1200&q=80",
    courses: [
      { name: "B.Tech IT", duration: "4 years" },
      { name: "B.Tech Data Science", duration: "4 years" },
      { name: "MBA", duration: "2 years" },
    ],
    reviews: [
      { userName: "Rahul", rating: 4.2, comment: "Lots of opportunities if you stay proactive." },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_discovery');
    console.log('Connected to MongoDB for seeding...');

    await College.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing colleges and users.');

    const createdColleges = await College.insertMany(demoColleges);
    console.log(`Successfully seeded ${createdColleges.length} colleges.`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
