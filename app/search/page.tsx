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
    <div className="container mx-auto px-4 py-6">
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
          className="bg-indigo-600 text-white hover:bg-indigo-700"
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

      <div className="relative w-full max-w-sm mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500">🔍</span>
        </div>
        <Input
          placeholder="Search by name or phone number..."
          value={searchFilter}
          onChange={(e) => {
            setSearchFilter(e.target.value);
            handleSearch();
          }}
          className="pl-10 w-full"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <>{/* Using fragment to avoid whitespace */}
                <TableHead onClick={() => handleSort('firstname')} className="cursor-pointer">
                  First Name {sortBy === 'firstname' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead onClick={() => handleSort('lastname')} className="cursor-pointer">
                  Last Name {sortBy === 'lastname' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[72px]"></TableHead>
                <TableHead>Actions</TableHead>
              </>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <>{/* Using fragment to avoid whitespace */}
                  <TableCell>{profile.firstname}</TableCell>
                  <TableCell>{profile.lastname}</TableCell>
                  <TableCell>{profile.phone}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div className="relative w-8 h-8">
                        <img
                          src={profile['Profile Image'] || '/default-avatar.png'}
                          alt={`${profile.firstname} ${profile.lastname}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                          onClick={() => {
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
                </>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Previous
        </Button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="border border-gray-300 text-gray-700 hover:bg-gray-100"
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
