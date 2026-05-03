import React from 'react';
import SubHeroSection from '../../components/SubHeroSection';
import TeamMemberCard, { TeamMember } from '../../components/TeamMemberCard';

const executiveTeam: TeamMember[] = [
  {
    name: 'Managing Director One',
    role: 'Managing Director',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1200',
    phone: '9810000001',
    email: 'md.one@himalayaagro.com',
    address: 'Executive Office, Kathmandu',
  },
  {
    name: 'Operations Lead One',
    role: 'Chief Operating Officer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
    phone: '9810000002',
    email: 'operations@himalayaagro.com',
    address: 'Operations Division, Baglung',
  },
  {
    name: 'Sales Lead One',
    role: 'Sales Director',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200',
    phone: '9810000003',
    email: 'sales@himalayaagro.com',
    address: 'Sales Division, Pokhara',
  },
  {
    name: 'Finance Lead One',
    role: 'Finance Manager',
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&q=80&w=1200',
    phone: '9810000004',
    email: 'finance@himalayaagro.com',
    address: 'Finance Desk, Butwal',
  },
  {
    name: 'HR Lead One',
    role: 'Human Resources Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1200',
    phone: '9810000005',
    email: 'hr@himalayaagro.com',
    address: 'People Team, Chitwan',
  },
  {
    name: 'Systems Lead One',
    role: 'IT & Systems Lead',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200',
    phone: '9810000006',
    email: 'systems@himalayaagro.com',
    address: 'Technology Office, Kathmandu',
  },
];

export default function ExecutiveTeamPage() {
  return (
    <>
      <SubHeroSection
        title="Executive Team"
        tag="About Us"
        description="Our executive team turns strategy into action through operations, finance, sales, people, and digital systems."
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000"
        overlay="dark"
      />

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0d837f]">Management Grid</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Executive leadership
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Each card is a placeholder for CMS-managed executive profiles, ready to be replaced with live backend content.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {executiveTeam.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
