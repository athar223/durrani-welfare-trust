'use client';
import { useState } from 'react';
import { Database, Download, Upload, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { getToken } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BackupPage() {
  const [importing, setImporting] = useState(false);

  function handleDownload() {
    const token = getToken();
    if (!token) { toast.error('Not authenticated'); return; }
    // Backend backup endpoint uses session auth - open via Django's legacy URL
    window.open(`${API_BASE}/backup/export/`, '_blank');
  }

  async function handleImport(file: File) {
    if (!confirm('This will REPLACE the current database. Are you absolutely sure?')) return;
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append('db_file', file);
      const res = await fetch(`${API_BASE}/backup/import/`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Database imported. Restart the server to apply.');
      } else {
        toast.error('Import failed');
      }
    } catch {
      toast.error('Import failed');
    } finally { setImporting(false); }
  }

  return (
    <AdminLayout title="Backup & Restore">
      <div className="max-w-3xl space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Important:</strong> Backups contain all student records, donations, staff data, and other sensitive information. Store them securely. Imports overwrite the current database — make a backup before importing.
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-dwt-50 flex items-center justify-center text-dwt-500"><Download size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-lg">Export Database</h3>
              <p className="text-sm text-gray-600">Download a complete copy of the database as a SQLite file</p>
            </div>
          </div>
          <button onClick={handleDownload} className="inline-flex items-center gap-2 px-5 py-2.5 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600">
            <Download size={16} /> Download Backup
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500"><Upload size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-lg">Import / Restore Database</h3>
              <p className="text-sm text-gray-600">Replace the current database with a previously exported backup</p>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 cursor-pointer">
            <Upload size={16} /> {importing ? 'Importing...' : 'Choose Backup File'}
            <input type="file" accept=".sqlite3,.db" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }} disabled={importing} />
          </label>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Database size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-lg">Database Info</h3>
              <p className="text-sm text-gray-600">Current database settings</p>
            </div>
          </div>
          <dl className="text-sm space-y-2 mt-4">
            <div className="flex justify-between border-b border-gray-100 pb-2"><dt className="text-gray-600">Engine</dt><dd className="font-semibold">SQLite (or PostgreSQL if configured)</dd></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><dt className="text-gray-600">Backend URL</dt><dd className="font-mono text-xs">{API_BASE}</dd></div>
          </dl>
        </div>
      </div>
    </AdminLayout>
  );
}
