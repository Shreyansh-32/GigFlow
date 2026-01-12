import { useEffect, useState } from "react";
import api from "@/lib/axios";
import GigCard from "@/components/shared/GigCard";
import { Loader2, Search } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Link } from "react-router-dom";
import type { Gig } from "@/types";

export default function Dashboard() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); 

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/gigs", {
          params: { search: search } 
        });
        setGigs(data);
        setError(""); 
      } catch (err) {
        console.error(err);
        setError("Failed to load gigs.");
      } finally {
        setLoading(false);
      }
    };


    const debounceTimer = setTimeout(() => {
      fetchGigs();
    }, 500);


    return () => clearTimeout(debounceTimer);
  }, [search]);

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Available Gigs</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search gigs by title..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button asChild className="shrink-0">
            <Link to="/post-gig">Post a Gig</Link>
          </Button>
        </div>
      </div>

      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed shadow-sm">
          <h3 className="text-lg font-medium">No gigs found</h3>
          <p className="text-gray-500 mt-2">
            {search ? `No results matching "${search}"` : "Be the first to post a job!"}
          </p>
          {!search && (
            <Button className="mt-4" asChild>
              <Link to="/post-gig">Post a Job</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
}