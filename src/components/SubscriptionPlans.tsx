import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Star, Award, Shield, Loader, CreditCard, RefreshCw } from 'lucide-react';
import { revenueCatService } from '../lib/revenueCatService';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';
import { StarBorder } from './ui/star-border';

interface SubscriptionPlansProps {
  onClose: () => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: 'monthly' | 'yearly' | 'weekly' | 'lifetime';
  features: string[];
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onClose }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      
      // Initialize RevenueCat service
      revenueCatService.initialize();
      
      // Load subscription plans
      const subscriptionPlans = await revenueCatService.getSubscriptionPlans();
      setPlans(subscriptionPlans);
      
      // Check if user has an active subscription
      const user = auth.currentUser;
      if (user) {
        const subscription = await revenueCatService.getCurrentSubscription(user.uid);
        setCurrentSubscription(subscription);
      }
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    try {
      setPurchasing(true);
      setSelectedPlan(planId);
      
      const success = await revenueCatService.purchaseSubscription(planId);
      
      if (success) {
        toast.success('Subscription purchased successfully!');
        
        // Reload subscription status
        const user = auth.currentUser;
        if (user) {
          const subscription = await revenueCatService.getCurrentSubscription(user.uid);
          setCurrentSubscription(subscription);
        }
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      toast.error('Failed to purchase subscription');
    } finally {
      setPurchasing(false);
      setSelectedPlan(null);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setRestoring(true);
      
      const success = await revenueCatService.restorePurchases();
      
      if (success) {
        toast.success('Purchases restored successfully!');
        
        // Reload subscription status
        const user = auth.currentUser;
        if (user) {
          const subscription = await revenueCatService.getCurrentSubscription(user.uid);
          setCurrentSubscription(subscription);
        }
      } else {
        toast.error('No previous purchases found');
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      toast.error('Failed to restore purchases');
    } finally {
      setRestoring(false);
    }
  };

  const getPlanIcon = (plan: SubscriptionPlan) => {
    if (plan.id.includes('premium')) {
      return <Star className="w-6 h-6 text-yellow-400" />;
    } else if (plan.id.includes('pro')) {
      return <Award className="w-6 h-6 text-purple-500" />;
    } else {
      return <Shield className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              Hustl Premium Plans
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-2 text-blue-100">
            Upgrade your Hustl experience with premium features and benefits
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0038FF]"></div>
            </div>
          ) : (
            <>
              {currentSubscription && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800">Active Subscription</h3>
                      <p className="text-green-700">
                        You're currently subscribed to {currentSubscription.planName}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        Next billing date: {new Date(currentSubscription.expirationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="premium-card overflow-hidden">
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#0038FF]/10 to-[#0021A5]/10 rounded-full -mt-10 -mr-10"></div>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          {getPlanIcon(plan)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{plan.name}</h3>
                          <p className="text-sm text-gray-500">{plan.period}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      
                      <div className="text-2xl font-bold mb-4 flex items-baseline">
                        {plan.price}
                        <span className="text-sm text-gray-500 ml-1">
                          /{plan.period === 'lifetime' ? 'one-time' : plan.period}
                        </span>
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <StarBorder color="#0038FF">
                        <button
                          onClick={() => handlePurchase(plan.id)}
                          disabled={purchasing || !!currentSubscription}
                          className="w-full bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center"
                        >
                          {purchasing && selectedPlan === plan.id ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : currentSubscription ? (
                            'Current Plan'
                          ) : (
                            <>
                              <CreditCard className="w-5 h-5 mr-2" />
                              Subscribe
                            </>
                          )}
                        </button>
                      </StarBorder>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleRestorePurchases}
                  disabled={restoring}
                  className="text-[#0038FF] hover:text-[#0021A5] font-medium flex items-center mx-auto"
                >
                  {restoring ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Restore Previous Purchases
                </button>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                <p className="mb-2">
                  Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
                </p>
                <p>
                  You can manage your subscriptions in your account settings after purchase.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;