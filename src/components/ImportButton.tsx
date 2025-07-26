import React, { useRef } from 'react';
import { Subject } from '../types';
import { Upload, AlertCircle } from 'lucide-react';

interface ImportButtonProps {
  onImport: (subjects: Subject[]) => void;
}

export function ImportButton({ onImport }: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          if (Array.isArray(data) && data.length > 0) {
            // Validate the structure
            const isValidStructure = data.every(item => 
              item.id && item.name && item.creditHours && item.grade && item.semesterId
            );
            
            if (isValidStructure) {
              onImport(data);
              alert('Data imported successfully!');
            } else {
              alert('Invalid file format. Please ensure the JSON contains valid subject data.');
            }
          } else {
            alert('No valid data found in the file.');
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          
          if (headers.includes('Subject') && headers.includes('Grade') && headers.includes('Credit Hours')) {
            const subjects: Subject[] = [];
            
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',');
              if (values.length >= 4) {
                subjects.push({
                  id: Date.now().toString() + i,
                  name: values[1].trim(),
                  creditHours: parseInt(values[2].trim()) || 3,
                  grade: values[3].trim(),
                  semesterId: 1, // Default to first semester
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }
            }
            
            if (subjects.length > 0) {
              onImport(subjects);
              alert(`Imported ${subjects.length} subjects successfully!`);
            } else {
              alert('No valid subjects found in the CSV file.');
            }
          } else {
            alert('Invalid CSV format. Please ensure it has Subject, Grade, and Credit Hours columns.');
          }
        } else {
          alert('Please select a JSON or CSV file.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing file. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <>
      <button
        onClick={handleImport}
        className="flex items-center justify-center px-2 lg:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs lg:text-sm"
      >
        <Upload className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
        <span className="hidden sm:inline">Import </span>Data
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}