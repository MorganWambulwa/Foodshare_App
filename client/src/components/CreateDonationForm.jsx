import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ImagePlus, X, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setPosition, position }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const CreateDonationForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [mapCenter, setMapCenter] = useState([-1.2921, 36.8219]); 
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    foodType: "Cooked Meal",
    quantity: "",
    pickupLocation: "",
    bestBefore: "", 
    image: null
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("foodType", formData.foodType);
    data.append("quantity", formData.quantity);
    data.append("pickupLocation", formData.pickupLocation);
    
    if (formData.bestBefore) data.append("bestBefore", formData.bestBefore);
    if (formData.image) data.append("image", formData.image);
    if (selectedPosition) {
      data.append("latitude", selectedPosition.lat);
      data.append("longitude", selectedPosition.lng);
    }

    try {
      await api.post('/donations', data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Donation Created Successfully!");
      
      setFormData({
        title: "", description: "", foodType: "Cooked Meal", quantity: "", 
        pickupLocation: "", bestBefore: "", image: null
      });
      setImagePreview(null);
      setSelectedPosition(null);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.response?.data?.message || "Failed to create donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Donation Image (Optional)</Label>
        {!imagePreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer relative">
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <ImagePlus className="h-8 w-8 mb-2 text-emerald-600" />
            <p className="text-sm font-medium">Click to upload an image</p>
          </div>
        ) : (
          <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-200">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
            <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"><X className="h-4 w-4" /></button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. 50 Lunch Boxes" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="foodType">Food Type *</Label>
          <Select value={formData.foodType} onValueChange={value => setFormData({...formData, foodType: value})}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cooked Meal">Cooked Meal</SelectItem>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Canned Goods">Canned Goods</SelectItem>
              <SelectItem value="Baked Goods">Baked Goods</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Fruits">Fruits</SelectItem>
              <SelectItem value="Grains">Grains</SelectItem>
              <SelectItem value="Beverages">Beverages</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the food..." required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input id="quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="e.g. 10kg" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Address / Landmark *</Label>
          <Input id="location" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} placeholder="e.g. Near City Market" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Pin Exact Location on Map (Optional)</Label>
        <div className="h-[250px] w-full rounded-md border border-gray-300 overflow-hidden relative z-0">
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={selectedPosition} setPosition={setSelectedPosition} />
          </MapContainer>
        </div>
        <p className="text-xs text-muted-foreground">Click on the map to set the precise pickup point.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry">Best Before (Optional)</Label>
        <Input id="expiry" type="datetime-local" value={formData.bestBefore} onChange={e => setFormData({...formData, bestBefore: e.target.value})} />
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
        {loading ? "Posting..." : "Post Donation"}
      </Button>
    </form>
  );
};

export default CreateDonationForm;