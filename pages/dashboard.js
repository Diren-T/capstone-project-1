import styled from "styled-components";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import FlightCard from "../components/Card/Index.js";
import { useAtom } from "jotai";
import globalTrips from "@/public/data";
import { globalTrip } from ".";
import { useEffect } from "react";

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: lightgrey;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  margin: 2rem;
  width: 80%;
  max-width: 500px;
`;

const StyledCardContent = styled.div`
  flex: 1;
  padding: 1rem;
  text-align: center;
  font-size: 15px;
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
`;

const SavedCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  margin: 2rem;
  width: 80%;
  max-width: 500px;
`;

const SavedCardContent = styled.div`
  flex: 1;
  padding: 1rem;
  text-align: center;
  font-size: 15px;
  color: #333333;
`;

const DeleteButton = styled.button``;

export default function Dashboard() {
  const [trips, setTrips] = useAtom(globalTrips);
  const [trip, setTrip] = useAtom(globalTrip);
  const [saved, setSaved] = useAtom(globalTrips);

  function handleDelete(savedTrip) {
    const updatedSaved = saved.filter((t) => t.id !== savedTrip.id);
    setSaved(updatedSaved);
    localStorage.removeItem(`trip-${savedTrip.id}`);
  }

  useEffect(() => {
    initializeSavedTrips();
  }, []);

  function initializeSavedTrips() {
    const savedTrips = Object.entries(localStorage)
      .filter(([key]) => key.startsWith("trip-"))
      .map(([key, value]) => JSON.parse(value));
    setSaved(savedTrips);
  }

  function saveTripToLocalStorage(trip) {
    localStorage.setItem(`trip-${trip.id}`, JSON.stringify(trip));
  }

  function handleSaveTrip() {
    if (trip) {
      setTrips([...trips, trip]);
      setTrip({});
      saveTripToLocalStorage(trip);
    }
  }

  return (
    <>
      <StyledCard>
        <StyledCardContent>
          {!trip.id ? (
            <div>nothing to show</div>
          ) : (
            <StyledDiv>
              <p>{trip.from}</p>
              <p>{trip.to}</p>
              <p>CO₂ {trip.co2e} kg</p>
              <StyledButton onClick={handleSaveTrip}>Save Trip</StyledButton>
            </StyledDiv>
          )}
        </StyledCardContent>
      </StyledCard>
      <SavedCard>
        <SavedCardContent>
          {saved &&
            saved.map((trip) => (
              <div key={trip.id}>
                <FlightCard trip={trip} />
                <DeleteButton onClick={() => handleDelete(trip)}>
                  Delete
                </DeleteButton>
              </div>
            ))}
        </SavedCardContent>
      </SavedCard>
      <Navbar />
    </>
  );
}
