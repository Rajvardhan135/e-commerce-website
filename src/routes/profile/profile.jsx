import React, { useState, useEffect } from "react";
import { auth, db, onAuthStateChangedListener } from "../../utils/firebase/firebase.utils";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import "./profile.styles.css";
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Listen to auth state
  useEffect(() => {
    // seedTestData();
    const unsubscribe = onAuthStateChangedListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
      } else {
        setUser(null);
        setProfile({ displayName: "", email: "", photoURL: "" });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch Firestore user profile
  const fetchUserProfile = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          displayName: data.displayName || "",
          email: data.email || "",
          photoURL: data.photoURL || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  if (!user) return;
  setSaving(true);
  try {
    // Update Firestore
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      displayName: profile.displayName,
      photoURL: profile.photoURL,
    });

    // Update Firebase Auth profile (modular SDK way)
    await updateProfile(user, {
      displayName: profile.displayName,
      photoURL: profile.photoURL,
    });

    alert("Profile updated successfully!");
    setEditing(false);
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Error updating profile.");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <div className="loader">Loading profile...</div>;
  if (!user)
    return (
      <div className="loader">
        Please sign in to view your profile.
      </div>
    );

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-card">
        <label>Profile Photo URL:</label>
        <input
          type="text"
          name="photoURL"
          value={profile.photoURL}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Display Name:</label>
        <input
          type="text"
          name="displayName"
          value={profile.displayName}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Email:</label>
        <input type="email" value={profile.email} disabled />

        <div className="profile-buttons">
          {!editing ? (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
