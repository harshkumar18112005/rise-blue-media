import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportWidget from '@/components/SupportWidget';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
          <p className="text-gray-300 text-lg mb-8">Last updated: January 2024</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h2>
            <p className="text-gray-300 mb-4">
              Cookies are small pieces of data stored on your device when you visit our website. They help us 
              provide you with a better experience by remembering your preferences and improving our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
            <div className="text-gray-300 mb-4">
              <h3 className="text-lg font-medium text-white mb-2">Essential Cookies</h3>
              <p className="mb-4">These cookies are necessary for the website to function and cannot be switched off.</p>
              
              <h3 className="text-lg font-medium text-white mb-2">Analytics Cookies</h3>
              <p className="mb-4">These cookies help us understand how visitors interact with our website.</p>
              
              <h3 className="text-lg font-medium text-white mb-2">Marketing Cookies</h3>
              <p className="mb-4">These cookies are used to track visitors across websites to display relevant advertisements.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="text-gray-300 mb-4">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on 
              your computer and you can set most browsers to prevent them from being placed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <p className="text-gray-300 mb-4">
              We may use third-party services like Google Analytics that place cookies on your device. These 
              services have their own cookie policies which you can review on their respective websites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about our use of cookies, please contact us at support@risebluemedia.com 
              or +1 (555) 123-4567.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
};

export default CookiePolicy;