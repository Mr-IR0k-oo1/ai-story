import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-400 mb-8">This page does not exist.</p>
        <Link
          href="/"
          className="inline-block py-3 px-6 rounded-xl font-medium text-sm bg-white text-gray-950 hover:bg-gray-200 transition-all"
        >
          Start a Story
        </Link>
      </div>
    </div>
  );
}
