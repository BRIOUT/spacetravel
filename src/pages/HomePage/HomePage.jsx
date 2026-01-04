import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

function HomePage() {
  return (
    <div className={styles.homePage}>
      <header className={styles.homePage__header}>
        <h1 className={styles.homePage__title}>
          🚀 Space Travel Command Center
        </h1>
        <p className={styles.homePage__subtitle}>
          Evacuate Humanity. Explore the Solar System. Secure Our Future.
        </p>
      </header>

      <section className={styles.homePage__story}>
        <p>
          In the not-so-distant future, Earth has become uninhabitable due to
          centuries of environmental degradation. As a commander, you hold the
          fate of humanity in your hands. Using cutting-edge spacecraft, you
          must evacuate Earth's remaining population to newly terraformed
          planets across our solar system.
        </p>
      </section>

      <section className={styles.homePage__features}>
        <h2 className={styles.homePage__featuresTitle}>Mission Capabilities</h2>

        <div className={styles.homePage__featuresList}>
          <div className={styles.homePage__feature}>
            <div className={styles.homePage__featureIcon}>🛸</div>
            <h3>Manage Fleet</h3>
            <p>View all spacecraft, their specifications, and current locations</p>
          </div>

          <div className={styles.homePage__feature}>
            <div className={styles.homePage__featureIcon}>🔧</div>
            <h3>Build & Destroy</h3>
            <p>Construct new spacecraft or decommission old ones as needed</p>
          </div>

          <div className={styles.homePage__feature}>
            <div className={styles.homePage__featureIcon}>🪐</div>
            <h3>Coordinate Transfers</h3>
            <p>Send spacecraft between planets to relocate populations</p>
          </div>
        </div>
      </section>

      <section className={styles.homePage__navigation}>
        <Link to="/spacecrafts" className={styles.homePage__navButton}>
          View Spacecraft Fleet
        </Link>

        <Link to="/planets" className={styles.homePage__navButton}>
          View Planets
        </Link>

        <Link
          to="/construction"
          className={`${styles.homePage__navButton} ${styles['homePage__navButton--primary']}`}
        >
          Build New Spacecraft
        </Link>
      </section>

      <footer className={styles.homePage__footer}>
        <p>Command Center Status: <span className={styles.homePage__status}>ONLINE</span></p>
        <p className={styles.homePage__population}>
          Earth Population Remaining: <strong>100,000</strong>
        </p>
      </footer>
    </div>
  );
}

export default HomePage;