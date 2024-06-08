// pages/itinerary.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loading from ".//components/loading";

const ItineraryPage = () => {
  const router = useRouter();
  const { location, budget, activity, selectedLocation, startDate, endDate } = router.query;
  const [itinerary, setItinerary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItinerary = async () => {
    if (!selectedLocation || !startDate || !endDate) return;
    setIsLoading(true);
    const itineraryPrompt = `Generate a travel itinerary for ${selectedLocation} from ${startDate} to ${endDate} with a budget of ${budget} per month and including activities like ${activity}. Include local events, restaurants, supermarkets, and some tourist attractions. Format the itinerary as a list with headings for each day.`;

    const itineraryResult = await fetch("/api/generate-itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: itineraryPrompt, selectedLocation, startDate, endDate, budget, activity }),
    });

    const itineraryResponse = await itineraryResult.json();
    setIsLoading(false);
    const itineraryText = itineraryResponse.itinerary;
    
    // Parse the itinerary text into an array of days
    const days = itineraryText.split("**Day").slice(1);
    const parsedItinerary = days.map((day) => {
      const [dayNumber, ...activities] = day.split("\n-");
      const parsedActivities = activities.map((activity) => activity.trim());
      return {
        day: dayNumber.trim(),
        activities: parsedActivities,
      };
    });

    setItinerary(parsedItinerary);
  };

  useEffect(() => {
    fetchItinerary();
  }, [selectedLocation, startDate, endDate, budget, activity]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">
            Itinerary for {selectedLocation}
          </h1>
          <div className="bg-white p-4 rounded shadow">
            {itinerary.map((day, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-bold mb-2">{day.day.replaceAll('**', '')}</h2>
                <ul className="list-disc pl-6">
                  {day.activities.map((activity, activityIndex) => (
                    <li key={activityIndex}>{activity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ItineraryPage;