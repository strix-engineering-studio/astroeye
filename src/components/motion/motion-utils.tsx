export const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export const stagger = (staggerChildren = 0.06) => ({ hidden: {}, visible: { transition: { staggerChildren } } })
