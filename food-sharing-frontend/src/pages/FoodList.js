import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const FoodList = () => {
  const [foodData, setFoodData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const foodCollectionRef = collection(db, "food");

  // Fetch food data from Firebase on component mount
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const data = await getDocs(foodCollectionRef);
        const foodArray = data.docs.map((doc) => {
          const foodItem = doc.data();
          return {
            ...foodItem,
            id: doc.id,
            expiryDate: foodItem.expiryDate?.seconds
              ? new Date(foodItem.expiryDate.seconds * 1000).toLocaleDateString()
              : "N/A",
          };
        });
        setFoodData(foodArray);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFoodData();
  }, []);

  // Filter food items based on the search query
  const filteredFood = foodData.filter((food) =>
    food.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Available Food</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by location"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Food Listings */}
      <ul>
        {filteredFood.length > 0 ? (
          filteredFood.map((food) => (
            <li key={food.id}>
              <h3>{food.title}</h3>
              <p>{food.description}</p>
              <p>Expiry: {food.expiryDate}</p>
              <p>Location: {food.location}</p>
              <p>Price: ${food.price}</p>
            </li>
          ))
        ) : (
          <p>No food available for this location.</p>
        )}
      </ul>
    </div>
  );
};

export default FoodList;
