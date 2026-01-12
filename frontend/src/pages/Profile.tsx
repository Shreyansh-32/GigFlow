import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, User } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MyGig {
  _id: string;
  title: string;
  budget: number;
  status: string;
  createdAt: string;
}

interface MyBid {
  _id: string;
  price: number;
  status: string;
  createdAt: string;
  gigId: {
    _id: string;
    title: string;
    status: string;
  };
}

export default function Profile() {
  const { user } = useAuth();
  const [myGigs, setMyGigs] = useState<MyGig[]>([]);
  const [myBids, setMyBids] = useState<MyBid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        
        const [gigsRes, bidsRes] = await Promise.all([
          api.get("/gigs/my-gigs"),
          api.get("/bids/my-bids"),
        ]);
        
        setMyGigs(gigsRes.data);
        setMyBids(bidsRes.data);
      } catch (error) {
        console.error("Failed to fetch activity", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Activity...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      
      <div className="flex items-center gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User className="w-8 h-8" />
        </div>
        <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications">My Applications ({myBids.length})</TabsTrigger>
          <TabsTrigger value="posted">Posted Jobs ({myGigs.length})</TabsTrigger>
        </TabsList>

        
        <TabsContent value="applications" className="space-y-4 mt-4">
          {myBids.length === 0 ? (
            <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                    You haven't applied to any gigs yet.
                    <br />
                    <Button variant="link" asChild><Link to="/dashboard">Find Work</Link></Button>
                </CardContent>
            </Card>
          ) : (
            myBids.map((bid) => (
              <Card key={bid._id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">
                            
                            {bid.gigId ? bid.gigId.title : "Unknown Gig"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Bid Amount: ₹{bid.price} • {formatDistanceToNow(new Date(bid.createdAt))} ago
                        </p>
                    </div>
                    
                    <Badge 
                        className={
                            bid.status === 'Hired' ? 'bg-green-600' : 
                            bid.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'
                        }
                    >
                        {bid.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                    {bid.gigId && (
                        <Button variant="outline" size="sm" asChild>
                            <Link to={`/gigs/${bid.gigId._id}`}>
                                <ExternalLink className="w-3 h-3 mr-2" /> View Gig
                            </Link>
                        </Button>
                    )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        
        <TabsContent value="posted" className="space-y-4 mt-4">
            {myGigs.length === 0 ? (
             <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                    You haven't posted any jobs yet.
                    <br />
                    <Button variant="link" asChild><Link to="/post-gig">Post a Job</Link></Button>
                </CardContent>
             </Card>
            ) : (
                myGigs.map((gig) => (
                    <Card key={gig._id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between">
                                <CardTitle className="text-lg">{gig.title}</CardTitle>
                                <Badge variant={gig.status === 'Open' ? 'default' : 'secondary'}>
                                    {gig.status}
                                </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Budget: ₹{gig.budget} • Posted {formatDistanceToNow(new Date(gig.createdAt))} ago
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button size="sm" asChild>
                                <Link to={`/gigs/${gig._id}`}>
                                    Manage Proposals
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}