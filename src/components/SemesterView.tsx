import React, { useState } from 'react';
import { Subject } from '../types';
import { SubjectForm } from './SubjectForm';
import { calculateSemesterGPA, getGPAStatus, GRADE_SCALE } from '../utils/gradeCalculations';
import { Plus, Edit, Trash2, BookOpen, Award, Star, TrendingUp } from 'lucide-react';

interface SemesterViewProps {
  semesterId: number;
  semesterName: string;
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

export function SemesterView({
  semesterId,
  semesterName,
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
}: SemesterViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();

  const gpa = calculateSemesterGPA(subjects);
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.creditHours, 0);
  const gpaStatus = getGPAStatus(gpa);

  const handleSave = (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSubject) {
      onEditSubject({
        ...editingSubject,
        ...subjectData,
        updatedAt: new Date(),
      });
    } else {
      onAddSubject(subjectData);
    }
    setShowForm(false);
    setEditingSubject(undefined);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubject(undefined);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Semester Header */}
      <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4">
              <Star className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{semesterName}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {subjects.length} subjects • {totalCredits} credit hours
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Subject
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mr-3">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Semester GPA</p>
                <p className={`text-2xl font-bold ${gpaStatus.color}`}>
                  {gpa.toFixed(2)}
                </p>
                <p className={`text-xs ${gpaStatus.color}`}>
                  {gpaStatus.status}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCredits}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {subjects.length} subjects
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Performance</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {subjects.filter(s => ['A+', 'A', 'A-'].includes(s.grade)).length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  A-grade subjects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No subjects added yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Start by adding your first subject to track your GPA for this semester.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg font-semibold"
          >
            Add Your First Subject
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              📚 Subject List
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your subjects and track individual performance
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {subjects.map((subject) => (
              <div key={subject.id} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700/50 dark:hover:to-blue-900/10 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {subject.name}
                    </h4>
                    <div className="flex items-center space-x-6 mt-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {subject.creditHours} credits
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        GRADE_SCALE[subject.grade] >= 3.5 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : GRADE_SCALE[subject.grade] >= 3.0
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : GRADE_SCALE[subject.grade] >= 2.0
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {subject.grade} • {GRADE_SCALE[subject.grade]} GPA
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEdit(subject)}
                      className="p-3 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeleteSubject(subject.id)}
                      className="p-3 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Form Modal */}
      {showForm && (
        <SubjectForm
          subject={editingSubject}
          semesterId={semesterId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}