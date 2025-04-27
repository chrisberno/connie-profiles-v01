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
  const profile = await fetchProfileById(id); // Replace with your data fetching logic
  if (!profile) {
    return { notFound: true }; // This causes a 404 if the profile isn't found
  }
  return {
    props: { profile }
  };
}