import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, BarChart3, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { AIOrb } from './shared/AIOrb';
import { usePortalStore } from '../store/portalStore';

export function LandingPage() {
  const { enterPortal } = usePortalStore();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: MessageSquare,
      title: 'AI-Powered Feedback',
      description: 'Collect and analyze employee feedback with intelligent AI insights',
      color: 'from-orb-blue to-orb-purple',
    },
    {
      icon: Users,
      title: 'Team Health Monitoring',
      description: 'Real-time pulse on team morale, engagement, and culture',
      color: 'from-orb-purple to-orb-pink',
    },
    {
      icon: BarChart3,
      title: 'Actionable Analytics',
      description: 'Transform feedback into strategic business decisions',
      color: 'from-orb-pink to-orb-cyan',
    },
    {
      icon: Shield,
      title: 'Safe & Anonymous',
      description: 'Secure platform encouraging honest, transparent communication',
      color: 'from-orb-cyan to-orb-teal',
    },
  ];

  return (
    <div className="min-h-screen theme-blue-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo and badge */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="inline-flex items-center gap-2 glass-blue px-6 py-3 rounded-full">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span className="text-primary-700 font-semibold">AI-Powered Employee Insights</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-gradient-blue">Transform Workplace</span>
            <br />
            <span className="text-primary-900">Culture with AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-primary-800/80 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Meet Coro, your AI-powered feedback assistant. Build healthier teams,
            unlock actionable insights, and create a thriving workplace culture.
          </motion.p>

          {/* AI Orb showcase */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          >
            <div className="relative">
              <AIOrb size="large" isThinking />
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="glass-ultra px-6 py-2 rounded-full">
                  <span className="text-gradient-orb font-semibold">Meet Coro</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => enterPortal('employee')}
              className="group premium-card-blue px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="w-5 h-5 text-primary-600" />
              <span className="text-lg font-semibold text-primary-700">
                Enter Employee Portal
              </span>
              <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={() => enterPortal('owner')}
              className="group premium-card-blue px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <span className="text-lg font-semibold text-primary-700">
                Enter Executive Portal
              </span>
              <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="premium-card-blue relative overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                whileHover={{ y: -8 }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-4 relative z-10`}
                  animate={{
                    rotate: hoveredFeature === index ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-full h-full text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold text-primary-800 mb-2 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-primary-700/70 text-sm relative z-10">
                  {feature.description}
                </p>

                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={{
                    rotate: 45,
                  }}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${feature.color} blur-xl`} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive demo section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="glass-ultra max-w-3xl mx-auto rounded-3xl p-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <AIOrb size="small" isListening />
              <h2 className="text-3xl font-bold text-primary-900">
                Experience the Power of AI
              </h2>
            </div>
            <p className="text-lg text-primary-700/80 mb-8">
              Coro understands context, detects sentiment, and provides actionable insights
              to help you build a healthier workplace culture. Choose your portal above to get started.
            </p>

            {/* Animated stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '95%', label: 'Employee Satisfaction' },
                { value: '10x', label: 'Faster Insights' },
                { value: '24/7', label: 'AI Availability' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  <div className="text-4xl font-bold text-gradient-blue mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-700/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;
