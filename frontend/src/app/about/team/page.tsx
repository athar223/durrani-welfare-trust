import Link from 'next/link';
import { Mail, Linkedin, Phone, Award, Users, Briefcase } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

interface Person {
  name: string;
  role: string;
  bio: string;
  initials: string;
  photo?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  category: 'leadership' | 'board' | 'department';
  department?: string;
}

const team: Person[] = [
  // Leadership
  {
    name: 'Mr. Waheed Faraz Durrani',
    role: 'Chairman & Founder',
    bio: 'Visionary social leader who founded the Durrani Welfare Trust to uplift underprivileged women and children through education, healthcare, and welfare initiatives across Pakistan.',
    initials: 'WD',
    photo: '/team/chairman.jpeg',
    email: 'chairman@duraniwelfaretrust.org',
    category: 'leadership',
  },
  {
    name: 'Mr. Aman Faraz Durrani',
    role: 'Chief Executive Officer',
    bio: 'Leads day-to-day operations of the Trust, drives strategic initiatives, and ensures every program delivers maximum impact to beneficiaries across the country.',
    initials: 'AD',
    photo: '/team/ceo.jpeg',
    email: 'ceo@duraniwelfaretrust.org',
    category: 'leadership',
  },
  {
    name: 'Mrs. Aisha Iqbal',
    role: 'Vice Chairperson',
    bio: 'Leads the women empowerment and child welfare initiatives, focusing on education access for girls and skill development programs.',
    initials: 'AI',
    email: 'vicechair@duraniwelfaretrust.org',
    category: 'leadership',
  },

  // Board members
  {
    name: 'Dr. Sara Ahmed',
    role: 'Board Member — Healthcare',
    bio: 'Senior physician with 20+ years of experience. Heads the medical committee and ambulance service oversight.',
    initials: 'SA',
    category: 'board',
  },
  {
    name: 'Mr. Ali Raza',
    role: 'Board Member — Finance',
    bio: 'Chartered accountant ensuring financial transparency, audit compliance, and donor accountability.',
    initials: 'AR',
    category: 'board',
  },
  {
    name: 'Prof. Imran Hussain',
    role: 'Board Member — Education',
    bio: 'Former university professor leading the educational scholarship and curriculum committee.',
    initials: 'IH',
    category: 'board',
  },
  {
    name: 'Mr. Yasir Mahmood',
    role: 'Board Member — Operations',
    bio: 'Operations strategist responsible for community projects and field-level program implementation.',
    initials: 'YM',
    category: 'board',
  },

  // Department heads
  {
    name: 'Ms. Fatima Sheikh',
    role: 'Head of Education Programs',
    bio: 'Manages all student support programs, school partnerships, and scholarship distribution.',
    initials: 'FS',
    category: 'department',
    department: 'Education',
  },
  {
    name: 'Dr. Hassan Tariq',
    role: 'Head of Medical Services',
    bio: 'Coordinates medical camps, hospital partnerships, ambulance fleet, and emergency response.',
    initials: 'HT',
    category: 'department',
    department: 'Healthcare',
  },
  {
    name: 'Mr. Naveed Akhtar',
    role: 'Head of Finance & Accounts',
    bio: 'Oversees donations, expenses, payroll, and prepares quarterly financial reports for the board.',
    initials: 'NA',
    category: 'department',
    department: 'Finance',
  },
  {
    name: 'Ms. Hina Bukhari',
    role: 'Head of Volunteer & Community',
    bio: 'Recruits, trains, and manages volunteers; coordinates community outreach and donor relations.',
    initials: 'HB',
    category: 'department',
    department: 'Volunteers',
  },
  {
    name: 'Mr. Bilal Sajid',
    role: 'Head of Operations',
    bio: 'Manages logistics, vehicle fleet, daily operations, and field staff coordination.',
    initials: 'BS',
    category: 'department',
    department: 'Operations',
  },
];

function PersonCard({ p, large = false }: { p: Person; large?: boolean }) {
  const size = large ? 'w-32 h-32 text-3xl' : 'w-24 h-24 text-2xl';
  return (
    <div className="card overflow-hidden text-center group hover:-translate-y-1 transition-transform duration-300">
      <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 py-8 relative">
        {p.photo ? (
          <img
            src={p.photo}
            alt={p.name}
            className={`${size} mx-auto rounded-full object-cover shadow-card border-4 border-white/95`}
          />
        ) : (
          <div className={`${size} mx-auto rounded-full bg-white/95 text-dwt-700 flex items-center justify-center font-heading font-bold shadow-card`}>
            {p.initials}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className={`font-heading font-bold ${large ? 'text-xl' : 'text-lg'} mb-1`}>{p.name}</h3>
        <p className="text-dwt-600 font-semibold text-sm mb-3">{p.role}</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{p.bio}</p>
        <div className="flex justify-center gap-2 pt-3 border-t border-gray-100">
          {p.email && (
            <a href={`mailto:${p.email}`} className="w-8 h-8 rounded-full bg-dwt-50 text-dwt-600 hover:bg-dwt-500 hover:text-white flex items-center justify-center transition-all">
              <Mail size={14} />
            </a>
          )}
          {p.phone && (
            <a href={`tel:${p.phone}`} className="w-8 h-8 rounded-full bg-dwt-50 text-dwt-600 hover:bg-dwt-500 hover:text-white flex items-center justify-center transition-all">
              <Phone size={14} />
            </a>
          )}
          {p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-dwt-50 text-dwt-600 hover:bg-dwt-500 hover:text-white flex items-center justify-center transition-all">
              <Linkedin size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const leadership = team.filter((p) => p.category === 'leadership');
  const board = team.filter((p) => p.category === 'board');
  const departments = team.filter((p) => p.category === 'department');

  return (
    <PublicLayout>
      <PageHeader
        title="Leadership & Team"
        subtitle="Meet the dedicated people leading Durrani Welfare Trust's mission of service to humanity"
        breadcrumb="About"
      />

      {/* Leadership */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <Award size={16} /> Executive Leadership
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
              Our Leadership
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Visionary leaders guiding the Trust toward greater impact and accountability.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((p) => (
              <PersonCard key={p.name} p={p} large />
            ))}
          </div>
        </div>
      </section>

      {/* Board */}
      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <Briefcase size={16} /> Governance
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
              Board of Directors
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our independent board provides strategic oversight and ensures the Trust upholds the highest standards of governance and transparency.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {board.map((p) => (
              <PersonCard key={p.name} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Department heads */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <Users size={16} /> Department Heads
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
              Operational Leadership
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Experienced professionals managing day-to-day operations across our welfare programs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((p) => (
              <PersonCard key={p.name} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Join us CTA */}
      <section className="py-16 bg-gradient-to-r from-dwt-700 to-dwt-500 text-white">
        <div className="container-page text-center">
          <h2 className="font-heading font-bold text-3xl mb-4">Join Our Team</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-100">
            We are always looking for passionate individuals who want to make a difference.
            Apply to become a volunteer or check our career openings.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/volunteer" className="px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50">
              Become a Volunteer
            </Link>
            <Link href="/contact" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
              Contact HR
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
