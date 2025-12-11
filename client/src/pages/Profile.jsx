import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { User, Mail, Phone, Building, MapPin, Camera, Loader2 } from "lucide-react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.avatar || null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    organization: user?.organization || "",
    address: user?.address || "", // Add this field to your User model if missing, or use for delivery
    password: "", // Only send if changing
    avatar: null // The file object
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      // Create local preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData object to send file + text
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("organization", formData.organization);
    data.append("address", formData.address);
    if (formData.password) data.append("password", formData.password);
    if (formData.avatar) data.append("avatar", formData.avatar);

    try {
      await updateProfile(data);
      toast.success("Profile updated successfully!");
      setFormData({ ...formData, password: "" }); // Clear password field
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-emerald-100">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900">Edit Profile</CardTitle>
              <CardDescription>Update your personal details and avatar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative group">
                    <Avatar className="h-28 w-28 border-4 border-white shadow-lg cursor-pointer">
                      <AvatarImage src={imagePreview} className="object-cover" />
                      <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-700">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white shadow-md hover:bg-emerald-700 cursor-pointer transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">Click the camera icon to upload</p>
                </div>

                {/* Text Fields */}
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /> Full Name</Label>
                      <Input id="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</Label>
                      <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="+254..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization" className="flex items-center gap-2"><Building className="h-4 w-4" /> Organization</Label>
                      <Input id="organization" value={formData.organization} onChange={handleChange} placeholder="e.g. Hope NGO" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Default Address (Optional)</Label>
                    <Input id="address" value={formData.address} onChange={handleChange} placeholder="Street, City" />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;