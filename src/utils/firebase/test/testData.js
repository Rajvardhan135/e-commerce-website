import { addCategory, addProduct } from "../firebaseStoreServices";

export const seedTestData = async () => {
  const categories = ["electronics", "jewelery", "mens", "womens"];

  // Add sample categories
  for (const name of categories) {
    await addCategory(name);
  }

  // Add sample products
  const sampleProducts = [
    // Electronics
    {
      name: "Smartphone",
      price: 799,
      description: "Latest 5G smartphone with amazing camera",
      image: "https://via.placeholder.com/150",
      category: "electronics",
    },
    {
      name: "Bluetooth Speaker",
      price: 49,
      description: "Portable wireless speaker with great sound",
      image: "https://via.placeholder.com/150",
      category: "electronics",
    },

    // Jewelery
    {
      name: "Gold Necklace",
      price: 299,
      description: "Elegant 18k gold necklace for special occasions",
      image: "https://via.placeholder.com/150",
      category: "jewelery",
    },
    {
      name: "Silver Ring",
      price: 99,
      description: "Sterling silver ring with modern design",
      image: "https://via.placeholder.com/150",
      category: "jewelery",
    },

    // Mens
    {
      name: "Leather Jacket",
      price: 199,
      description: "Stylish leather jacket for men",
      image: "https://via.placeholder.com/150",
      category: "mens",
    },
    {
      name: "Formal Shirt",
      price: 59,
      description: "Cotton formal shirt for office wear",
      image: "https://via.placeholder.com/150",
      category: "mens",
    },

    // Womens
    {
      name: "Evening Dress",
      price: 149,
      description: "Elegant evening dress for women",
      image: "https://via.placeholder.com/150",
      category: "womens",
    },
    {
      name: "Handbag",
      price: 89,
      description: "Stylish handbag for daily use",
      image: "https://via.placeholder.com/150",
      category: "womens",
    },
  ];

  // Add products to Firestore
  for (const product of sampleProducts) {
    await addProduct(product);
  }

  console.log("✅ Test data seeded successfully!");
};
