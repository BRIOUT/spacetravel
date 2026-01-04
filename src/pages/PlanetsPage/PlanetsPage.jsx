// ============================================
// PlanetsPage.jsx - Planets & Spacecraft Management
// ============================================


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SpaceTravelApi from "../../services/SpaceTravelApi";
import styles from "./PlanetsPage.module.css";

// ============================================
// PLANETS PAGE COMPONENT
// ============================================
function PlanetsPage() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================


  const [planets, setPlanets] = useState(null);
  const [spacecrafts, setSpacecrafts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transfer form state
  const [selectedSpacecraftId, setSelectedSpacecraftId] = useState("");
  const [selectedPlanetId, setSelectedPlanetId] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // ==========================================
  // DATA FETCHING - Multiple API Calls
  // ==========================================


  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const [planetsResponse, spacecraftsResponse] = await Promise.all([
          SpaceTravelApi.getPlanets(),
          SpaceTravelApi.getSpacecrafts()
        ]);

        // Check for errors
        if (planetsResponse.isError || spacecraftsResponse.isError) {
          setError("Failed to load data. Please try again.");
          return;
        }

        // Success! Set both pieces of data
        setPlanets(planetsResponse.data);
        setSpacecrafts(spacecraftsResponse.data);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  /**
   * Get all spacecraft at a specific planet
   * @param {number} planetId - The planet's ID
   * @returns {Array} - Spacecraft at that planet
   */
  function getSpacecraftsAtPlanet(planetId) {
    if (!spacecrafts) return [];

    // Filter spacecraft array to find ones at this planet
    return spacecrafts.filter(
      spacecraft => spacecraft.currentLocation === planetId
    );
  }

  /**
   * Find a planet by its ID
   * @param {number} planetId
   * @returns {Object|undefined}
   */
  function getPlanetById(planetId) {
    if (!planets) return undefined;
    return planets.find(planet => planet.id === planetId);
  }

  /**
   * Find a spacecraft by its ID
   * @param {string} spacecraftId
   * @returns {Object|undefined}
   */
  function getSpacecraftById(spacecraftId) {
    if (!spacecrafts) return undefined;
    return spacecrafts.find(s => s.id === spacecraftId);
  }

  // ==========================================
  // TRANSFER HANDLER - Complex Business Logic
  // ==========================================
  async function handleTransfer(e) {
    e.preventDefault();

    // Validation: Must select both spacecraft and planet
    if (!selectedSpacecraftId) {
      alert("Please select a spacecraft");
      return;
    }

    if (!selectedPlanetId) {
      alert("Please select a destination planet");
      return;
    }

    const spacecraft = getSpacecraftById(selectedSpacecraftId);
    const targetPlanet = getPlanetById(Number(selectedPlanetId));

    if (!spacecraft || !targetPlanet) {
      alert("Invalid selection");
      return;
    }

    // Business Rule: Can't send to same planet
    if (spacecraft.currentLocation === targetPlanet.id) {
      alert(`${spacecraft.name} is already on ${targetPlanet.name}!`);
      return;
    }

    // Confirm the transfer
    const confirmed = window.confirm(
      `Send ${spacecraft.name} to ${targetPlanet.name}?`
    );

    if (!confirmed) return;

    try {
      setIsTransferring(true);

      // Call API to perform the transfer
      const response = await SpaceTravelApi.sendSpacecraftToPlanet({
        spacecraftId: selectedSpacecraftId,
        targetPlanetId: Number(selectedPlanetId)
      });

      if (response.isError) {
        alert(response.data.message || "Transfer failed");
        setIsTransferring(false);
        return;
      }


      const [planetsResponse, spacecraftsResponse] = await Promise.all([
        SpaceTravelApi.getPlanets(),
        SpaceTravelApi.getSpacecrafts()
      ]);

      setPlanets(planetsResponse.data);
      setSpacecrafts(spacecraftsResponse.data);

      // Clear the form
      setSelectedSpacecraftId("");
      setSelectedPlanetId("");

      alert("Transfer successful!");

    } catch (err) {
      console.error("Transfer error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsTransferring(false);
    }
  }

  // ==========================================
  // CONDITIONAL RENDERING
  // ==========================================

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.planetsPage}>
        <div className={styles.planetsPage__loading}>
          <div className={styles.planetsPage__spinner}></div>
          <p>Loading solar system...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.planetsPage}>
        <div className={styles.planetsPage__error}>
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.planetsPage__retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className={styles.planetsPage}>
      {/* Header */}
      <header className={styles.planetsPage__header}>
        <h1 className={styles.planetsPage__title}>Solar System</h1>
        <Link to="/" className={styles.planetsPage__backButton}>
          ← Back to Home
        </Link>
      </header>

      {/* Transfer Form */}
      <section className={styles.planetsPage__transferSection}>
        <h2 className={styles.planetsPage__sectionTitle}>
          Transfer Spacecraft
        </h2>

        <form
          onSubmit={handleTransfer}
          className={styles.planetsPage__transferForm}
        >
          {/*

          */}
          <div className={styles.planetsPage__formField}>
            <label
              htmlFor="spacecraft"
              className={styles.planetsPage__label}
            >
              Select Spacecraft:
            </label>
            <select
              id="spacecraft"
              value={selectedSpacecraftId}
              onChange={(e) => setSelectedSpacecraftId(e.target.value)}
              className={styles.planetsPage__select}
              disabled={isTransferring}
            >
              <option value="">-- Choose Spacecraft --</option>
              {spacecrafts && spacecrafts.map(spacecraft => {
                const currentPlanet = getPlanetById(spacecraft.currentLocation);
                return (
                  <option key={spacecraft.id} value={spacecraft.id}>
                    {spacecraft.name} (on {currentPlanet?.name})
                  </option>
                );
              })}
            </select>
          </div>

          <div className={styles.planetsPage__formField}>
            <label
              htmlFor="planet"
              className={styles.planetsPage__label}
            >
              Destination Planet:
            </label>
            <select
              id="planet"
              value={selectedPlanetId}
              onChange={(e) => setSelectedPlanetId(e.target.value)}
              className={styles.planetsPage__select}
              disabled={isTransferring}
            >
              <option value="">-- Choose Planet --</option>
              {planets && planets.map(planet => (
                <option key={planet.id} value={planet.id}>
                  {planet.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isTransferring || !selectedSpacecraftId || !selectedPlanetId}
            className={styles.planetsPage__submitButton}
          >
            {isTransferring ? "Transferring..." : "Send Spacecraft"}
          </button>
        </form>
      </section>

      {/* Planets List */}
      <section className={styles.planetsPage__planetsSection}>
        <h2 className={styles.planetsPage__sectionTitle}>
          Planets
        </h2>

        <div className={styles.planetsPage__planetsList}>
          {planets && planets.map(planet => {
            const planetSpacecrafts = getSpacecraftsAtPlanet(planet.id);

            return (
              <div
                key={planet.id}
                className={styles.planetsPage__planetCard}
              >
                {/* Planet Image */}
                <div className={styles.planetsPage__planetImageSection}>
                  <img
                    src={planet.pictureUrl}
                    alt={planet.name}
                    className={styles.planetsPage__planetImage}
                  />
                </div>

                {/* Planet Info */}
                <div className={styles.planetsPage__planetInfo}>
                  <h3 className={styles.planetsPage__planetName}>
                    {planet.name}
                  </h3>

                  <div className={styles.planetsPage__planetStat}>
                    <span className={styles.planetsPage__statLabel}>
                      Population:
                    </span>
                    <span className={styles.planetsPage__statValue}>
                      {planet.currentPopulation.toLocaleString()}
                    </span>
                  </div>

                  <div className={styles.planetsPage__planetStat}>
                    <span className={styles.planetsPage__statLabel}>
                      Stationed Spacecraft:
                    </span>
                    <span className={styles.planetsPage__statValue}>
                      {planetSpacecrafts.length}
                    </span>
                  </div>

                  {/* List spacecraft at this planet */}
                  {planetSpacecrafts.length > 0 && (
                    <div className={styles.planetsPage__spacecraftsList}>
                      <h4 className={styles.planetsPage__spacecraftsTitle}>
                        Spacecraft:
                      </h4>
                      <ul className={styles.planetsPage__spacecraftsItems}>
                        {planetSpacecrafts.map(spacecraft => (
                          <li key={spacecraft.id}>
                            {spacecraft.name} ({spacecraft.capacity.toLocaleString()} capacity)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default PlanetsPage;

