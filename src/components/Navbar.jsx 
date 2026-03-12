import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo / Brand */}
        <div className="font-bold text-xl tracking-wide">
          📍 WatchRadar
        </div>

        {/* Navigation */}
        <div className="flex space-x-6 text-sm md:text-base">
          <Link to="/" className="hover:text-green-300 transition">
            Map
          </Link>

          <Link to="/UserDashboard" className="hover:text-green-300 transition">
            Dashboard
          </Link>

          <Link to="/developer-manifesto" className="hover:text-green-300 transition">
            Mission
          </Link>
        </div>

      </div>
    </nav>
  );
}