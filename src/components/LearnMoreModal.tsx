import React from 'react';
import { X, Zap, Shield, DollarSign, Users, Star, Clock, Mail } from 'lucide-react';

interface LearnMoreModalProps {
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ onClose }) => {
  const supportEmail = 'hustlapp@outlook.com';
  const supportMailto = `mailto:${supportEmail}?subject=Learn More About Hustl`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Zap className="w-6 h-6 text-[#FA4616] mr-2" />
            About Hustl
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <section className="mb-12">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="md:w-1/2 md:pr-8">
                <h3 className="text-3xl font-bold mb-4">Connecting Gators, One Task at a Time</h3>
                <p className="text-gray-600">
                  Hustl is a platform designed specifically for UF students, making it easy to find help
                  or earn money by helping others with various tasks around campus.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
                  alt="Students helping each other"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Why Choose Hustl?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Shield className="w-12 h-12 text-[#0F2557]" />}
                title="Safe & Secure"
                description="Verified UF students only, with built-in safety features and secure payments."
              />
              <FeatureCard
                icon={<Users className="w-12 h-12 text-[#0F2557]" />}
                title="Campus Community"
                description="Connect with fellow Gators in a trusted, campus-focused environment."
              />
              <FeatureCard
                icon={<DollarSign className="w-12 h-12 text-[#0F2557]" />}
                title="Flexible Earnings"
                description="Set your own schedule and earn money helping other students."
              />
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">How It Works</h3>
            <div className="space-y-6">
              <Step
                number="1"
                title="Create Your Account"
                description="Sign up with your UF email and complete verification."
              />
              <Step
                number="2"
                title="Browse or Post Tasks"
                description="Find tasks you can help with or post your own needs."
              />
              <Step
                number="3"
                title="Connect & Complete"
                description="Chat with others, agree on details, and complete tasks."
              />
              <Step
                number="4"
                title="Rate & Earn"
                description="Get paid securely and build your reputation through ratings."
              />
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Popular Task Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CategoryCard
                image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80"
                title="Food Delivery"
                description="Campus dining, coffee runs, and meal exchanges"
              />
              <CategoryCard
                image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=500&q=80"
                title="Academic Help"
                description="Study groups, notes sharing, and tutoring"
              />
              <CategoryCard
                image="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=500&q=80"
                title="Pet Care"
                description="Dog walking, pet sitting, and care assistance"
              />
            </div>
          </section>

          <section className="text-center bg-blue-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of UF students already using Hustl to connect and help each other.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onClose}
                className="bg-[#0F2557] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0A1B3D] transition duration-200"
              >
                Start Using Hustl
              </button>
              <a
                href={supportMailto}
                className="bg-white border border-[#0F2557] text-[#0F2557] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 inline-flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="flex items-start">
    <div className="w-8 h-8 bg-[#0F2557] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
      {number}
    </div>
    <div className="ml-4">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const CategoryCard = ({ image, title, description }) => (
  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <img src={image} alt={title} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export default LearnMoreModal;