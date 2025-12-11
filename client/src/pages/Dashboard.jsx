import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DonationCard from "@/components/DonationCard";
import CreateDonationForm from "@/components/CreateDonationForm";
import RequestManagement from "@/components/RequestManagement";
import DeliveryTracker from "@/components/DeliveryTracker";
import DonationsMap from "@/components/DonationsMap"; 
import { useAuth } from "../context/AuthContext";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  X, 
  MapPin, 
  Package, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  ImageOff,
  Trash2
} from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

const FALLBACK_DONATIONS = [
  { _id: "demo-1", title: "Demo Vegetables", foodType: "Vegetables", quantity: "15kg", pickupLocation: "Nairobi", status: "Available", donor: { name: "Demo User" } }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [error, setError] = useState(null);

  const getDefaultTab = () => {
    if (user?.role === 'driver') return 'deliveries';
    if (user?.role === 'donor') return 'donations';
    return 'overview';
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (user?.role === 'driver') {
        setLoading(false);
      } else if (user?.role === 'donor') {
        const { data } = await api.get('/donations/my');
        setDonations(data);
        setLoading(false);
      } else {
        const [donationsRes, requestsRes] = await Promise.all([
          api.get('/donations'),
          api.get('/donations/requests/my')
        ]);
        setDonations(donationsRes.data);
        setMyRequests(requestsRes.data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      if (!err.response && user?.role === 'receiver') {
         setError("Could not connect. Showing demo data.");
         setDonations(FALLBACK_DONATIONS);
      } else {
        if (user?.role === 'donor') setDonations([]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);


  const handleRequestDonation = async (id) => {
    if (id.startsWith("demo-")) return toast.info("Demo item cannot be requested.");
    if (!confirm("Request this donation?")) return;
    try {
      await api.post(`/donations/${id}/request`, { message: `Request from ${user.name}` });
      toast.success("Request sent!");
      fetchData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    try {
      await api.delete(`/donations/requests/${requestId}/cancel`);
      toast.success("Request cancelled successfully");
      fetchData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!confirm("Delete this donation? This cannot be undone.")) return;
    try {
      await api.delete(`/donations/${id}`);
      toast.success("Donation deleted successfully");
      fetchData(); 
    } catch (error) {
      toast.error("Failed to delete donation");
    }
  };

  const handleViewDetails = (id) => {
    const donation = donations.find(d => d._id === id);
    if (donation) setSelectedDonation(donation);
  };

  const filteredDonations = donations.filter(d => 
    d.title?.toLowerCase().includes(search.toLowerCase()) || 
    d.foodType?.toLowerCase().includes(search.toLowerCase()) ||
    d.pickupLocation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} title="Go Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <span>Welcome back, <span className="font-semibold text-emerald-700">{user?.name}</span></span>
                <Badge variant="outline" className="ml-2 capitalize border-emerald-200 text-emerald-700 bg-emerald-50">
                  {user?.role} Account
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {user?.role === 'donor' && (
              <Button onClick={() => setShowCreate(!showCreate)} className={`shadow-md transition-all ${showCreate ? 'bg-gray-800' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                {showCreate ? <><X className="mr-2 h-4 w-4" /> Close Form</> : <><PlusCircle className="mr-2 h-4 w-4" /> Post Donation</>}
              </Button>
            )}
          </div>
        </div>

        {showCreate && user?.role === 'donor' && (
          <div className="mb-10 bg-white rounded-xl shadow-xl border border-emerald-100 p-6 animate-in slide-in-from-top-4">
            <h2 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2"><Package className="h-5 w-5" /> New Donation</h2>
            <CreateDonationForm onSuccess={() => { setShowCreate(false); fetchData(); }} />
          </div>
        )}

        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <Tabs defaultValue={getDefaultTab()} className="space-y-8">
          <TabsList className="bg-white border p-1 shadow-sm rounded-lg h-12 w-full md:w-auto grid grid-cols-1 md:inline-flex">
            {user?.role !== 'driver' && <TabsTrigger value="overview">Overview</TabsTrigger>}
            
            {user?.role === 'donor' && (
              <>
                <TabsTrigger value="donations">My Donations</TabsTrigger>
                <TabsTrigger value="requests">Incoming Requests</TabsTrigger>
              </>
            )}
            
            {user?.role === 'receiver' && <TabsTrigger value="my-requests">My Sent Requests</TabsTrigger>}
            
            {user?.role === 'driver' && <TabsTrigger value="deliveries">Delivery Jobs</TabsTrigger>}
            <TabsTrigger value="map">Live Map</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Button variant="outline"><Filter className="h-4 w-4" /></Button>
            </div>

            {loading ? <div className="text-center py-12">Loading...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.length > 0 ? (
                  filteredDonations.map(d => (
                    <DonationCard 
                      key={d._id} 
                      donation={d} 
                      userType={user.role} 
                      onRequest={handleRequestDonation} 
                      onView={handleViewDetails} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-white border-2 border-dashed rounded-xl">
                    <p className="text-gray-500">No donations found.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.length > 0 ? (
                filteredDonations.map(d => (
                  <DonationCard key={d._id} donation={d} userType={user.role} onView={handleViewDetails} onDelete={handleDeleteDonation} />
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-white border-2 border-dashed rounded-xl">
                  <p className="text-gray-500">You haven't posted any donations yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Sent Requests</h2>
            {myRequests.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500">
                You haven't made any requests yet. Go to Overview to find food.
              </div>
            ) : (
              <div className="grid gap-4">
                {myRequests.map((req) => (
                  <Card key={req._id} className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{req.donation?.title || "Unknown Item"}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(req.createdAt), "PPP")}</span>
                          <Badge variant={req.status === 'Pending' ? 'secondary' : req.status === 'Approved' ? 'default' : 'outline'}>
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Donor: {req.donor?.name || "Unknown"}</p>
                      </div>
                      
                      {(req.status === 'Pending' || req.status === 'Approved') && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                          onClick={() => handleCancelRequest(req._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Cancel Request
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests"><RequestManagement /></TabsContent>
          <TabsContent value="deliveries"><DeliveryTracker /></TabsContent>
          <TabsContent value="map">
            <div className="h-[600px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-lg relative bg-gray-100">
               <DonationsMap />
            </div>
          </TabsContent>
        </Tabs>

        {selectedDonation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 bg-gray-100 group">
                {selectedDonation.image ? (
                  <img src={selectedDonation.image} alt={selectedDonation.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                    <ImageOff className="h-16 w-16 mb-3 opacity-30" />
                    <span className="text-sm font-medium">No Preview Available</span>
                  </div>
                )}
                <button onClick={() => setSelectedDonation(null)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">{selectedDonation.title}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold flex gap-2"><Package className="h-4 w-4" /> Details</h3>
                    <p className="text-sm mt-2">Qty: {selectedDonation.quantity}</p>
                    <p className="text-sm">Type: {selectedDonation.foodType}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold flex gap-2"><MapPin className="h-4 w-4" /> Location</h3>
                    <p className="text-sm mt-2">{selectedDonation.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedDonation(null)}>Close</Button>
                  {user?.role === 'receiver' && selectedDonation.status === 'Available' && (
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { handleRequestDonation(selectedDonation._id); setSelectedDonation(null); }}>Request</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;