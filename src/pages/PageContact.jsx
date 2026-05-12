import { useState, useEffect } from "react";
import { loadContacts, saveContacts } from "../utils/storage";

export default function PageContact() {
  const [contacts,     setContacts]     = useState(null);
  const [form,         setForm]         = useState({ name:"", phone:"", email:"", message:"" });
  const [editingIndex, setEditingIndex] = useState(null);

  // chargement initial
  useEffect(() => { setContacts(loadContacts()); }, []);

  // sauvegarde automatique (skip si pas encore chargé)
  useEffect(() => { if (contacts !== null) saveContacts(contacts); }, [contacts]);

  if (contacts === null) return null;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { alert("Nom et téléphone requis"); return; }
    if (editingIndex !== null) {
      const updated = [...contacts]; updated[editingIndex] = form;
      setContacts(updated); setEditingIndex(null);
    } else {
      setContacts([...contacts, form]);
    }
    setForm({ name:"", phone:"", email:"", message:"" });
  };

  const handleEdit   = i => { setForm(contacts[i]); setEditingIndex(i); };
  const handleDelete = i => setContacts(contacts.filter((_,j) => j !== i));
  const handleCall      = p => { window.location.href = `tel:${p}`; };
  const handleWhatsApp  = p => { window.location.href = `https://wa.me/${p.replace(/\D/g,"")}`; };
  const handleEmail     = e => { window.location.href = `mailto:${e}`; };

  return (
    <div className="page page-contact">
      <h1>Mes Contacts</h1>

      <form className="task-form" onSubmit={handleSubmit}>
        <input type="text"  name="name"    placeholder="Nom du contact"      value={form.name}    onChange={handleChange} required />
        <input type="tel"   name="phone"   placeholder="Numéro de téléphone" value={form.phone}   onChange={handleChange} required />
        <input type="email" name="email"   placeholder="Email (optionnel)"   value={form.email}   onChange={handleChange} />
        <textarea           name="message" placeholder="Note (optionnel)"    value={form.message} onChange={handleChange} rows="2" />
        <button type="submit">{editingIndex !== null ? "✏️ Modifier" : "➕ Ajouter"}</button>
      </form>

      <div className="contact-list">
        {contacts.length === 0
          ? <p className="empty">Aucun contact enregistré.</p>
          : contacts.map((c, i) => (
            <div key={i} className="contact-item">
              <div style={{ flex:1 }}>
                <strong style={{ color:"var(--primary-neon)", fontSize:"16px" }}>{c.name}</strong>
                <div className="contact-info">
                  <span><strong>📱 Tél:</strong> {c.phone}</span>
                  {c.email   && <span><strong>✉️ Email:</strong> {c.email}</span>}
                  {c.message && <span style={{ gridColumn:"1 / -1" }}><strong>📝 Note:</strong> {c.message}</span>}
                </div>
              </div>
              <div className="contact-actions">
                <button className="call-btn" onClick={() => handleCall(c.phone)}>☎️ Appeler</button>
                <button className="call-btn" onClick={() => handleWhatsApp(c.phone)}>💬 WhatsApp</button>
                {c.email && <button className="call-btn" onClick={() => handleEmail(c.email)}>✉️ Email</button>}
                <button onClick={() => handleEdit(i)}>✏️ Modifier</button>
                <button onClick={() => handleDelete(i)}>🗑 Supprimer</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
