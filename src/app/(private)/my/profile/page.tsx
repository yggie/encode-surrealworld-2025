import Link from "next/link";

export const dynamic = "force-dynamic";

export default function MyProfilePage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1>My Profile</h1>

      <div>
        <Link href="/my/profile/setup" className="link link-primary">
          Setup new profile
        </Link>
      </div>
    </div>
  );
}
