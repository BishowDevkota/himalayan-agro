"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf01Icon, PolicyIcon, UserGroupIcon } from "hugeicons-react";

type Props = { imageSrc?: string };

const badgeItems = [
  { icon: UserGroupIcon, label: "Leadership" },
  { icon: Leaf01Icon, label: "Agriculture" },
  { icon: PolicyIcon, label: "Public Administration" },
];

export default function HeroSection({ imageSrc }: Props) {
  return (
    <section id="hero" className="bg-white py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-6xl px-4"
      >
        <div className="overflow-hidden rounded-3xl border border-[#1C2B14]/10 bg-white shadow-[0_24px_60px_rgba(28,43,20,0.08)]">
          <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[280px_1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex justify-center lg:justify-start"
            >
              <div className="relative h-44 w-44 overflow-hidden rounded-full border-[10px] border-[#1C2B14]/10 bg-[#f6fbf4] shadow-[0_18px_50px_rgba(28,43,20,0.18)] md:h-56 md:w-56">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt="Dolindra Prasad Sharma"
                    fill
                    sizes="(max-width: 768px) 176px, 224px"
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#1C2B14] text-4xl font-black text-white md:text-5xl">
                    DPS
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
              className="space-y-4 text-center lg:text-left"
            >
              <span className="inline-flex items-center rounded-full border border-[#1C2B14]/10 bg-[#1C2B14]/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#1C2B14]">
                About the Managing Director
              </span>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-3xl font-bold tracking-tight text-[#1C2B14] md:text-5xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Dolindra Prasad Sharma
              </motion.h1>

              <p className="text-sm font-semibold text-[#4c6b3f] md:text-base">
                Managing Director · Himalaya Nepal Krishi Company Limited
              </p>

              <p className="mx-auto max-w-3xl text-sm leading-7 text-gray-700 lg:mx-0 md:text-base">
                Dolindra Prasad Sharma is a leader with a zealous spirit and a proven record in leading organisations through complex challenges while promoting agricultural development and public service.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {badgeItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.08 * index }}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-[#1C2B14]/10 bg-[#1C2B14]/5 px-4 py-3 text-sm font-semibold text-[#1C2B14]"
                    >
                      <Icon size={18} strokeWidth={1.9} className="text-[#4c6b3f]" />
                      <span>{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
