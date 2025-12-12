import { Bell, LogOut, Menu, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // Mock notifications - depois você busca do backend
  const notifications = [
    {
      id: 1,
      title: 'New flashcard set created',
      message: 'Your flashcards are ready to review',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Quiz completed',
      message: 'You scored 85% on React Hooks quiz',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Study streak milestone',
      message: '7 days study streak! Keep going!',
      time: '2 hours ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:block"></div>
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              className="relative inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell
                size={20}
                strokeWidth={2}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-semibold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                </>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-xl shadow-slate-200/50 py-2 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-slate-200/60">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Notifications
                  </h3>
                </div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-slate-50 transition-colors duration-200 cursor-pointer ${
                      notification.unread ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 mt-1.5 rounded-full ${
                          notification.unread
                            ? 'bg-emerald-500'
                            : 'bg-transparent'
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2 border-t border-slate-200/60">
                  <button
                    className="w-full text-sm text-emerald-600 hover:text-emerald-500 font-medium transition-colors duration-200"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative flex items-center gap-3 pl-3 border-l border-slate-200/60">
            <div
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-200">
                <User size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-xl shadow-slate-200/50 py-2 z-50">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                  onClick={() => setShowDropdown(false)}
                >
                  <Settings size={18} strokeWidth={2} />
                  <span>Settings</span>
                </button>
                <hr className="my-2 border-slate-200/60" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <LogOut size={18} strokeWidth={2} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
