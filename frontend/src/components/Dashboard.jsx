import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  LogOut, 
  Image as ImageIcon, 
  Download, 
  Loader, 
  Bug,
  Home,
  History,
  Settings,
  User,
  Menu,
  BarChart3,
  FileText
} from 'lucide-react';
import api from '../api/axios';

// Get base URL from environment or use localhost as fallback
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const onDrop = useCallback(async (acceptedFiles) => {
    setError('');
    setUploading(true);

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await api.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data.results);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Upload failed. Please check your internet connection and try again.'
      );
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif']
    },
    multiple: true,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDownloadCSV = () => {
    window.open(`${BASE_URL}/media/csv/results.csv`, '_blank');
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'logout', icon: LogOut, label: 'Logout', action: handleLogout },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white/95 backdrop-blur-sm border-r border-slate-200/60 shadow-xl flex flex-col">
        {/* Brand Header */}
        <div className="px-6 py-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bug className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">WhiteFly AI</h1>
              <p className="text-xs text-slate-500 font-medium">Detection System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="mb-4">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </p>
          </div>
          
          {menuItems.slice(0, -1).map((item) => {
            const ActiveIcon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-[1.02]'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <ActiveIcon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate text-sm">{item.label}</span>
              </button>
            );
          })}
          
          {/* Logout Button - Separated */}
          <div className="pt-6 mt-6 border-t border-slate-200/60">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="truncate text-sm">Sign Out</span>
            </button>
          </div>
        </nav>

        {/* User Info Footer */}
        <div className="px-4 py-4 border-t border-slate-200/60 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.username}</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  {activeTab === 'dashboard' && (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      Dashboard
                    </>
                  )}
                  {activeTab === 'history' && (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <History className="w-5 h-5 text-white" />
                      </div>
                      Detection History
                    </>
                  )}
                  {activeTab === 'analytics' && (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      Analytics
                    </>
                  )}
                  {activeTab === 'reports' && (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      Reports
                    </>
                  )}
                  {activeTab === 'settings' && (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      Settings
                    </>
                  )}
                  {activeTab === 'profile' && (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      Profile
                    </>
                  )}
                </h1>
                <p className="text-slate-600 mt-2 font-medium">
                  {activeTab === 'dashboard' && 'Upload and analyze images for whitefly detection using AI'}
                  {activeTab === 'history' && 'View your past detection results and analysis'}
                  {activeTab === 'analytics' && 'Analyze detection trends and performance statistics'}
                  {activeTab === 'reports' && 'Generate and download comprehensive reports'}
                  {activeTab === 'settings' && 'Manage your account and system preferences'}
                  {activeTab === 'profile' && 'View and edit your profile information'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/60 shadow-sm">
                  <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">Welcome back</p>
                  <p className="text-lg font-bold text-slate-900">{user?.username}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Detections</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">—</p>
                  <p className="text-xs text-slate-500 mt-1">All time</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Images Processed</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{results.length}</p>
                  <p className="text-xs text-slate-500 mt-1">This session</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Avg. Processing</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">~2.3s</p>
                  <p className="text-xs text-slate-500 mt-1">Per image</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Loader className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Export Data</p>
                  <p className="text-lg font-bold text-slate-900 mt-2">CSV Report</p>
                  <p className="text-xs text-slate-500 mt-1">Download results</p>
                </div>
                <div>
                  <button
                    onClick={handleDownloadCSV}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Upload Images</h2>
                    <p className="text-slate-600 mt-1">Drag and drop or click to select images for analysis</p>
                  </div>
                  <div className="px-3 py-1.5 bg-slate-100 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">JPG, PNG, GIF</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">!</span>
                      </div>
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                <div
                  {...getRootProps()}
                  className={`relative flex flex-col items-center justify-center gap-6 border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? 'border-emerald-400 bg-emerald-50/50 scale-[1.02]' 
                      : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30'
                  }`}
                >
                  <input {...getInputProps()} />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Loader className="w-8 h-8 animate-spin text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-slate-900">Processing Images...</p>
                        <p className="text-sm text-slate-600 mt-1">Please wait while we analyze your images</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-slate-900">Drop images here or click to browse</p>
                        <p className="text-slate-600 mt-2">Upload multiple images for batch processing</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          AI-Powered Detection
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Real-time Results
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Export Ready
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Detection Results</h3>
                    <p className="text-slate-600 mt-1">AI-powered whitefly detection analysis</p>
                  </div>
                  <div className="px-4 py-2 bg-slate-100 rounded-xl">
                    <p className="text-sm font-bold text-slate-900">{results.length} Results</p>
                  </div>
                </div>

                {results.length === 0 && !uploading ? (
                  <div className="py-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <ImageIcon className="w-10 h-10 text-slate-400" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">No Results Yet</h4>
                    <p className="text-slate-600">Upload images above to start detecting whiteflies with AI</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.map((result, idx) => (
                      <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden relative">
                          <img
                            src={`${BASE_URL}${result.annotated_image_url}`}
                            alt={result.image_name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
                            {result.whitefly_count} Detected
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 truncate">{result.image_name}</p>
                              <p className="text-xs text-slate-500">Processed successfully</p>
                            </div>
                          </div>
                          <a
                            href={`${BASE_URL}${result.annotated_image_url}`}
                            download
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full justify-center"
                          >
                            <Download className="w-4 h-4" />
                            Download Result
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-all duration-200 text-left"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <History className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">View History</p>
                      <p className="text-xs text-slate-500">Past detections</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDownloadCSV()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-all duration-200 text-left"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Download className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Export CSV</p>
                      <p className="text-xs text-slate-500">Download data</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-all duration-200 text-left"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Analytics</p>
                      <p className="text-xs text-slate-500">View insights</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-bold text-slate-900 mb-4">System Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">AI Model</p>
                      <p className="text-xs text-slate-500">Online & Ready</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Detection API</p>
                      <p className="text-xs text-slate-500">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Database</p>
                      <p className="text-xs text-slate-500">Operational</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
