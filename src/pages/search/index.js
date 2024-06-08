// pages/search.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DestinationCard from "../components/destinationCard";
import Loading from "../components/loading";

const SearchPage = () => {
  const router = useRouter();
  const { location, budget, activity, startDate, endDate } = router.query;
  
  const [parsedDestinations, setParsedDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateDaysAndMonths = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    return { days, months };
  };

  const fetchDestinations = async () => {
    if (!location || !startDate || !endDate) return;

    setIsLoading(true);

    const { days, months } = calculateDaysAndMonths(startDate, endDate);

    let textPrompt = `Make a list of top 2 places to travel as a digital nomad from ${location} for ${days} days (${months} months) starting from ${startDate}`;
    if (activity) textPrompt += ` to do ${activity}`;
    if (budget) textPrompt += ` with a budget of ${budget}$ per month`;
    textPrompt +=
      " and explain why. In format 'Location - Description'. Do not use the actual WORD location or description in the text. Use the actual locations";

    const result = await fetch("/api/generate-destinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: textPrompt }),
    });

    const response = await result.json();
    const text = response.text;

    const destinations = [];

    const entries = text.split("\n\n").slice(1);

    for (const entry of entries) {
      const [locationWithNumber, description] = entry.split("-");
      const [, location] = locationWithNumber.split(".");

      let imageUrl = "/img/default.jpeg";

      destinations.push({
        location: location.replaceAll("**", ""),
        description: description.replaceAll("**", ""),
        image: imageUrl,
      });
    }

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