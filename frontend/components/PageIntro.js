'use client';

import { motion } from 'framer-motion';

export default function PageIntro({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <h1 className="font-heading font-bold text-3xl md:text-4xl">{title}</h1>
      <p className="text-muted mt-2">{subtitle}</p>
    </motion.div>
  );
}
