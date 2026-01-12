export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  ownerId: string;
  status: 'Open' | 'Assigned' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  gigId: string;
  freelancerId: string;
  price: number;
  message: string;
  status: 'Pending' | 'Hired' | 'Rejected';
  createdAt: string;
}