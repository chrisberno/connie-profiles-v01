// pages/profile/[id].js
import { useRouter } from 'next/router';

export default function Profile({ profile }) {
  const router = useRouter();
  const { id } = router.query;

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <h1>Profile: {profile.name}</h1>
      <p>Phone: {profile.phone}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  // Fetch profile data from the database or API
  const profile = await fetch(`https://connie-profiles-v01-3t7w5hahw-connie-direct.vercel.app/api/profile?id=${id}`);)
  if (!profile) {
    return { notFound: true }; // This causes a 404 if the profile isn't found
  }
  return {
    props: { profile }
  };
}