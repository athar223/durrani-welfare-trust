'use client';
import { useEffect, useState, ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  fetcher: (params: any) => Promise<{ data: any }>;
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchParam?: string;
  filters?: ReactNode;
  filterParams?: Record<string, any>;
  addLink?: string;
  addLabel?: string;
  rowLink?: (row: T) => string;
  emptyMessage?: string;
  refreshKey?: number;
}

export default function DataTable<T extends { id: number }>({
  fetcher,
  columns,
  searchPlaceholder = 'Search...',
  searchParam = 'search',
  filters,
  filterParams = {},
  addLink,
  addLabel = 'Add New',
  rowLink,
  emptyMessage = 'No records found',
  refreshKey = 0,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params: any = { page, ...filterParams };
    if (search) params[searchParam] = search;
    fetcher(params)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(res.data);
          setCount(res.data.length);
          setHasNext(false);
        } else {
          setData(res.data.results || []);
          setCount(res.data.count || 0);
          setHasNext(!!res.data.next);
        }
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [search, page, JSON.stringify(filterParams), refreshKey]);

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-dwt-500 focus:border-transparent outline-none"
            />
          </div>
          {filters}
        </div>
        <div className="flex gap-2">
          {addLink && (
            <Link href={addLink} className="inline-flex items-center gap-1 px-4 py-2 bg-dwt-500 text-white text-sm font-semibold rounded-lg hover:bg-dwt-600">
              <Plus size={16} /> {addLabel}
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw size={24} className="mx-auto animate-spin text-dwt-500" />
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-gray-500">{emptyMessage}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ${col.className || ''}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => {
                    const content = col.render ? col.render(row) : (row as any)[col.key];
                    return (
                      <td key={col.key} className={`px-4 py-3 text-sm ${col.className || ''}`}>
                        {rowLink && col === columns[0] ? (
                          <Link href={rowLink(row)} className="text-dwt-600 hover:underline font-semibold">
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && count > 0 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Page {page} • {count} total record{count !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!hasNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
