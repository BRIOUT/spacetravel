

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SpaceTravelApi from "../../services/SpaceTravelApi";
import styles from "./ConstructionPage.module.css";

// ============================================
// CONSTRUCTION PAGE COMPONENT
// ============================================
function ConstructionPage() {
  // ==========================================
  // FORM STATE MANAGEMENT
  // ==========================================


  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Navigation hook
  const navigate = useNavigate();

  // ==========================================
  // FORM VALIDATION
  // ==========================================


  function validateForm() {
    const newErrors = {};

    // Name is required
    if (!name.trim()) {
      newErrors.name = "Spacecraft name is required";
    }

    // Capacity is required and must be a positive number
    if (!capacity) {
      newErrors.capacity = "Capacity is required";
    } else if (isNaN(capacity) || Number(capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number";
    }

    // Description is required
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    // Picture URL is optional, but if provided, should look like a URL
    if (pictureUrl.trim() && !pictureUrl.startsWith("http")) {
      newErrors.pictureUrl = "Picture URL must start with http:// or https://";
    }

    return newErrors;
  }

  // ==========================================
  // FORM SUBMISSION HANDLER
  // ==========================================
  async function handleSubmit(e) {

    e.preventDefault();

    console.log("Form submitted!");
    console.log("Name:", name);
    console.log("Capacity:", capacity);
    console.log("Description:", description);
    console.log("Picture URL:", pictureUrl);

    // Validate the form
    const validationErrors = validateForm();

    // If there are errors, show them and stop
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});

    try {
      // Show loading state
      setIsSubmitting(true);

      // Call the API to create the spacecraft

      const response = await SpaceTravelApi.buildSpacecraft({
        name: name.trim(),
        capacity: Number(capacity),
        description: description.trim(),
        pictureUrl: pictureUrl.trim() || undefined // Optional field
      });

      if (response.isError) {
        // API returned an error
        alert("Failed to build spacecraft. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // SUCCESS! Show message and redirect
      alert(`${name} has been successfully built!`);

      // Navigate to the spacecrafts list
      navigate("/spacecrafts");

    } catch (err) {
      console.error("Error building spacecraft:", err);
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  }

  // ==========================================
  // INPUT CHANGE HANDLERS
  // ==========================================


  function handleNameChange(e) {
    setName(e.target.value);
    // Clear error for this field when user starts typing
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  }

  function handleCapacityChange(e) {
    setCapacity(e.target.value);
    if (errors.capacity) {
      setErrors({ ...errors, capacity: undefined });
    }
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors({ ...errors, description: undefined });
    }
  }

  function handlePictureUrlChange(e) {
    setPictureUrl(e.target.value);
    if (errors.pictureUrl) {
      setErrors({ ...errors, pictureUrl: undefined });
    }
  }

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className={styles.constructionPage}>
      {/* Header */}
      <header className={styles.constructionPage__header}>
        <h1 className={styles.constructionPage__title}>
          Build New Spacecraft
        </h1>
        <Link
          to="/spacecrafts"
          className={styles.constructionPage__backButton}
        >
          ← Back to Fleet
        </Link>
      </header>

      {/*
        FORM ELEMENT

        onSubmit: Called when form is submitted



      */}
      <form
        onSubmit={handleSubmit}
        className={styles.constructionPage__form}
      >
        {/* Form intro */}
        <p className={styles.constructionPage__intro}>
          Configure your new spacecraft. All fields marked with * are required.
        </p>

        {/*
          NAME FIELD (Required)


        */}
        <div className={styles.constructionPage__field}>
          <label
            htmlFor="name"
            className={styles.constructionPage__label}
          >
            Spacecraft Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className={`${styles.constructionPage__input} ${
              errors.name ? styles['constructionPage__input--error'] : ''
            }`}
            placeholder="Enter spacecraft name"
            disabled={isSubmitting}
          />
          {/* Show error message if validation failed */}
          {errors.name && (
            <span className={styles.constructionPage__error}>
              {errors.name}
            </span>
          )}
        </div>

        {/*
          CAPACITY FIELD (Required, Number)

        */}
        <div className={styles.constructionPage__field}>
          <label
            htmlFor="capacity"
            className={styles.constructionPage__label}
          >
            Capacity (people) *
          </label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={handleCapacityChange}
            className={`${styles.constructionPage__input} ${
              errors.capacity ? styles['constructionPage__input--error'] : ''
            }`}
            placeholder="Enter passenger capacity"
            min="1"
            disabled={isSubmitting}
          />
          {errors.capacity && (
            <span className={styles.constructionPage__error}>
              {errors.capacity}
            </span>
          )}
        </div>

        {/*
          DESCRIPTION FIELD (Required, Multiline)

          <textarea> for longer text

        */}
        <div className={styles.constructionPage__field}>
          <label
            htmlFor="description"
            className={styles.constructionPage__label}
          >
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className={`${styles.constructionPage__textarea} ${
              errors.description ? styles['constructionPage__input--error'] : ''
            }`}
            placeholder="Describe the spacecraft's features and capabilities"
            rows="6"
            disabled={isSubmitting}
          />
          {errors.description && (
            <span className={styles.constructionPage__error}>
              {errors.description}
            </span>
          )}
        </div>

        {/*
          PICTURE URL FIELD (Optional)

        */}
        <div className={styles.constructionPage__field}>
          <label
            htmlFor="pictureUrl"
            className={styles.constructionPage__label}
          >
            Picture URL (optional)
          </label>
          <input
            type="url"
            id="pictureUrl"
            value={pictureUrl}
            onChange={handlePictureUrlChange}
            className={`${styles.constructionPage__input} ${
              errors.pictureUrl ? styles['constructionPage__input--error'] : ''
            }`}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
          {errors.pictureUrl && (
            <span className={styles.constructionPage__error}>
              {errors.pictureUrl}
            </span>
          )}
          <span className={styles.constructionPage__hint}>
            Provide a direct link to an image (e.g., from Imgur or Wikipedia)
          </span>
        </div>

        {/*
          SUBMIT BUTTON

          type="submit": Triggers form's onSubmit event
          disabled: Prevents clicking while submitting


        */}
        <div className={styles.constructionPage__actions}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.constructionPage__submitButton}
          >
            {isSubmitting ? "Building..." : "Build Spacecraft"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/spacecrafts")}
            disabled={isSubmitting}
            className={styles.constructionPage__cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConstructionPage;

