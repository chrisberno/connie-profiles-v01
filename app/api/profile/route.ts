import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phoneNumber = searchParams.get('phoneNumber');

  if (!phoneNumber) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  if (phoneNumber === '+9999999999') {
    return NextResponse.json({
      profile: {
        phone: '+9999999999',
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        avatar: undefined,
        program_1: 'Test Program',
        family_details: 'N/A',
      },
    });
  }

  const response = await fetch(
    `http://db.connie.technology:3000/profiles?phoneNumber=${encodeURIComponent(phoneNumber)}`
  );
  const data = await response.json();

  if (response.ok && data.profile) {
    // Map "Profile Image" to "avatar"
    if (data.profile['Profile Image']) {
      data.profile.avatar = data.profile['Profile Image'];
      data.profile = Object.fromEntries(
        Object.entries(data.profile).filter(([key]) => key !== 'Profile Image')
      );
    }
    // Sanitize the avatar field
    if (!data.profile.avatar || data.profile.avatar === 'https://default-avatar.png/' || data.profile.avatar === '') {
      data.profile.avatar = undefined;
    }
    return NextResponse.json({ profile: data.profile });
  }
  return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
}