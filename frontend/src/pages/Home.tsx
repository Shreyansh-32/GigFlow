import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Laptop, Briefcase, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      
      
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Find the perfect <span className="text-primary">freelance</span> services for your business.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            GigFlow connects you with top talent in minutes. Post a gig, review proposals, and hire safely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user ? (
               <Button size="lg" className="h-12 px-8 text-lg" asChild>
                 <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 w-5 h-5"/></Link>
               </Button>
            ) : (
              <>
                <Button size="lg" className="h-12 px-8 text-lg" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
                  <Link to="/login">I'm already a member</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

     
      <section className="py-20 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Laptop className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Post a Job</h3>
              <p className="text-gray-500">
                It's free and easy to post a job. Simply fill in a title, description, and budget and competitive bids come within minutes.
              </p>
            </div>

            
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Choose Freelancers</h3>
              <p className="text-gray-500">
                No job is too big or too small. We've got freelancers for jobs of any size or budget, across 2700+ skills.
              </p>
            </div>

            
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Pay Safely</h3>
              <p className="text-gray-500">
                Only pay for work when it has been completed and you're 100% satisfied with the quality using our secure payment system.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="py-8 text-center text-gray-400 text-sm border-t">
        © {new Date().getFullYear()} GigFlow. All rights reserved.
      </footer>
    </div>
  );
}