require("dotenv").config();
const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");
const Menu = require("./models/Menu");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/food_ordering";

const sampleRestaurants = [
  {
    name: "Spice Villa",
    address: "123 Curry St, Food City",
    phone: "1234567890",
    cuisine: "Indian",
    email: "info@spicevilla.com",
    openingHours: "10:00 AM - 11:00 PM",
    rating: 4.5,
    image: "/images/Banner of Spice Villa.png"
  },
  {
    name: "Burger Hub",
    address: "456 Patty Ln, Burger Town",
    phone: "0987654321",
    cuisine: "American",
    email: "contact@burgerhub.com",
    openingHours: "11:00 AM - 10:00 PM",
    rating: 4.2,
    image: "/images/buger hub.jpg"
  },
  {
    name: "Pasta Palace",
    address: "789 Noodle Rd, Pasta Ville",
    phone: "1122334455",
    cuisine: "Italian",
    email: "hello@pastapalace.com",
    openingHours: "12:00 PM - 10:00 PM",
    rating: 4.7,
    image: "/images/Pastapalace.avif"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    // Insert Restaurants
    const createdRestaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log("Sample restaurants added!");

    // Insert Menu Items
    const menuItems = [
      {
        name: "Chicken Biryani",
        price: 250,
        description: "Aromatic basmati rice cooked with tender chicken and spices.",
        image: "/images/Chicken-Briyani.jpg",
        restaurantId: createdRestaurants[0]._id,
        category: "Biryani"
      },
      {
        name: "Classic Cheeseburger",
        price: 150,
        description: "Juicy beef patty with melted cheese and fresh veggies.",
        image: "/images/Classic Cheeseburger.avif",
        restaurantId: createdRestaurants[1]._id,
        category: "Burgers"
      },
      {
        name: "Margherita Pizza",
        price: 300,
        description: "Classic pizza with tomato sauce, mozzarella, and basil.",
        image: "/images/Margherita Pizza.avif",
        restaurantId: createdRestaurants[2]._id,
        category: "Pizzas"
      },
      {
        name: "Fettuccine Alfredo",
        price: 280,
        description: "Rich and creamy pasta with parmesan cheese.",
        image: "/images/Fettuccine Alfredo.avif",
        restaurantId: createdRestaurants[2]._id,
        category: "Pasta"
      }
    ];

    await Menu.insertMany(menuItems);
    console.log("Sample menu items added!");

    console.log("Database seeded successfully! 🌱");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
