
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Save, Camera, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { adminData, updateAdminProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(''); 
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (adminData) {
      setName(adminData.name || '');
      setEmail(adminData.email || '');
      setDescription(adminData.description || '');
      setProfilePhoto(adminData.profilePhoto || '');
      setPhotoPreview(adminData.profilePhoto || '');
    }
  }, [adminData]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setProfilePhoto(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAdminProfile({ name, description, profilePhoto });
  };

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-emphasis">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="button-outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold text-emphasis">Admin Profile</h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="glass-effect shadow-2xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary shadow-lg">
                    <AvatarImage src={photoPreview || undefined} alt={name || "Admin"} />
                    <AvatarFallback className="text-4xl bg-primary/20 text-primary">
                      {name ? name.charAt(0).toUpperCase() : 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="profilePhotoInput" className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </label>
                  <Input 
                    id="profilePhotoInput" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoChange} 
                  />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold gradient-text">{name || 'Admin User'}</CardTitle>
                  <CardDescription className="text-subtle flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2 text-primary" /> {email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-emphasis">Full Name</Label>
                  <div className="relative mt-2">
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-emphasis">About Me</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full button-primary text-lg py-3 pulse-glow">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfile;
