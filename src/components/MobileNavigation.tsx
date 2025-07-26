import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Menu, 
  X, 
  Sparkles,
  GraduationCap,
  Download,
  Upload,
  Sun,
  Moon,
  FileText
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MobileNavigationProps {
  activeView: 'dashboard' | number;
  setActiveView: (view: 'dashboard' | number) => void;
  semesters: any[];
  semestersConfig: any[];
  onExportPDF: () => void;
  onExportCSV: () => void;
  onImportData: () => void;
}

export function MobileNavigation({ 
  activeView, 
  setActiveView, 
  semesters, 
  semestersConfig,
  onExportPDF,
  onExportCSV,
  onImportData
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigation = (view: 'dashboard' | number) => {
    setActiveView(view);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-200"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Navigation Panel */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center mb-6 pt-16">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-3">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GPA Calculator Pro
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Academic Excellence Tracker
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onExportPDF();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs font-medium"
              >
                <FileText className="h-3 w-3 mr-1" />
                PDF
              </button>
              <button
                onClick={() => {
                  onExportCSV();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-xs font-medium"
              >
                <Download className="h-3 w-3 mr-1" />
                CSV
              </button>
              <button
                onClick={() => {
                  onImportData();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium"
              >
                <Upload className="h-3 w-3 mr-1" />
                Import
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="flex items-center justify-center px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs font-medium"
              >
                {theme === 'light' ? (
                  <Moon className="h-3 w-3 mr-1" />
                ) : (
                  <Sun className="h-3 w-3 mr-1" />
                )}
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
          {/* Navigation Items */}
          <div className="flex-1 space-y-3">
            {/* Dashboard */}
            <button
              onClick={() => handleNavigation('dashboard')}
              className={`w-full flex items-center px-4 py-4 rounded-xl text-left transition-all duration-300 ${
                activeView === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-400 shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:shadow-md hover:scale-102'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Semesters Section */}
            <div className="pt-6">
              <div className="flex items-center mb-4 px-4">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Academic Years
                </p>
              </div>
              
              <div className="space-y-2">
                {semestersConfig.map((semester) => {
                  const semesterData = semesters.find(s => s.id === semester.id);
                  const hasSubjects = semesterData?.subjects.length > 0;
                  
                  return (
                    <button
                      key={semester.id}
                      onClick={() => handleNavigation(semester.id)}
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-300 group ${
                        activeView === semester.id
                          ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-400 shadow-lg scale-105'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:shadow-md hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-3" />
                        <div>
                          <span className="text-sm font-medium block">{semester.name}</span>
                          {hasSubjects && semesterData && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              GPA: {semesterData.gpa.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      {hasSubjects && (
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400 text-xs px-2 py-1 rounded-full font-medium">
                          {semesterData?.subjects.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              GPA Calculator Pro v2.0
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
              Academic Excellence Tracker
            </p>
          </div>
        </div>
      </div>
    </>
  );
}