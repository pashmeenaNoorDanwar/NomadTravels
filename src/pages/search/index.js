// pages/search.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DestinationCard from "../components/destinationCard";
import Loading from "../components/loading";
import { calculateDaysAndMonths } from "../../utlis/destinationUtils";

const SearchPage = () => {
  const router = useRouter();
  const { location, budget, activity, startDate, endDate } = router.query;
  
  const [parsedDestinations, setParsedDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDestinations = async () => {
    if (!location || !startDate || !endDate) return;

    setIsLoading(true);

    const { days, months } = calculateDaysAndMonths(startDate, endDate);

    let textPrompt = `Make a list of top 2 places to travel as a digital nomad from ${location} for ${days} days (${months} months) starting from ${startDate}`;
    if (activity) textPrompt += ` to do ${activity}`;
    if (budget) textPrompt += ` with a budget of ${budget}$ per month`;
    textPrompt +=
      " and explain why. Strictly follow the format 'Location - Description' for each destination, where 'Location' is the actual location name and 'Description' is the explanation. Do not include actual english word 'location' or 'description' please.";

    const result = await fetch("/api/generate-destinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: textPrompt }),
    });

    const response = await result.json();
    const destinations = response.destinations;

    setParsedDestinations(destinations);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDestinations();
  }, [location, budget, activity, startDate, endDate]);

  return (
    <div className="flex flex-col gap-4 mt-2.5">
      {isLoading ? (
        <Loading />
      ) : (
        parsedDestinations.map(({ location, description, image }) => (
          <DestinationCard
            key={location}
            location={location}
            description={description}
            image={image}
            pathNameParams={router.query}
          />
        ))
      )}
    </div>
  );
};

export default SearchPage;