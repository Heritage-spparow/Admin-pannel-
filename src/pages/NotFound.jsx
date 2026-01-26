import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link className="text-blue-600 underline" to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}
