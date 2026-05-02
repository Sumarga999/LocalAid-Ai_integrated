import React from 'react';

function Footer() {
  return (
    <footer className="bg-green-900 dark:bg-black text-white py-12 md:py-16 border-t border-green-800 dark:border-slate-800 mt-auto">
      <div className="w-full px-8 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="text-xl font-bold text-yellow-400 font-headline-lg">LocalAid</div>
          <p className="text-green-100/80 dark:text-slate-400 text-sm leading-relaxed">
            Connecting communities through kindness and shared effort. Our mission is to ensure no neighbor is left behind.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase text-xs tracking-widest">Contact Info</h4>
          <ul className="space-y-2 text-green-100/80 dark:text-slate-400 text-sm">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">mail</span> hello@localaid.community</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">call</span> +1 (555) 000-0000</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">location_on</span> 123 Community Way, Suite 100</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase text-xs tracking-widest">About</h4>
          <nav className="flex flex-col gap-2">
            <a className="text-green-100/80 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 transition-colors text-sm hover:underline decoration-yellow-400 underline-offset-4" href="#">Privacy Policy</a>
            <a className="text-green-100/80 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 transition-colors text-sm hover:underline decoration-yellow-400 underline-offset-4" href="#">Terms of Service</a>
            <a className="text-green-100/80 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 transition-colors text-sm hover:underline decoration-yellow-400 underline-offset-4" href="#">Volunteer Portal</a>
            <a className="text-green-100/80 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 transition-colors text-sm hover:underline decoration-yellow-400 underline-offset-4" href="#">Donate</a>
          </nav>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase text-xs tracking-widest">Stay Connected</h4>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center hover:bg-yellow-400 hover:text-green-900 transition-all" href="#">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center hover:bg-yellow-400 hover:text-green-900 transition-all" href="#">
              <span className="material-symbols-outlined">group</span>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-12 pt-8 border-t border-green-800/50 text-center">
        <p className="text-green-100/60 text-xs font-label-md">
          © 2024 LocalAid Community. Built for neighbors, by neighbors.
        </p>
      </div>
    </footer>
  );
}

export default Footer;