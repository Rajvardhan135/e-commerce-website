import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase.utils";

/* ============================
   🔹 FETCH FUNCTIONS
============================ */

export const getAllCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getProducts = async (category) => {
  try {
    const q = query(collection(db, "products"), where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

export const getOneProductPerCategory = async () => {
  try {
    const categories = await getAllCategories();
    const products = [];
    for (const category of categories) {
      const q = query(collection(db, "products"), where("category", "==", category.name));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        products.push({ id: doc.id, ...doc.data() });
      }
    }
    return products;
  } catch (error) {
    console.error("Error fetching one product per category:", error);
    return [];
  }
};

/* ============================
   🔹 ADMIN: ADD FUNCTIONS
============================ */

export const addCategory = async (categoryName) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      name: categoryName,
      createdAt: new Date(),
    });
    console.log("✅ Category added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: new Date(),
    });
    console.log("✅ Product added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

/* ============================
   🔹 ORDER HISTORY FUNCTIONS
============================ */

export const fetchUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, "orders"),
      where("user.uid", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const addOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: new Date(),
    });
    console.log("✅ Order added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};
