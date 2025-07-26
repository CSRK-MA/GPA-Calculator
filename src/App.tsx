import React, { useState, useEffect } from 'react';
import { Subject, Semester } from './types';
import { database } from './services/database';
import { calculateSemesterGPA } from './utils/gradeCalculations';
import { Dashboard } from './components/Dashboard';
import { SemesterView } from './components/SemesterView';
import { ExportButton } from './components/ExportButton';
import { ImportButton } from './components/ImportButton';
import { AnimatedBackground } from './components/AnimatedBackground';
import { PreloadingScreen } from './components/PreloadingScreen';
import { MobileNavigation } from './components/MobileNavigation';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { 
  GraduationCap, 
  Calendar, 
  Sun, 
  Moon, 
  Home,
  Sparkles
} from 'lucide-react';

const SEMESTERS_CONFIG = [
  { id: 1, name: 'Level 1 Semester I', year: 1 },
  { id: 2, name: 'Level 1 Semester II', year: 1 },
  { id: 3, name: 'Level 2 Semester I', year: 2 },
  { id: 4, name: 'Level 2 Semester II', year: 2 },
  { id: 5, name: 'Level 3 Semester I', year: 3 },
  { id: 6, name: 'Level 3 Semester II', year: 3 },
  { id: 7, name: 'Level 4 Semester I', year: 4 },
  { id: 8, name: 'Level 4 Semester II', year: 4 },
];

function AppContent() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | number>('dashboard');
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Simulate minimum loading time for better UX
      const startTime = Date.now();
      await database.init();
      await loadData();
      
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 2000; // 2 seconds minimum
      
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const allSubjects = await database.getAllSubjects();
      
      const semesterData = SEMESTERS_CONFIG.map(config => {
        const semesterSubjects = allSubjects.filter(s => s.semesterId === config.id);
        return {
          id: config.id,
          name: config.name,
          year: config.year,
          subjects: semesterSubjects,
          gpa: calculateSemesterGPA(semesterSubjects),
        };
      });
      
      setSemesters(semesterData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const addSubject = async (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const subject: Subject = {
        ...subjectData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await database.addSubject(subject);
      await loadData();
    } catch (error) {
      console.error('Failed to add subject:', error);
    }
  };

  const editSubject = async (subject: Subject) => {
    try {
      await database.updateSubject(subject);
      await loadData();
    } catch (error) {
      console.error('Failed to update subject:', error);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await database.deleteSubject(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete subject:', error);
    }
  };

  const exportToPDF = () => {
    const cgpa = calculateCGPA(semesters);
    const totalCredits = semesters.reduce((acc, sem) => acc + sem.subjects.reduce((sum, sub) => sum + sub.creditHours, 0), 0);
    
    const content = `
      <html>
        <head>
          <title>GPA Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .semester { margin-bottom: 20px; }
            .semester h3 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .gpa-value { font-weight: bold; color: #2563eb; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Academic Performance Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <h2>Summary</h2>
            <p><strong>Cumulative GPA (CGPA):</strong> <span class="gpa-value">${cgpa.toFixed(2)}</span></p>
            <p><strong>Total Credit Hours:</strong> ${totalCredits}</p>
            <p><strong>Completed Semesters:</strong> ${semesters.filter(s => s.subjects.length > 0).length}</p>
          </div>
          
          ${semesters.filter(s => s.subjects.length > 0).map(semester => `
            <div class="semester">
              <h3>${semester.name} - GPA: ${semester.gpa.toFixed(2)}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Credit Hours</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  ${semester.subjects.map(subject => `
                    <tr>
                      <td>${subject.name}</td>
                      <td>${subject.creditHours}</td>
                      <td>${subject.grade}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gpa-report.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const rows = [
      ['Semester', 'Subject', 'Credit Hours', 'Grade', 'Semester GPA']
    ];
    
    semesters.filter(s => s.subjects.length > 0).forEach(semester => {
      semester.subjects.forEach((subject, index) => {
        rows.push([
          index === 0 ? semester.name : '',
          subject.name,
          subject.creditHours.toString(),
          subject.grade,
          index === 0 ? semester.gpa.toFixed(2) : ''
        ]);
      });
    });
    
    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gpa-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (importedSubjects: Subject[]) => {
    try {
      for (const subject of importedSubjects) {
        await database.addSubject({
          ...subject,
          id: Date.now().toString() + Math.random(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      await loadData();
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Failed to import data. Please try again.');
    }
  };

  // Show preloading screen
  if (initialLoading) {
    return <PreloadingScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Loading your GPA data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors relative">
      <AnimatedBackground />
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        activeView={activeView}
        setActiveView={setActiveView}
        semesters={semesters}
        semestersConfig={SEMESTERS_CONFIG}
        onExportPDF={exportToPDF}
        onExportCSV={exportToCSV}
        onImportData={() => {}}
      />
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center ml-20 lg:ml-0">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
                <GraduationCap className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GPA Calculator Pro
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Academic Excellence Tracker
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 lg:space-x-6">
              <ExportButton semesters={semesters} />
              <div className="hidden lg:block">
                <ImportButton onImport={handleImportData} />
              </div>
              <button
                onClick={toggleTheme}
                className="hidden lg:block p-2 lg:p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                {theme === 'light' ? <Moon className="h-5 w-5 lg:h-6 lg:w-6" /> : <Sun className="h-5 w-5 lg:h-6 lg:w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header Spacer */}
      <div className="lg:hidden h-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-32">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                  Navigation
                </h2>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                    activeView === 'dashboard'
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-400 shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:shadow-md'
                  }`}
                >
                  <Home className="h-5 w-5 mr-3" />
                  <span className="font-medium">Dashboard</span>
                </button>

                <div className="pt-4">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4">
                    Academic Years
                  </p>
                  <div className="space-y-2">
                    {SEMESTERS_CONFIG.map((semester) => {
                      const semesterData = semesters.find(s => s.id === semester.id);
                      const hasSubjects = semesterData?.subjects.length > 0;
                      
                      return (
                        <button
                          key={semester.id}
                          onClick={() => setActiveView(semester.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                            activeView === semester.id
                              ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-400 shadow-md'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-3" />
                            <div>
                              <span className="text-sm font-medium">{semester.name}</span>
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
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            {activeView === 'dashboard' ? (
              <Dashboard semesters={semesters} />
            ) : (
              (() => {
                const semester = semesters.find(s => s.id === activeView);
                const config = SEMESTERS_CONFIG.find(c => c.id === activeView);
                return semester && config ? (
                  <SemesterView
                    semesterId={semester.id}
                    semesterName={semester.name}
                    subjects={semester.subjects}
                    onAddSubject={addSubject}
                    onEditSubject={editSubject}
                    onDeleteSubject={deleteSubject}
                  />
                ) : null;
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;