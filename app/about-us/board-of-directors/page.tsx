import React from 'react';
import SubHeroSection from '../../components/SubHeroSection';
import TeamMemberCard, { TeamMember } from '../../components/TeamMemberCard';

const boardMembers: TeamMember[] = [
  {
    name: 'Chairman One',
    role: 'Chairman',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1200',
    phone: '9800000001',
    email: 'chairman.one@himalayaagro.com',
    address: 'Central Office, Kathmandu',
  },
  {
    name: 'Director One',
    role: 'Director',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
    phone: '9800000002',
    email: 'director.one@himalayaagro.com',
    address: 'Regional Office, Baglung',
  },
  {
    name: 'Director Two',
    role: 'Director',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200',
    phone: '9800000003',
    email: 'director.two@himalayaagro.com',
    address: 'Regional Office, Pokhara',
  },
  {
    name: 'Director Three',
    role: 'Public Director',
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&q=80&w=1200',
    phone: '9800000004',
    email: 'director.three@himalayaagro.com',
    address: 'Project Office, Butwal',
  },
  {
    name: 'Director Four',
    role: 'Independent Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1200',
    phone: '9800000005',
    email: 'director.four@himalayaagro.com',
    address: 'Corporate Office, Chitwan',
  },
  {
    name: 'Company Secretary One',
    role: 'Company Secretary',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200',
    phone: '9800000006',
    email: 'secretary@himalayaagro.com',
    address: 'Head Office, Kathmandu',
  },
];

export default function BoardOfDirectorsPage() {
  return (
    <>
      <SubHeroSection
        title="Board of Directors"
        tag="About Us"
        description="The board provides governance, oversight, and long-term direction for the organisation's growth and accountability."
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000"
        overlay="dark"
      />

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0d837f]">Leadership Grid</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Board members
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              This grid is CMS-ready. Each profile card can later be edited by the admin panel without changing the page structure.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {boardMembers.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
