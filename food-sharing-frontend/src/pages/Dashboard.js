import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firebase database instance
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

const Dashboard = () => {
  const [foodData, setFoodData] = useState([]); // State for storing food items
  const [searchQuery, setSearchQuery] = useState(""); // State for search bar
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expiryDate: "",
    location: "",
    price: "",
  });

  // ✅ Fetch food data from Firebase on component mount
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "food")); // Get food collection from Firebase
        const foodList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            expiryDate: data.expiryDate
              ? new Date(data.expiryDate.seconds * 1000).toLocaleDateString()
              : "No Expiry",
          };
        });
        setFoodData(foodList);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFood();
  }, []);

  // ✅ Handle input change for form fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle food posting
  const handlePostFood = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "food"), {
        ...formData,
        expiryDate: Timestamp.fromDate(new Date(formData.expiryDate)), // Convert expiry date to Firestore timestamp
        price: parseFloat(formData.price), // Ensure price is stored as a number
      });
      alert("Food posted successfully!");
      setFormData({
        title: "",
        description: "",
        expiryDate: "",
        location: "",
        price: "",
      }); // Reset form after submission
    } catch (error) {
      console.error("Error posting food:", error);
    }
  };

  // ✅ Filter food items based on search query
  const filteredFood = foodData.filter((food) =>
    food.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Dashboard</h2>

      {/* ✅ Food Posting Form */}
      <form
        onSubmit={handlePostFood}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h3 className="text-xl font-semibold mb-4">Post Food</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="p-2 border rounded-lg"
            required
          />
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            className="p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            className="p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Post Food
        </button>
      </form>

      {/* ✅ Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* ✅ Food List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFood.length > 0 ? (
          filteredFood.map((food) => (
            <div
              key={food.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{food.title}</h3>
              <p className="text-gray-600 mb-2">{food.description}</p>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-medium">Expiry:</span> {food.expiryDate}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-medium">Location:</span> {food.location}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Price:</span> ${food.price}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No food found for this location.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;