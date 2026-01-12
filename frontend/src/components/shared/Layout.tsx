import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Outlet /> 
      </main>
    </div>
  );
}