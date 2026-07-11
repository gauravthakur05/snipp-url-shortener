import { FiLink, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const socials = [
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiMail, href: 'mailto:hello@snipp.app', label: 'Email' },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.06] bg-white dark:bg-brand-surface">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <FiLink size={16} />
            </span>
            <span className="gradient-text">Snipp</span>
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:text-brand-purple hover:border-brand-purple/40 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 dark:border-white/[0.06] pt-6 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Snipp. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Built for links that deserve better.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
