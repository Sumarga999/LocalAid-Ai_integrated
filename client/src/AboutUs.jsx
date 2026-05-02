import React from 'react';
import { Link } from 'react-router-dom';
function AboutUs() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-surface py-xxl">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-lg items-center">
          <div className="z-10">
            <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full text-label-sm uppercase tracking-widest mb-md">
              Our Mission
            </span>
            <h1 className="font-headline-xl text-on-surface mb-md max-w-lg">
              Empowering Neighbors, Building Communities
            </h1>
            <p className="font-body-lg text-on-surface-variant mb-xl max-w-md">
              LocalAid is a grassroots digital platform connecting residents to facilitate mutual aid, volunteer management, and resource sharing within neighborhoods.
            </p>
            <div className="flex gap-md">
              <Link to="/signup" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md shadow-lg hover:shadow-primary/20 transition-all">
                Start Helping
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-surface-container-high">
              <img 
                className="w-full h-full object-cover" 
                alt="Community gathering" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwNcfQVApDHJkqcX_dcqrVT3BasMG9rGsZpnrQ1Y2B-ergwONxJ7W4T45FUSNyAjrINKfvfiaWRn2saZXdAAwDO0hY9HingKC8DRm6k2ylkhg7gpHKEcdAPzpsN5Z9MJyVI_CPyQ6m0tyqKF88tVUA3u9a28nGt7n9Wc8OIcYj7g_qxBi-hQxjlkO8BcvyrUH796Dr5i-N69-JthUrUNT4tT7X0QxNXw7D2uz-uBymFQLZoz4-dB7PrC1V9j7mmNOV6Ckmqvuofrg"
              />
            </div>
            {/* Abstract geometric decor */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-container rounded-full mix-blend-multiply opacity-70"></div>
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary-container rounded-full mix-blend-multiply opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-xxl bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-xl items-center">
            <div className="w-full md:w-1/2">
              <img 
                className="rounded-2xl shadow-md border-8 border-surface-container" 
                alt="Neighbors helping" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmKjdbD1s0A5zIDxCOSaVwXfcOYgA2nc8hKCxJoQ-l7blMLaf35xX-iOzq8lJrY4HmW8_2pC0q10QHW9rFi3z81_ynngC0-_d8Eo3HOu1TMT1IJT5iVhIrDycEdg3g2-SwYJ_pYTbbdDphq6rh-SraCDMSR6I7Wo_GgrMO2ylvtjK04AdbDTqeHMPJl71jlLfvxWp6S34tL8Tb5qzdG6R8stZgoAx3hkowZ9KJPUlwmOdnjXvjJn3txGu_zreKJ5wb-fK8kurISeg"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="font-headline-lg text-primary mb-md">Our Story</h2>
              <div className="space-y-md font-body-md text-on-surface-variant">
                <p>LocalAid began in a small neighborhood kitchen when we realized that while many people wanted to help their neighbors, there was no simple way to connect needs with offers of support.</p>
                <p>What started as a simple spreadsheet has evolved into a robust platform dedicated to the philosophy of mutual aid. We believe that community resilience is built through small, consistent acts of local action—from picking up groceries for a housebound neighbor to organizing neighborhood tool libraries.</p>
                <p>Today, LocalAid serves thousands of communities, ensuring that help is always just around the corner and that no neighbor is left behind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-headline-lg text-on-surface mb-xl">Guided by Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            
            {/* Value 1 */}
            <div className="bg-white p-lg rounded-xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all text-left">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-lg flex items-center justify-center mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-sm">Compassion</h3>
              <p className="font-body-md text-on-surface-variant">Approaching every interaction with empathy and a genuine desire to understand and support one another.</p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-lg rounded-xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all text-left">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-lg flex items-center justify-center mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>accessibility_new</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-sm">Accessibility</h3>
              <p className="font-body-md text-on-surface-variant">Ensuring our platform and services are available to everyone, regardless of technical ability or background.</p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-lg rounded-xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all text-left">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-lg flex items-center justify-center mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-sm">Integrity</h3>
              <p className="font-body-md text-on-surface-variant">Building trust through transparent processes and maintaining the highest standards of privacy and safety.</p>
            </div>

            {/* Value 4 */}
            <div className="bg-white p-lg rounded-xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all text-left">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-lg flex items-center justify-center mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-sm">Local Impact</h3>
              <p className="font-body-md text-on-surface-variant">Focusing on hyper-local actions that create immediate and tangible benefits for the neighborhood.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-xxl bg-primary text-on-primary">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            <div>
              <h2 className="font-headline-lg mb-md">Small Acts, <br/>Global Impact</h2>
              <p className="font-body-lg text-primary-fixed opacity-90 max-w-md">Our community is growing every day, proving that when we work together, we can overcome any local challenge.</p>
            </div>
            <div className="grid grid-cols-2 gap-lg">
              <div className="bg-primary-container p-lg rounded-2xl border border-primary-fixed/20">
                <div className="text-secondary-fixed mb-sm">
                  <span className="material-symbols-outlined text-4xl">groups</span>
                </div>
                <div className="font-headline-xl text-white">2,800+</div>
                <div className="font-label-md uppercase tracking-wider text-primary-fixed">Active Volunteers</div>
              </div>
              <div className="bg-primary-container p-lg rounded-2xl border border-primary-fixed/20">
                <div className="text-secondary-fixed mb-sm">
                  <span className="material-symbols-outlined text-4xl">task_alt</span>
                </div>
                <div className="font-headline-xl text-white">5,400+</div>
                <div className="font-label-md uppercase tracking-wider text-primary-fixed">Tasks Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;