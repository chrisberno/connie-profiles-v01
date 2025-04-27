// pages/profile/[id].js
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Profile ID: {id}</p>
    </div>
  );
}