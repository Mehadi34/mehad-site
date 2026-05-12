/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import Events from './pages/Events';
import Shop from './pages/Shop';
import Donors from './pages/Donors';
import Accounts from './pages/Accounts';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import { seedDemoData } from './services/seedService';

// Admin Pages
import AdminDashboard from './pages/admin/Overview';
import AdminProfile from './pages/admin/Profile';
import AdminUsers from './pages/admin/Users';
import AdminInventory from './pages/admin/Inventory';
import AdminFinances from './pages/admin/Finances';
import AdminSettings from './pages/admin/Settings';
import AdminStickers from './pages/admin/Stickers';
import AdminScanner from './pages/admin/Scanner';
import AdminIssues from './pages/admin/Issues';
import AdminMessages from './pages/admin/Messages';
import AdminDonors from './pages/admin/Donors';
import AdminDues from './pages/admin/Dues';

export default function App() {
  useEffect(() => {
    seedDemoData();
  }, []);

  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-brand-primary/10 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/books" element={<><Navbar /><Books /><Footer /></>} />
          <Route path="/events" element={<><Navbar /><Events /><Footer /></>} />
          <Route path="/shop" element={<><Navbar /><Shop /><Footer /></>} />
          <Route path="/donors" element={<><Navbar /><Donors /><Footer /></>} />
          <Route path="/accounts" element={<><Navbar /><Accounts /><Footer /></>} />
          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/finances" element={<AdminFinances />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/stickers" element={<AdminStickers />} />
          <Route path="/admin/scanner" element={<AdminScanner />} />
          <Route path="/admin/issues" element={<AdminIssues />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/donors" element={<AdminDonors />} />
          <Route path="/admin/dues" element={<AdminDues />} />
        </Routes>
        <AIAssistant />
      </div>
    </Router>
  );
}
