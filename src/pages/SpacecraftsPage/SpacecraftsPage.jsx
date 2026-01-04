import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpaceTravelApi from "../../services/SpaceTravelApi";
import styles from "./SpacecraftsPage.module.css";

function SpacecraftsPage() {
  // STATE MANAGEMENT
  const [spacecrafts, setSpacecrafts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // NAVIGATION HOOK
  const navigate = useNavigate();

  // DATA FETCHING WITH useEffect
  useEffect(() => {
    async function fetchSpacecrafts() {
      try {
        setIsLoading(true);
        const response = await SpaceTravelApi.getSpacecrafts();

        if (response.isError) {
          setError("Failed to load spacecraft. Please try again.");
          setSpacecrafts(null);
        } else {
          setSpacecrafts(response.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching spacecrafts:", err);
        setError("An unexpected error occurred.");
        setSpacecrafts(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpacecrafts();
  }, []);

  // EVENT HANDLERS
  async function handleDestroy(id, name) {
    const confirmed = window.confirm(
      `Are you sure you want to destroy ${name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await SpaceTravelApi.destroySpacecraftById({ id });

      if (response.isError) {
        alert("Failed to destroy spacecraft. Please try again.");
        return;
      }

      setSpacecrafts(spacecrafts.filter(spacecraft => spacecraft.id !== id));
      alert(`${name} has been destroyed successfully.`);

    } catch (err) {
      console.error("Error destroying spacecraft:", err);
      alert("An unexpected error occurred.");
    }
  }

  function handleViewDetails(id) {
    navigate(`/spacecraft/${id}`);
  }

// CASE 1: Still loading data
  if (isLoading) {
    return (
      <div className={styles.spacecraftsPage}>
        <div className={styles.spacecraftsPage__loading}>
          <div className={styles.spacecraftsPage__spinner}></div>
          <p>Loading spacecraft fleet...</p>
        </div>
      </div>
    );
  }

  // CASE 2: Error occurred
  if (error) {
    return (
      <div className={styles.spacecraftsPage}>
        <div className={styles.spacecraftsPage__error}>
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.spacecraftsPage__retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // CASE 3: No spacecraft in the fleet
  if (!spacecrafts || spacecrafts.length === 0) {
    return (
      <div className={styles.spacecraftsPage}>
        <header className={styles.spacecraftsPage__header}>
          <h1>Spacecraft Fleet</h1>
          <Link to="/" className={styles.spacecraftsPage__backButton}>
            ← Back to Home
          </Link>
        </header>

        <div className={styles.spacecraftsPage__empty}>
          <h2>No Spacecraft Available</h2>
          <p>The fleet is empty. Build your first spacecraft to begin the evacuation.</p>
          <Link
            to="/construction"
            className={styles.spacecraftsPage__buildButton}
          >
            Build Spacecraft
          </Link>
        </div>
      </div>
    );
  }

  // MAIN RENDER - We have data!
  return (
    <div className={styles.spacecraftsPage}>
      <header className={styles.spacecraftsPage__header}>
        <h1>Spacecraft Fleet</h1>
        <div className={styles.spacecraftsPage__headerButtons}>
          <Link to="/" className={styles.spacecraftsPage__backButton}>
            ← Back to Home
          </Link>
          <Link to="/construction" className={styles.spacecraftsPage__buildButton}>
            + Build New Spacecraft
          </Link>
        </div>
      </header>

      <div className={styles.spacecraftsPage__stats}>
        <div className={styles.spacecraftsPage__stat}>
          <span className={styles.spacecraftsPage__statLabel}>Total Fleet:</span>
          <span className={styles.spacecraftsPage__statValue}>{spacecrafts.length}</span>
        </div>
        <div className={styles.spacecraftsPage__stat}>
          <span className={styles.spacecraftsPage__statLabel}>Total Capacity:</span>
          <span className={styles.spacecraftsPage__statValue}>
            {spacecrafts.reduce((sum, s) => sum + s.capacity, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className={styles.spacecraftsPage__list}>
        {spacecrafts.map((spacecraft) => (
          <div
            key={spacecraft.id}
            className={styles.spacecraftsPage__card}
          >
            <h2 className={styles.spacecraftsPage__cardTitle}>
              {spacecraft.name}
            </h2>

            <div className={styles.spacecraftsPage__cardDetails}>
              <div className={styles.spacecraftsPage__cardDetail}>
                <span className={styles.spacecraftsPage__cardLabel}>Capacity:</span>
                <span className={styles.spacecraftsPage__cardValue}>
                  {spacecraft.capacity.toLocaleString()} people
                </span>
              </div>

              <div className={styles.spacecraftsPage__cardDetail}>
                <span className={styles.spacecraftsPage__cardLabel}>Location:</span>
                <span className={styles.spacecraftsPage__cardValue}>
                  Planet ID: {spacecraft.currentLocation}
                </span>
              </div>
            </div>

            <p className={styles.spacecraftsPage__cardDescription}>
              {spacecraft.description.length > 150
                ? `${spacecraft.description.slice(0, 150)}...`
                : spacecraft.description
              }
            </p>

            <div className={styles.spacecraftsPage__cardButtons}>
              <button
                onClick={() => handleViewDetails(spacecraft.id)}
                className={styles.spacecraftsPage__cardButton}
              >
                View Details
              </button>

              <button
                onClick={() => handleDestroy(spacecraft.id, spacecraft.name)}
                className={`${styles.spacecraftsPage__cardButton} ${styles['spacecraftsPage__cardButton--danger']}`}
              >
                Destroy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpacecraftsPage;