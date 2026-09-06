'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="my-10 bg-white rounded-2xl p-6 sm:p-8 border border-cream-200 shadow-sm not-prose">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-forest-700" />
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 m-0">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-cream-200 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left font-serif font-bold text-sm sm:text-base text-stone-900 bg-cream-50/50 hover:bg-cream-100/60 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-forest-700 shrink-0 ml-2 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="p-4 bg-white text-stone-600 text-sm leading-relaxed border-t border-cream-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
