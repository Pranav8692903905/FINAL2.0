'use client';

import Link from 'next/link';
import ClientOnly from '../client-only';
import AdminPage from '../../src/pages/AdminPage';
import '../../src/App.css';

export default function Admin() {
  return (
    <ClientOnly>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">Smart Resume Analyzer</h1>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/admin" className="nav-link">Admin</Link>
              </li>
            </ul>
          </div>
        </nav>

        <AdminPage />
      </div>
    </ClientOnly>
  );
}
