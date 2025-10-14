import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
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

export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const q = query(collection(db, "products"), where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

/* ============================
   🔹 CREATE FUNCTIONS
============================ */

export const addCategory = async (name) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), { name, createdAt: new Date() });
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(collection(db, "products"), { ...product, createdAt: new Date() });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

/* ============================
   🔹 UPDATE FUNCTIONS
============================ */

export const updateCategory = async (id, name) => {
  try {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, { name });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/* ============================
   🔹 DELETE FUNCTIONS
============================ */

export const deleteCategory = async (id) => {
  try {
    await deleteDoc(doc(db, "categories", id));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, "products", id));
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
