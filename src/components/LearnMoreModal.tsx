import React from 'react';
import { X, Zap, Shield, DollarSign, Users, Star, Clock, Mail, Award, Trophy, BookOpen, Briefcase, GraduationCap, Coffee, Package } from 'lucide-react';

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
            About Us
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <section className="mb-12">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="md:w-1/2 md:pr-8">
                <h3 className="text-3xl font-bold mb-4">About Us</h3>
                <p className="text-gray-600 mb-4">
                  Hustl was founded by UF students Kaushal and Aryan, who experienced firsthand the everyday inconveniences of campus life. They created Hustl as a platform for students by students, connecting Gators to help each other with daily tasks.
                </p>
                <p className="text-gray-600">
                  What started as a simple idea to help fellow students has grown into a thriving community where Gators can earn money helping others or get assistance with tasks they don't have time for. Our mission is to make campus life easier by bringing students together.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=format&fit=crop&w=800&q=80"
                    alt="Students collaborating"
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h4 className="text-white font-bold text-xl">Founded by Students, for Students</h4>
                    <p className="text-white/90 text-sm">University of Florida, 2023</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-[#0038FF] rounded-full flex items-center justify-center text-white shadow-lg mr-4">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Kaushal</h4>
                    <p className="text-gray-600">Co-founder & CEO</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  A Computer Science major with a passion for solving everyday problems, Kaushal recognized the need for a platform that connects students for quick tasks and errands. His vision was to create a community where Gators help Gators.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-[#FA4616] rounded-full flex items-center justify-center text-white shadow-lg mr-4">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Aryan</h4>
                    <p className="text-gray-600">Co-founder & CTO</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  With a background in Business and Technology, Aryan brings the technical expertise to make Hustl a reality. His experience with campus life challenges inspired him to build a platform that makes daily tasks more manageable for busy students.
                </p>
              </div>
            </div>
          </section>

          <section className="py-8 border-t border-b border-gray-200 mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-[#0038FF] mr-2" />
              Our Mission
            </h3>
            
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-6">
                We believe in the power of community and connection. Hustl was created to solve the everyday challenges students face on campus by bringing them together to help each other.
              </p>
              <p className="text-lg text-gray-700">
                Whether it's getting coffee during a study session, picking up notes when you're sick, or finding a study buddy for that difficult class, Hustl makes it easy to find help or earn money by helping others.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center">
              <Award className="w-8 h-8 text-[#0038FF] mr-2" />
              How Hustl Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Package className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Post Your Task</h3>
                <p className="text-gray-600">
                  Describe what you need help with, set your budget, and choose a convenient location on campus.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Get Matched</h3>
                <p className="text-gray-600">
                  Connect with verified UF students nearby who are ready to help with your task.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Star className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Complete & Pay</h3>
                <p className="text-gray-600">
                  Once your task is done, rate your helper and pay securely through our platform.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#0038FF] mr-2" />
              Popular Task Categories
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src="https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=format&fit=crop&w=500&q=80" 
                  alt="Coffee Run" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <Coffee className="w-5 h-5 text-[#FA4616] mr-2" />
                    <h4 className="font-bold">Coffee Runs</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Quick coffee deliveries during study sessions or between classes.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=format&fit=crop&w=500&q=80" 
                  alt="Academic Help" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="w-5 h-5 text-[#FA4616] mr-2" />
                    <h4 className="font-bold">Academic Support</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Note sharing, study group formation, and printing services.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src="https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=format&fit=crop&w=500&q=80" 
                  alt="Pet Care" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-[#FA4616] mr-2" />
                    <h4 className="font-bold">Pet Care</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dog walking, pet sitting, and care assistance for busy students.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Join the Hustl Community</h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Be part of a growing network of UF students helping each other succeed and make campus life easier.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onClose}
                className="bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition duration-200 shadow-md flex items-center justify-center"
              >
                Start Using Hustl
              </button>
              <a
                href={supportMailto}
                className="bg-white border border-[#0F2557] text-[#0F2557] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition duration-200 inline-flex items-center justify-center"
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

export default LearnMoreModal;