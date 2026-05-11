'use client';
import Link from 'next/link';
import { FileBarChart, GraduationCap, DollarSign, FolderKanban, Download, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

const reports = [
  {
    title: 'Student Report',
    desc: 'Statistics by education level, monthly admissions, and gender breakdown',
    icon: GraduationCap,
    color: 'bg-blue-50 text-blue-600',
    pdf: 'http://localhost:8000/reports/students/pdf/',
    web: 'http://localhost:8000/reports/students/',
  },
  {
    title: 'Financial Report',
    desc: 'Donations vs expenses, monthly trends, category-wise breakdown',
    icon: DollarSign,
    color: 'bg-green-50 text-green-600',
    pdf: 'http://localhost:8000/reports/financial/pdf/',
    web: 'http://localhost:8000/reports/financial/',
  },
  {
    title: 'Project Report',
    desc: 'Active projects, budget utilization, beneficiaries served',
    icon: FolderKanban,
    color: 'bg-purple-50 text-purple-600',
    pdf: 'http://localhost:8000/reports/projects/pdf/',
    web: 'http://localhost:8000/reports/projects/',
  },
];

export default function ReportsPage() {
  return (
    <AdminLayout title="Reports">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        Click <strong>View</strong> to see a report in your browser, or <strong>Download PDF</strong> to save a printable copy.
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="bg-white rounded-xl shadow-soft p-6">
              <div className={`w-14 h-14 rounded-lg ${r.color} flex items-center justify-center mb-4`}>
                <Icon size={28} />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{r.title}</h3>
              <p className="text-sm text-gray-600 mb-5">{r.desc}</p>
              <div className="flex flex-col gap-2">
                <a href={r.web} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-dwt-500 text-white text-sm font-semibold rounded-lg hover:bg-dwt-600">
                  <ExternalLink size={14} /> View Report
                </a>
                <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-dwt-500 text-dwt-500 text-sm font-semibold rounded-lg hover:bg-dwt-50">
                  <Download size={14} /> Download PDF
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
