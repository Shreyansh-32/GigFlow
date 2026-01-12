import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { IndianRupee, Clock } from "lucide-react";
import type { Gig } from "@/types";
import { Link } from "react-router-dom";

interface GigCardProps {
  gig: Gig;
}

export default function GigCard({ gig }: GigCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold truncate">
            {gig.title}
          </CardTitle>
          <Badge variant={gig.status === "Open" ? "default" : "secondary"}>
            {gig.status}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
          <Clock className="w-3 h-3" />
          <span>Posted {formatDistanceToNow(new Date(gig.createdAt))} ago</span>
        </div>
      </CardHeader>

      <CardContent className="grow">
        <p className="text-gray-600 line-clamp-3 text-sm">{gig.description}</p>
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center font-semibold text-green-700">
          <IndianRupee className="w-4 h-4 mr-1" />
          {gig.budget}
        </div>
        <Button size="sm" asChild>
          <Link to={`/gigs/${gig._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
