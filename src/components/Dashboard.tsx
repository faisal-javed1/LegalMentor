import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">LegalMentor</span>
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3 ">
              <Link to="/" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Log Out</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Cases</h2>
            <ul className="list-disc list-inside">
              <li>Case #12345 - Property Dispute</li>
              <li>Case #67890 - Contract Review</li>
              <li>Case #11223 - Family Law Matter</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <ul className="list-disc list-inside">
              <li>May 15, 2023 - Client Meeting</li>
              <li>May 18, 2023 - Court Hearing</li>
              <li>May 20, 2023 - Document Review</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/chat" className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Start Chat
              </Link>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                New Case
              </button>
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                Search Legal Database
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

