import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Package, User, ImageOff, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

const DonationCard = ({ donation, userType, onRequest, onView, onDelete }) => {
  const isAvailable = donation.status === 'Available';
  const hasImage = donation.image && donation.image.length > 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-emerald-100 flex flex-col h-full relative group">
      
      {userType === 'donor' && onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(donation._id); }}
          className="absolute top-2 left-2 z-10 p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete Donation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="relative h-48 bg-gray-100 w-full flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img 
            src={donation.image} 
            alt={donation.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageOff className="h-10 w-10 mb-2 opacity-50" />
            <span className="text-xs font-medium">No Image Provided</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Badge className={`${isAvailable ? 'bg-emerald-500' : 'bg-gray-500'} text-white shadow-sm`}>
            {donation.status}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3 flex-grow">
        <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1" title={donation.title}>
          {donation.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 mt-1">
          {donation.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3 space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span className="line-clamp-1">{donation.pickupLocation}</span>
        </div>
        
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
              {donation.foodType}
            </Badge>
            <span className="font-medium text-gray-900">{donation.quantity}</span>
          </div>
          
          {donation.bestBefore && (
            <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
              <Clock className="h-3 w-3" />
              {format(new Date(donation.bestBefore), "MMM d")}
            </div>
          )}
        </div>

        {userType === 'receiver' && (
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 border-t border-gray-100 mt-2">
            <User className="h-3 w-3" />
            Posted by <span className="font-medium text-gray-700">{donation.donor?.name || "Anonymous"}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4 gap-3 mt-auto">
        {userType === 'receiver' && isAvailable ? (
          <>
            <Button 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              onClick={() => onRequest(donation._id)}
            >
              Request
            </Button>
            <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => onView(donation._id)}>
              Details
            </Button>
          </>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => onView(donation._id)}>
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DonationCard;