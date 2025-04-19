'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Profile {
  phone: string;
  firstname: string;
  lastname: string;
  email?: string;
  avatar?: string;
  program_1?: string;
  family_details?: string;
}

export default function ProfilePage() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!phoneNumber.match(/^\+\d{10,15}$/)) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile?phoneNumber=${encodeURIComponent(phoneNumber)}`);
      const data = await response.json();
      console.log('API response:', data);
      if (response.ok && data.profile) {
        setProfile(data.profile);
      } else {
        setError(data.error || 'Profile not found');
        setProfile(null);
      }
    } catch (err) {
      setError('Failed to fetch profile');
      setProfile(null);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Profile Search</h1>
      {/* <h1 className="text-3xl font-bold mb-6 animate-fade-in">Customer Profile Search</h1>
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">Customer Profile Search</h1> */}
      <div className="flex gap-4 mb-6">
        <Input
          type="tel"
          placeholder="Enter phone number (e.g., +1234567890)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <img
                src={profile.avatar ? profile.avatar : '/default-avatar.png'}
                alt={profile.firstname}
                className="w-[90px] h-[90px] rounded-full"
              />
              <div className="space-y-2">
                <p className="text-lg">
                  <strong>Name:</strong> {profile.firstname} {profile.lastname}
                </p>
                <p className="text-lg">
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p className="text-lg">
                  <strong>Email:</strong> {profile.email || 'N/A'}
                </p>
                <p className="text-lg">
                  <strong>Program:</strong> {profile.program_1 || 'N/A'}
                </p>
                <p className="text-lg">
                  <strong>Family Details:</strong> {profile.family_details || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {!profile && !error && !loading && (
        <p>Enter a phone number to search for a profile.</p>
      )}
    </div>
  );
}