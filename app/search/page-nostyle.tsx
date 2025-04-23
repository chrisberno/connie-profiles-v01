'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Disable prerendering for this page            
export const dynamic = 'force-dynamic';

interface Profile {
  id: number;
  phone: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string | null;
  messenger_id: string | null;
  'Profile Image': string | null; // Match the API field name
  DOB: string | null;
  program_1: string | null;
  program_2: string | null;
  program_3: string | null;
  language: string | null;
  Location: string | null;
  pcp: string | null;
  pcp_contact: string | null;
  pcp_affiliation: string | null;
  primary_caregiver: string | null;
  primary_caregiver_phone: string | null;
}

function SearchDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for pagination, filters, and sorting
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pageSize] = useState(10);
  const [lastNameFilter, setLastNameFilter] = useState(searchParams.get('lastName') || '');
  const [phoneNumberFilter, setPhoneNumberFilter] = useState(searchParams.get('phoneNumber') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'lastname');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null); // Added error state

  // Debounced search handler
  const handleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to page 1 on filter change
    if (lastNameFilter) params.set('lastName', lastNameFilter);
    else params.delete('lastName');
    if (phoneNumberFilter) params.set('phoneNumber', phoneNumberFilter);
    else params.delete('phoneNumber');
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    router.push(`/search?${params.toString()}`);
  }, 300);

  // Fetch profiles when params change
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          lastName: lastNameFilter,
          phoneNumber: phoneNumberFilter,
          sortBy,
          sortOrder,
        });
        const response = await fetch(`/api/all-profiles?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfiles(data.profiles || []);
        setTotal(data.total || 0);
        setError(null);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setError('Failed to load profiles. Please try again later.');
        setProfiles([]);
        setTotal(0);
      }
    };
    fetchProfiles();
  }, [page, pageSize, lastNameFilter, phoneNumberFilter, sortBy, sortOrder]);

  // Update filters and trigger search
  const updateFilter = (key: string, value: string) => {
    if (key === 'lastName') setLastNameFilter(value);
    if (key === 'phoneNumber') setPhoneNumberFilter(value);
    handleSearch();
  };

  // Handle sorting
  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newSortOrder);
    handleSearch();
  };

  // Pagination controls
  const totalPages = Math.ceil(total / pageSize);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Search Directory</h1>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Filter by Last Name"
          value={lastNameFilter}
          onChange={(e) => updateFilter('lastName', e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by Phone Number"
          value={phoneNumberFilter}
          onChange={(e) => updateFilter('phoneNumber', e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Profiles Table */}
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead onClick={() => handleSort('firstname')} className="cursor-pointer">
        First Name {sortBy === 'firstname' && (sortOrder === 'asc' ? '↑' : '↓')}
      </TableHead>
      <TableHead onClick={() => handleSort('lastname')} className="cursor-pointer">
        Last Name {sortBy === 'lastname' && (sortOrder === 'asc' ? '↑' : '↓')}
      </TableHead>
      <TableHead>Phone Number</TableHead>
      <TableHead>Email</TableHead>
      <TableHead className="w-[72px]"></TableHead> {/* Avatar column */}
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {profiles.map((profile) => (
      <TableRow key={profile.id}>
        <TableCell>{profile.firstname}</TableCell>
        <TableCell>{profile.lastname}</TableCell>
        <TableCell>{profile.phone}</TableCell>
        <TableCell>{profile.email}</TableCell>
        <TableCell className="flex items-center justify-center">
          <div className="relative w-12 h-12">
            <img
              src={profile['Profile Image'] || '/default-avatar.png'}
              alt={`${profile.firstname} ${profile.lastname}`}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </TableCell>
        <TableCell>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Profile Image for', profile.firstname, profile['Profile Image']);
                  setSelectedProfile(profile);
                }}
              >
                View Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{`${profile.firstname} ${profile.lastname}`}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 pt-4">
                <img
                  src={profile['Profile Image'] || '/default-avatar.png'}
                  alt={`${profile.firstname} ${profile.lastname}`}
                  className="w-[120px] h-[120px] rounded-full object-cover"
                />
                <div className="text-center space-y-2">
                  <p><strong>Phone:</strong> {profile.phone}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Programs:</strong> {profile.program_1 || 'N/A'}, {profile.program_2 || 'N/A'}, {profile.program_3 || 'N/A'}</p>
                  <p><strong>Language:</strong> {profile.language || 'N/A'}</p>
                  <p><strong>Location:</strong> {profile.Location || 'N/A'}</p>
                  <p><strong>Primary Caregiver:</strong> {profile.primary_caregiver || 'N/A'} ({profile.primary_caregiver_phone || 'N/A'})</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// Main component that wraps the content in Suspense
export default function SearchDirectory() {
  return (
    <Suspense fallback={<div>Loading directory...</div>}>
      <SearchDirectoryContent />
    </Suspense>
  );
}