import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, FileText, Calendar, MessageSquare, Search, PlusCircle, LogOut } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-blue-600 font-bold text-xl">LegalMentor</span>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-3">
                <Bell size={20} />
              </button>
              <Link 
                to="/" 
                className="flex items-center py-2 px-4 text-sm font-medium text-gray-700 hover:bg-blue-500 hover:text-white rounded-md transition duration-200"
              >
                <LogOut size={18} className="mr-2" />
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Jane Doe</h1>
          <p className="text-gray-500 mt-1">Tuesday, February 18, 2025</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Cases</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                <p className="text-2xl font-semibold">5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <MessageSquare size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unread Messages</p>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Cases */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Recent Cases</h2>
                <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">View All</button>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { id: '12345', title: 'Property Dispute', status: 'In Progress', date: 'Feb 15, 2025' },
                  { id: '67890', title: 'Contract Review', status: 'Pending', date: 'Feb 12, 2025' },
                  { id: '11223', title: 'Family Law Matter', status: 'Completed', date: 'Feb 10, 2025' },
                ].map(item => (
                  <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Case #{item.id} - {item.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Calendar Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { date: 'Feb 20, 2025', time: '10:00 AM', event: 'Client Meeting', client: 'John Smith' },
                  { date: 'Feb 22, 2025', time: '2:00 PM', event: 'Court Hearing', client: 'Robertson v. Daniels' },
                  { date: 'Feb 25, 2025', time: '11:30 AM', event: 'Document Review', client: 'Estate Planning' },
                ].map((appointment, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition duration-150">
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">{appointment.date.split(' ')[0]}</span>
                          <span className="text-lg font-bold text-blue-700">{appointment.date.split(' ')[1].replace(',', '')}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{appointment.event}</p>
                        <p className="text-sm text-gray-500">{appointment.time} - {appointment.client}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <Link 
                  to="/chat" 
                  className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                >
                  <MessageSquare size={18} className="mr-2" />
                  Start Chat
                </Link>
                <button className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                  <PlusCircle size={18} className="mr-2" />
                  New Case
                </button>
                <button className="flex items-center justify-center w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                  <Search size={18} className="mr-2" />
                  Search Legal Database
                </button>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { action: 'Document uploaded', info: 'Contract Agreement #12456', time: '2 hours ago' },
                  { action: 'New message', info: 'From: Michael Johnson', time: 'Yesterday' },
                  { action: 'Case status updated', info: 'Case #67890 marked as pending', time: 'Yesterday' },
                ].map((activity, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition duration-150">
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.info}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
