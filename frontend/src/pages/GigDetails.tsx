import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatDistanceToNow } from "date-fns";
import { 
  Clock, ArrowLeft, Send, IndianRupee, 
  Briefcase, CheckCircle2, XCircle, User 
} from "lucide-react";
import toast from "react-hot-toast";

import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Bid, Gig } from "@/types";
import { isAxiosError } from "axios";

const bidSchema = z.object({
  price: z.coerce.number().min(5, "Price must be at least 5"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface PopulatedGig extends Omit<Gig, 'ownerId'> {
  ownerId: {
    _id: string;
    name: string;
    email: string;
  } | string;
}

export default function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [gig, setGig] = useState<PopulatedGig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(bidSchema),
    defaultValues: { price: 0, message: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gigRes = await api.get(`/gigs/${id}`);
        const fetchedGig = gigRes.data;
        setGig(fetchedGig);

        const ownerIdString = typeof fetchedGig.ownerId === 'object' 
          ? fetchedGig.ownerId._id 
          : fetchedGig.ownerId;

        if (user?._id === ownerIdString) {
          const bidsRes = await api.get(`/bids/${id}`);
          setBids(Array.isArray(bidsRes.data) ? bidsRes.data : []);
        }
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Could not load gig details");
      } finally {
        setLoading(false);
      }
    };

    if (id && user) fetchData();
  }, [id, user]);

  const onSubmitBid = async (values: z.infer<typeof bidSchema>) => {
    try {
      await api.post("/bids", {
        gigId: id,
        ...values,
      });
      toast.success("Bid placed successfully!");
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      if(isAxiosError(error)){
        toast.error(error.response?.data?.message || "Failed to place bid");
      }else{
        toast.error("Failed to place bid");
      }
    }
  };

  const handleHire = async (bidId: string) => {
    try {
      await api.patch('/hiring/hire', { bidId });
      toast.success("Freelancer hired successfully!");
      window.location.reload(); 
    } catch (error) {
      if(isAxiosError(error)){
        toast.error(error.response?.data?.message || "Hiring failed");
      }else{
        toast.error("Hiring failed");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!gig) return <div className="p-10 text-center">Gig not found</div>;

  const gigOwnerId = typeof gig.ownerId === 'object' ? gig.ownerId._id : gig.ownerId;
  const isOwner = user?._id === gigOwnerId;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* LEFT COLUMN: Main Details (Takes up 2/3 space) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-primary shadow-sm">
            <CardHeader>
               <div className="flex justify-between items-start">
                   <div>
                       <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">{gig.title}</CardTitle>
                       <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                           <Clock className="w-4 h-4" />
                           <span>Posted {formatDistanceToNow(new Date(gig.createdAt))} ago</span>
                       </div>
                   </div>
                   <Badge className="text-sm px-3 py-1" variant={gig.status === 'Open' ? 'default' : 'secondary'}>
                     {gig.status}
                   </Badge>
               </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-400"/> Project Description
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {gig.description}
              </div>
            </CardContent>
          </Card>

          {/* Proposals Section (Only visible to Owner) */}
          {isOwner && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Proposals received ({bids.length})</h2>
              </div>
              
              {bids.length === 0 ? (
                 <div className="text-center py-10 bg-white rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No proposals yet. Waiting for freelancers...</p>
                 </div>
              ) : (
                bids.map((bid) => (
                  <Card key={bid._id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Left Color Bar */}
                        <div className={`w-full sm:w-2 h-2 sm:h-auto ${
                            bid.status === 'Hired' ? 'bg-green-500' : 
                            bid.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-400'
                        }`} />
                        
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-full">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Bid Amount: <IndianRupee className="w-4 h-4 inline" />{bid.price}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(bid.createdAt))} ago
                                    </p>
                                </div>
                             </div>
                             
                             {/* Status Badges */}
                             {bid.status === 'Hired' && <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="w-3 h-3 mr-1"/> Hired</Badge>}
                             {bid.status === 'Rejected' && <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>}
                             {bid.status === 'Pending' && <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending Review</Badge>}
                          </div>
                          
                          <p className="text-gray-600 text-sm mt-3 bg-white p-3 border rounded-md shadow-sm">
                            "{bid.message}"
                          </p>
        
                          {/* Hire Action */}
                          {gig.status === 'Open' && bid.status === 'Pending' && (
                             <div className="mt-4 flex justify-end">
                                <Button onClick={() => handleHire(bid._id)} size="sm" className="bg-black hover:bg-gray-800">
                                   Hire Freelancer
                                </Button>
                             </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar (Takes up 1/3 space) */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Budget & Action Card */}
          <Card className="shadow-lg border-0 ring-1 ring-gray-200">
            <CardHeader className="pb-2">
                <CardDescription>Project Budget</CardDescription>
                <div className="text-4xl font-extrabold text-green-700 flex items-center">
                    <IndianRupee className="w-8 h-8 mr-1" strokeWidth={2.5}/>{gig.budget}
                </div>
            </CardHeader>
            <CardContent>
                <Separator className="my-4"/>
                
                {/* Action Button Logic */}
                {isOwner ? (
                    <Button className="w-full" variant="outline" disabled>
                        You posted this gig
                    </Button>
                ) : gig.status === 'Open' ? (
                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="lg" className="w-full text-lg shadow-md hover:shadow-lg transition-all">
                             Place a Bid
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Submit Proposal</DialogTitle>
                            <DialogDescription>
                              Tell the client why you're perfect for this job.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmitBid)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Your Price (Rs.)</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                          <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                          <Input type="number" className="pl-8" {...field} value={field.value as number}/>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cover Letter</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="I have 5 years of experience in this field..." 
                                        className="min-h-30"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" className="w-full">
                                <Send className="w-4 h-4 mr-2" /> Submit Bid
                              </Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                ) : (
                    <Button className="w-full" variant="secondary" disabled>
                        Applications Closed
                    </Button>
                )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}