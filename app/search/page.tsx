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
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pageSize] = useState(10);
  const [searchFilter, setSearchFilter] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'lastname');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (searchFilter) params.set('search', searchFilter);
    else params.delete('search');
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
          search: searchFilter,
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
  }, [page, pageSize, searchFilter, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newSortOrder);
    handleSearch();
  };

  const totalPages = Math.ceil(total / pageSize);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Search Directory
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Browse and manage client profiles
          </p>
        </div>
        <Button
          className="bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
          onClick={() => router.push('/add-client')}
        >
          + Add Client
        </Button>
      </div>

      {error && (
        <div className="text-red-600 mb-6 font-medium bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="relative max-w-sm mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {/* Simple magnifying glass icon */}
          <span className="text-text-secondary">🔍</span>
        </div>
        <Input
          placeholder="Search by name or phone number..."
          value={searchFilter}
          onChange={(e) => {
            setSearchFilter(e.target.value);
            handleSearch();
          }}
          className="pl-10 max-w-sm border-gray-300 focus:ring-primary focus:border-primary rounded-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table className="border-separate border-spacing-y-2 table-fixed custom-table">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead
                onClick={() => handleSort('firstname')}
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 font-medium text-text-primary py-3 rounded-t-md"
              >
                First Name {sortBy === 'firstname' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                onClick={() => handleSort('lastname')}
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 font-medium text-text-primary py-3"
              >
                Last Name {sortBy === 'lastname' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="font-medium text-text-primary py-3">Phone Number</TableHead>
              <TableHead className="font-medium text-text-primary py-3">Email</TableHead>
              <TableHead className="w-[72px]"></TableHead>
              <TableHead className="font-medium text-text-primary py-3 rounded-t-md">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile, index) => (
              <TableRow
                key={profile.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors duration-200 rounded-md shadow-sm border border-gray-200 overflow-hidden`}
              >
                <TableCell className="text-text-primary py-3 rounded-l-md">{profile.firstname}</TableCell>
                <TableCell className="text-text-primary py-3">{profile.lastname}</TableCell>
                <TableCell className="text-text-secondary py-3">{profile.phone}</TableCell>
                <TableCell className="text-text-secondary py-3">{profile.email}</TableCell>
                <TableCell className="py-3 px-0 w-[72px]">
                  <div className="flex items-center justify-center">
                    <div className="relative w-10 h-10">
                      <img
                        src={profile['Profile Image'] || '/default-avatar.png'}
                        alt={`${profile.firstname} ${profile.lastname}`}
                        className="w-full h-full rounded-full object-cover border border-gray-200"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 rounded-r-md">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 rounded-md"
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
                        <DialogTitle className="text-xl font-semibold text-text-primary">
                          {`${profile.firstname} ${profile.lastname}`}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center space-y-3 pt-3">
                        <img
                          src={profile['Profile Image'] || '/default-avatar.png'}
                          alt={`${profile.firstname} ${profile.lastname}`}
                          className="w-[100px] h-[100px] rounded-full object-cover border-2 border-primary-light"
                        />
                        <div className="text-center space-y-2 text-text-primary">
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
          className="border border-gray-300 text-text-primary hover:bg-gray-100 transition-colors duration-200 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
        >
          Previous
        </Button>
        <span className="text-text-secondary text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="border border-gray-300 text-text-primary hover:bg-gray-100 transition-colors duration-200 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
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