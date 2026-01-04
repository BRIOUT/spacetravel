// ============================================
// SpacecraftPage.jsx - Individual Spacecraft Detail
// ============================================


import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SpaceTravelApi from "../../services/SpaceTravelApi";
import styles from "./SpacecraftPage.module.css";

// ============================================
// SPACECRAFT PAGE COMPONENT
// ============================================
function SpacecraftPage() {



  const { id } = useParams();


  console.log("Spacecraft ID from URL:", id);

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [spacecraft, setSpacecraft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation hook
  const navigate = useNavigate();

  // ==========================================
  // DATA FETCHING
  // ==========================================


  useEffect(() => {
    async function fetchSpacecraft() {
      try {
        setIsLoading(true);
        setError(null);

        // Call API with the ID from the URL
        const response = await SpaceTravelApi.getSpacecraftById({ id });

        if (response.isError) {
          setError("Failed to load spacecraft details.");
          setSpacecraft(null);
        } else if (!response.data) {
          // The API returned success but no data
          // This means the spacecraft doesn't exist!
          setError("Spacecraft not found.");
          setSpacecraft(null);
        } else {
          // Success! We have the spacecraft
          setSpacecraft(response.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching spacecraft:", err);
        setError("An unexpected error occurred.");
        setSpacecraft(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpacecraft();


  }, [id]);

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  async function handleDestroy() {
    const confirmed = window.confirm(
      `Are you sure you want to destroy ${spacecraft.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await SpaceTravelApi.destroySpacecraftById({ id });

      if (response.isError) {
        alert("Failed to destroy spacecraft.");
        return;
      }

      alert(`${spacecraft.name} has been destroyed.`);

      // After destroying, navigate back to the list
      navigate("/spacecrafts");

    } catch (err) {
      console.error("Error destroying spacecraft:", err);
      alert("An unexpected error occurred.");
    }
  }

  function handleBack() {
    // Navigate back to spacecrafts list
    navigate("/spacecrafts");
  }

  // ==========================================
  // CONDITIONAL RENDERING
  // ==========================================

  // CASE 1: Loading
  if (isLoading) {
    return (
      <div className={styles.spacecraftPage}>
        <div className={styles.spacecraftPage__loading}>
          <div className={styles.spacecraftPage__spinner}></div>
          <p>Loading spacecraft details...</p>
        </div>
      </div>
    );
  }

  // CASE 2: Error or Not Found
  if (error || !spacecraft) {
    return (
      <div className={styles.spacecraftPage}>
        <div className={styles.spacecraftPage__error}>
          <h2>⚠️ {error || "Spacecraft Not Found"}</h2>
          <p>
            {error
              ? "Unable to load spacecraft details. Please try again."
              : `No spacecraft exists with ID: ${id}`
            }
          </p>
          <div className={styles.spacecraftPage__errorButtons}>
            <button
              onClick={handleBack}
              className={styles.spacecraftPage__backButton}
            >
              ← Back to Fleet
            </button>
            <button
              onClick={() => window.location.reload()}
              className={styles.spacecraftPage__retryButton}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER - We have the spacecraft!
  // ==========================================
  return (
    <div className={styles.spacecraftPage}>
      {/* Header with back button */}
      <header className={styles.spacecraftPage__header}>
        <button
          onClick={handleBack}
          className={styles.spacecraftPage__backButton}
        >
          ← Back to Fleet
        </button>

        <Link
          to="/construction"
          className={styles.spacecraftPage__buildButton}
        >
          + Build New Spacecraft
        </Link>
      </header>

      {/* Spacecraft Details Card */}
      <div className={styles.spacecraftPage__card}>
        {/* Title Section */}
        <div className={styles.spacecraftPage__titleSection}>
          <h1 className={styles.spacecraftPage__title}>
            {spacecraft.name}
          </h1>
          <span className={styles.spacecraftPage__id}>
            ID: {spacecraft.id}
          </span>
        </div>

        {/* Image Section */}
        <div className={styles.spacecraftPage__imageSection}>
          {spacecraft.pictureUrl ? (
            <img
              src={spacecraft.pictureUrl}
              alt={spacecraft.name}
              className={styles.spacecraftPage__image}
            />
          ) : (
            <div className={styles.spacecraftPage__imagePlaceholder}>
              <span className={styles.spacecraftPage__placeholderIcon}>
                🚀
              </span>
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className={styles.spacecraftPage__specs}>
          <h2 className={styles.spacecraftPage__specsTitle}>
            Specifications
          </h2>

          <div className={styles.spacecraftPage__specsList}>
            <div className={styles.spacecraftPage__spec}>
              <span className={styles.spacecraftPage__specLabel}>
                Capacity:
              </span>
              <span className={styles.spacecraftPage__specValue}>
                {spacecraft.capacity.toLocaleString()} people
              </span>
            </div>

            <div className={styles.spacecraftPage__spec}>
              <span className={styles.spacecraftPage__specLabel}>
                Current Location:
              </span>
              <span className={styles.spacecraftPage__specValue}>
                Planet ID: {spacecraft.currentLocation}
              </span>
            </div>

            <div className={styles.spacecraftPage__spec}>
              <span className={styles.spacecraftPage__specLabel}>
                Status:
              </span>
              <span className={styles.spacecraftPage__specValue}>
                <span className={styles.spacecraftPage__statusBadge}>
                  OPERATIONAL
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.spacecraftPage__description}>
          <h2 className={styles.spacecraftPage__descriptionTitle}>
            Description
          </h2>
          <p className={styles.spacecraftPage__descriptionText}>
            {spacecraft.description}
          </p>
        </div>

        {/* Actions */}
        <div className={styles.spacecraftPage__actions}>
          <button
            onClick={() => navigate("/planets")}
            className={styles.spacecraftPage__actionButton}
          >
            Send to Planet
          </button>

          <button
            onClick={handleDestroy}
            className={`${styles.spacecraftPage__actionButton} ${styles['spacecraftPage__actionButton--danger']}`}
          >
            Destroy Spacecraft
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpacecraftPage;

