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

export const dynamic = 'force-dynamic';

interface Profile {
  id: number;
  phone: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string | null;
  messenger_id: string | null;
  'Profile Image': string | null;
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

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(
    searchParams ? parseInt(searchParams.get('page') || '1') : 1
  );
  const [pageSize] = useState(10);
  const [lastNameFilter, setLastNameFilter] = useState(
    searchParams ? (searchParams.get('lastName') || '') : ''
  );
  const [phoneNumberFilter, setPhoneNumberFilter] = useState(
    searchParams ? (searchParams.get('phoneNumber') || '') : ''
  );
  const [sortBy, setSortBy] = useState(
    searchParams ? (searchParams.get('sortBy') || 'lastname') : 'lastname'
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams ? (searchParams.get('sortOrder') || 'asc') : 'asc'
  );
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useDebouncedCallback(() => {
    // Create a new URLSearchParams object, handling the case where searchParams might be null
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    params.set('page', '1');
    if (lastNameFilter) params.set('lastName', lastNameFilter);
    else params.delete('lastName');
    if (phoneNumberFilter) params.set('phoneNumber', phoneNumberFilter);
    else params.delete('phoneNumber');
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    router.push(`/search?${params.toString()}`);
  }, 300);

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

  const updateFilter = (key: string, value: string) => {
    if (key === 'lastName') setLastNameFilter(value);
    if (key === 'phoneNumber') setPhoneNumberFilter(value);
    handleSearch();
  };

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newSortOrder);
    handleSearch();
  };

  const totalPages = Math.ceil(total / pageSize);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Search Directory
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and manage client profiles
          </p>
        </div>
        <Button
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
          onClick={() => router.push('/add-client')} // Placeholder for adding a client
        >
          + Add Client
        </Button>
      </div>

      {error && (
        <div className="text-red-600 mb-6 font-medium bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Filter by Last Name"
          value={lastNameFilter}
          onChange={(e) => updateFilter('lastName', e.target.value)}
          className="max-w-xs border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        />
        <Input
          placeholder="Filter by Phone Number"
          value={phoneNumberFilter}
          onChange={(e) => updateFilter('phoneNumber', e.target.value)}
          className="max-w-xs border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead
                onClick={() => handleSort('firstname')}
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 font-medium text-gray-900 py-3"
              >
                First Name {sortBy === 'firstname' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                onClick={() => handleSort('lastname')}
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 font-medium text-gray-900 py-3"
              >
                Last Name {sortBy === 'lastname' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="font-medium text-gray-900 py-3">Phone Number</TableHead>
              <TableHead className="font-medium text-gray-900 py-3">Email</TableHead>
              <TableHead className="w-[72px]"></TableHead>
              <TableHead className="font-medium text-gray-900 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile, index) => (
              <TableRow
                key={profile.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200 last:border-b-0`}
              >
                <TableCell className="text-gray-900 py-3">{profile.firstname}</TableCell>
                <TableCell className="text-gray-900 py-3">{profile.lastname}</TableCell>
                <TableCell className="text-gray-600 py-3">{profile.phone}</TableCell>
                <TableCell className="text-gray-600 py-3">{profile.email}</TableCell>
                <TableCell className="flex items-center justify-center py-3">
                  <div className="relative w-12 h-12">
                    <img
                      src={profile['Profile Image'] || '/default-avatar.png'}
                      alt={`${profile.firstname} ${profile.lastname}`}
                      className="w-full h-full rounded-full object-cover border border-gray-200"
                    />
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-200 rounded-md"
                        onClick={() => {
                          console.log('Profile Image for', profile.firstname, profile['Profile Image']);
                          setSelectedProfile(profile);
                        }}
                      >
                        View Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-lg p-6 animate-fade-in">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                          {`${profile.firstname} ${profile.lastname}`}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center space-y-3 pt-3">
                        <img
                          src={profile['Profile Image'] || '/default-avatar.png'}
                          alt={`${profile.firstname} ${profile.lastname}`}
                          className="w-[100px] h-[100px] rounded-full object-cover border-2 border-indigo-100"
                        />
                        <div className="text-center space-y-2 text-gray-900">
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
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
        >
          Previous
        </Button>
        <span className="text-gray-600 text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function SearchDirectory() {
  return (
    <Suspense fallback={<div>Loading directory...</div>}>
      <SearchDirectoryContent />
    </Suspense>
  );
}
