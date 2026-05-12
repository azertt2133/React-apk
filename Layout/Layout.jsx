import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        {children}
      </main>
    </div>
  );
}