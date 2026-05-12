import Link from 'next/link';
import { FileText, Download, Eye, TrendingUp, Heart, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const reports = [
  { year: '2025', title: 'Annual Report 2025', size: '2.4 MB', highlight: 'Latest', desc: '500+ students supported, 50+ medical camps, 25 community projects completed.' },
  { year: '2024', title: 'Annual Report 2024', size: '2.1 MB', desc: '450 students enrolled, ambulance fleet expanded to 5 vehicles.' },
  { year: '2023', title: 'Annual Report 2023', size: '1.9 MB', desc: 'Healthcare expansion, women empowerment programs launched.' },
  { year: '2022', title: 'Annual Report 2022', size: '1.7 MB', desc: 'Post-pandemic recovery, scholarship doubled.' },
  { year: '2021', title: 'Annual Report 2021', size: '1.6 MB', desc: 'COVID-19 relief operations across multiple cities.' },
  { year: '2020', title: 'Annual Report 2020', size: '1.4 MB', desc: 'Pandemic response — food, masks, oxygen distribution.' },
];

const audits = [
  { year: '2025', firm: 'KPMG Pakistan', status: 'Clean Opinion' },
  { year: '2024', firm: 'KPMG Pakistan', status: 'Clean Opinion' },
  { year: '2023', firm: 'A.F. Ferguson & Co.', status: 'Clean Opinion' },
  { year: '2022', firm: 'A.F. Ferguson & Co.', status: 'Clean Opinion' },
];

export default function AnnualReportsPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Annual Reports & Transparency"
        subtitle="Open access to our financial reports, audits, and impact statements"
        breadcrumb="About"
      />

      {/* Highlights */}
      <section className="section-padding bg-white">
        <div className="container-page max-w-6xl">
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="card p-6 text-center">
              <Heart className="mx-auto text-rose-500 mb-3" size={32} />
              <div className="text-3xl font-heading font-bold text-dwt-700">PKR 50M+</div>
              <div className="text-sm text-gray-600 mt-1">Total Donations Received (2025)</div>
            </div>
            <div className="card p-6 text-center">
              <Users className="mx-auto text-blue-500 mb-3" size={32} />
              <div className="text-3xl font-heading font-bold text-dwt-700">5,000+</div>
              <div className="text-sm text-gray-600 mt-1">Beneficiaries Served</div>
            </div>
            <div className="card p-6 text-center">
              <TrendingUp className="mx-auto text-dwt-500 mb-3" size={32} />
              <div className="text-3xl font-heading font-bold text-dwt-700">95%</div>
              <div className="text-sm text-gray-600 mt-1">Funds Directly to Programs</div>
            </div>
          </div>

          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Durrani Welfare Trust is committed to the highest standards of transparency.
            All our annual reports, audited financial statements, and impact assessments are
            publicly available below.
          </p>

          {/* Reports list */}
          <h2 className="font-heading font-bold text-2xl mb-6 text-dwt-800">Annual Reports</h2>
          <div className="space-y-3 mb-12">
            {reports.map((r) => (
              <div key={r.year} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-dwt-50 text-dwt-600 flex items-center justify-center flex-shrink-0">
                  <FileText size={26} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-bold text-lg">{r.title}</h3>
                    {r.highlight && (
                      <span className="px-2 py-0.5 bg-dwt-500 text-white text-xs font-semibold rounded">
                        {r.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{r.desc}</p>
                  <div className="text-xs text-gray-500 mt-1">PDF • {r.size}</div>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1 px-4 py-2 border border-dwt-500 text-dwt-500 text-sm font-semibold rounded-lg hover:bg-dwt-50">
                    <Eye size={14} /> View
                  </button>
                  <button className="inline-flex items-center gap-1 px-4 py-2 bg-dwt-500 text-white text-sm font-semibold rounded-lg hover:bg-dwt-600">
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Audit summary */}
          <h2 className="font-heading font-bold text-2xl mb-6 text-dwt-800">Independent Audits</h2>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-dwt-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-dwt-800 uppercase">Year</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-dwt-800 uppercase">Audit Firm</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-dwt-800 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {audits.map((a) => (
                  <tr key={a.year}>
                    <td className="px-5 py-3 font-bold text-gray-900">{a.year}</td>
                    <td className="px-5 py-3 text-gray-700">{a.firm}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 bg-dwt-50 p-6 rounded-xl text-center">
            <p className="text-gray-700 mb-3">
              Have questions about our reports or financial details? We are happy to provide additional information.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600">
              Contact Our Finance Team
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
