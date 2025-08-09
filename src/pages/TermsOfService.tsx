import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportWidget from '@/components/SupportWidget';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <p className="text-gray-300 text-lg mb-8">Last updated: January 2024</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing and using Rise Blue Media's services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
            <p className="text-gray-300 mb-4">
              Rise Blue Media provides premium Facebook assets including verified profiles, business managers, 
              and established pages. All assets are delivered as described and comply with platform policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
            <p className="text-gray-300 mb-4">
              Users are responsible for maintaining the confidentiality of their account information and for all 
              activities that occur under their account. You agree to use our services in compliance with all 
              applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Payment and Refunds</h2>
            <p className="text-gray-300 mb-4">
              All payments are due at the time of purchase. Refunds are available within 30 days of purchase 
              for unused assets, subject to our refund policy terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              Rise Blue Media shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages resulting from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
            <p className="text-gray-300 mb-4">
              For questions regarding these terms, please contact us at support@risebluemedia.com or +1 (555) 123-4567.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
};

export default TermsOfService;