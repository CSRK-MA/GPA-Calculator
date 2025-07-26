import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { GRADES } from '../utils/gradeCalculations';
import { X, Save, Plus } from 'lucide-react';

interface SubjectFormProps {
  subject?: Subject;
  semesterId: number;
  onSave: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SubjectForm({ subject, semesterId, onSave, onCancel }: SubjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    creditHours: 3,
    grade: 'A',
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        creditHours: subject.creditHours,
        grade: subject.grade,
      });
    }
  }, [subject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.creditHours > 0) {
      onSave({
        ...formData,
        semesterId,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform animate-slideUp">
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-2xl">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {subject ? 'Edit Subject' : 'Add New Subject'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {subject ? 'Update subject information' : 'Enter subject details'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Subject Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
              placeholder="e.g., Advanced Calculus"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Credit Hours
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.creditHours}
              onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Grade
            </label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
            >
              {GRADES.map(grade => (
                <option key={grade} value={grade}>{grade} ({GRADE_SCALE[grade]} GPA)</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg font-semibold"
            >
              <Save className="h-5 w-5 mr-2" />
              {subject ? 'Update Subject' : 'Add Subject'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}