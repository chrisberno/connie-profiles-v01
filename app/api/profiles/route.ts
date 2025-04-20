import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const lastName = searchParams.get('lastName') || '';
    const phoneNumber = searchParams.get('phoneNumber') || '';
    const sortBy = searchParams.get('sortBy') || 'lastName';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Mock data (replace this with the fetch call once the backend is fixed)
    const data = {
      profile: {
        id: 2,
        phone: '+15109309015',
        firstname: 'Christopher',
        lastname: 'Berno',
        email: 'chris.berno@gmail.com',
        'Profile Image': 'https://i.postimg.cc/wxZ2zHHv/chris-berno-LAX.png',
        program_1: 'Meals on Wheels',
        family_details: '',
      },
    };

    // Wrap the single profile in an array
    let profiles = data.profile ? [data.profile] : [];

    profiles = profiles.map((profile: any) => {
      if (profile['Profile Image']) {
        profile.avatar = profile['Profile Image'];
        delete profile['Profile Image'];
      }
      if (!profile.avatar || profile.avatar === 'https://default-avatar.png/' || profile.avatar === '') {
        profile.avatar = undefined;
      }
      return {
        ...profile,
        firstname: profile.firstname || '',
        lastname: profile.lastname || '',
        phone: profile.phone || '',
        email: profile.email || '',
      };
    });

    if (lastName) {
      profiles = profiles.filter((profile: any) =>
        profile.lastname.toLowerCase().includes(lastName.toLowerCase())
      );
    }
    if (phoneNumber) {
      profiles = profiles.filter((profile: any) =>
        profile.phone.includes(phoneNumber)
      );
    }

    profiles.sort((a: any, b: any) => {
      const valueA = (a[sortBy] || '').toLowerCase();
      const valueB = (b[sortBy] || '').toLowerCase();
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    const total = profiles.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    profiles = profiles.slice(start, end);

    return NextResponse.json({
      profiles,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error in /api/profiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}