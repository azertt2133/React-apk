import { useState, useEffect } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Charger les données sauvegardées
  useEffect(() => {
    const saved = localStorage.getItem("contactForm");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    localStorage.setItem("contactForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page page-contact">
      <h1>Contact</h1>
      {!submitted ? (
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Votre message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            style={{ padding: "10px", borderRadius: "12px" }}
          />
          <button type="submit">Envoyer</button>
        </form>
      ) : (
        <p>✅ Merci {formData.name}, votre message est enregistré !</p>
      )}
    </div>
  );
}
