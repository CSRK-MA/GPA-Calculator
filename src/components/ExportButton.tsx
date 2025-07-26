import React from 'react';
import { Semester } from '../types';
import { calculateCGPA, calculateSemesterGPA } from '../utils/gradeCalculations';
import { Download, FileText, Share } from 'lucide-react';

interface ExportButtonProps {
  semesters: Semester[];
}

export function ExportButton({ semesters }: ExportButtonProps) {
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

  const exportToJSON = () => {
    const allSubjects = semesters.flatMap(s => s.subjects);
    const exportData = {
      exportDate: new Date().toISOString(),
      cgpa: calculateCGPA(semesters),
      totalCredits: semesters.reduce((acc, sem) => acc + sem.subjects.reduce((sum, sub) => sum + sub.creditHours, 0), 0),
      subjects: allSubjects,
      semesters: semesters.filter(s => s.subjects.length > 0)
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gpa-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="hidden lg:flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <button
        onClick={exportToPDF}
        className="flex items-center justify-center px-2 lg:px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs lg:text-sm"
      >
        <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
        <span className="hidden sm:inline">Export </span>PDF
      </button>
      <button
        onClick={exportToCSV}
        className="flex items-center justify-center px-2 lg:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs lg:text-sm"
      >
        <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
        <span className="hidden sm:inline">Export </span>CSV
      </button>
    </div>
  );
}