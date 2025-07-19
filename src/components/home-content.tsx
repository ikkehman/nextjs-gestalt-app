'use client';

interface UserData {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

interface HomeContentProps {
  user: UserData;
}

export default function HomeContent({ user }: HomeContentProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Welcome, {user.username}!</h3>
      <p>This is your dashboard home page.</p>
    </div>
  );
}
