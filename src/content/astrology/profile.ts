export type AstrologyFaqItem = {
  question: string;
  answer: string;
};

export type AstrologyService = {
  title: string;
  description: string;
};

export type AstrologyProcessStep = {
  title: string;
  description: string;
};

export type AstrologyBenefit = {
  title: string;
  description: string;
};

export const astrologyContent = {
  brand: "ASTROEYE",
  brandDescription:
    "Personalised astrology guidance for life decisions, relationships, business and clarity through private consultation.",
  astrologer: {
    name: "The Astrologer",
    shortBio:
      "Astroeye offers calm, personal guidance for life questions, important decisions and deeper self-understanding through astrology consultations.",
    experience: "Private consultation guidance rooted in personal questions and chart interpretation.",
    specialisation:
      "Career, relationships, marriage, business, life transitions and birth chart clarity.",
    languages: ["English", "Hindi"],
  },
  hero: {
    eyebrow: "ASTROLOGY CONSULTATION",
    heading: "Clarity for\nyour next chapter.",
    supportingText:
      "Personalised astrology consultations for career, relationships, marriage, business, birth charts and important life decisions.",
  },
  services: [
    {
      title: "Career & Profession",
      description:
        "Understand professional questions, transitions and career-related concerns.",
    },
    {
      title: "Marriage & Relationships",
      description:
        "Explore relationship questions, compatibility and important decisions.",
    },
    {
      title: "Birth Chart Analysis",
      description:
        "Personalised interpretation based on birth details and planetary placements.",
    },
    {
      title: "Business & Finance",
      description:
        "Guidance around business decisions, growth and important financial questions.",
    },
    {
      title: "Life Guidance",
      description:
        "For periods of uncertainty, transition or important personal decisions.",
    },
    {
      title: "Muhurat & Timing",
      description:
        "Guidance around suitable timings for important events.",
    },
  ] as AstrologyService[],
  process: [
    {
      title: "Join the Community",
      description: "Connect through the Astroeye WhatsApp community.",
    },
    {
      title: "Share Your Question",
      description: "Share the area you want guidance on.",
    },
    {
      title: "Connect for Consultation",
      description: "Follow the consultation process communicated through WhatsApp.",
    },
    {
      title: "Gain Clarity",
      description: "Have a focused discussion around your questions.",
    },
  ] as AstrologyProcessStep[],
  benefits: [
    {
      title: "PERSONALISED",
      description: "Consultation centred around individual birth details and questions.",
    },
    {
      title: "PRIVATE",
      description: "Personal consultation information should be treated respectfully.",
    },
    {
      title: "FOCUSED",
      description: "The conversation is centred around specific questions.",
    },
    {
      title: "ACCESSIBLE",
      description: "Connect remotely through WhatsApp.",
    },
  ] as AstrologyBenefit[],
  consultation: {
    heading: "YOUR CONSULTATION",
    whatYouMayNeed: [
      "Date of birth",
      "Exact birth time",
      "Birthplace",
      "Primary question",
    ],
    format: ["Online consultation", "WhatsApp consultation", "Voice consultation"],
    availability: "By appointment",
  },
  community: {
    heading: "JOIN THE ASTROEYE COMMUNITY",
    copy:
      "Stay connected with Astroeye for astrology insights, consultation updates and community content.",
  },
  faqs: [
    {
      question: "What is an astrology consultation?",
      answer:
        "An astrology consultation is a guided conversation where personal details and life questions are explored with a focus on clarity and reflection.",
    },
    {
      question: "What information do I need?",
      answer:
        "Typically, date of birth, exact birth time, birthplace and the main question or life area you want guidance on.",
    },
    {
      question: "How do I join the Astroeye community?",
      answer:
        "Join through the Astroeye WhatsApp community link to stay updated with updates, content and consultation information.",
    },
    {
      question: "Can I consult online?",
      answer:
        "Yes, online and WhatsApp-based consultations are available. Please check the current formats shared in the consultation section.",
    },
    {
      question: "What topics can I discuss?",
      answer:
        "Career, relationships, marriage, business, life transitions, birth chart questions and important personal decisions.",
    },
    {
      question: "Do I need my exact birth time?",
      answer:
        "Exact birth time is helpful for more precise chart-based guidance, but it may not be required for every topic.",
    },
    {
      question: "How do I contact the astrologer?",
      answer:
        "You can connect through the Astroeye WhatsApp community and follow the consultation process shared there.",
    },
  ] as AstrologyFaqItem[],
  disclaimer:
    "Astrology consultations are intended for personal reflection and guidance and should not replace qualified professional advice.",
  whatsappCommunityUrl:
    process.env.NEXT_PUBLIC_ASTROLOGY_WHATSAPP_URL ||
    (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Astroeye, I would like to join the community.")}`
      : "https://wa.me/918421334187?text=Hello%20Astroeye%2C%20I%20would%20like%20to%20join%20the%20community."),
} as const;

export const astrologyConfig = {
  whatsappCommunityUrl: astrologyContent.whatsappCommunityUrl,
};
