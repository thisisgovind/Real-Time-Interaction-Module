import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, BarChart3, Zap, Globe } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Real-Time Interaction",
      description: "Connect with your audience instantly through live polling sessions"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Live Results",
      description: "Watch votes come in real-time with beautiful animated charts"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Instant Setup",
      description: "Create and launch polls in seconds with unique session codes"
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Easy Access",
      description: "Participants join with simple codes - no registration required"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.div
          className="floating mb-8"
        >
          <img   
            className="w-32 h-32 mx-auto mb-8 rounded-full shadow-2xl"
            alt="Interactive poll icon with vibrant colors"
            src="https://images.unsplash.com/photo-1662057219054-ac91f1c562b5" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl font-bold mb-6 text-emphasis"
        >
          Live Poll
          <span className="gradient-text"> Master</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl text-subtle mb-12 leading-relaxed"
        >
          Create engaging real-time polls and connect with your audience instantly. 
          Watch votes pour in live with stunning visualizations!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
        >
          <Button
            onClick={() => navigate('/admin')}
            size="lg"
            className="button-primary text-lg px-8 py-4 rounded-xl shadow-2xl pulse-glow"
          >
            <Users className="w-6 h-6 mr-2" />
            Start as Admin
          </Button>
          
          <Button
            onClick={() => navigate('/audience')}
            variant="outline"
            size="lg"
            className="button-outline text-lg px-8 py-4 rounded-xl shadow-2xl"
          >
            <BarChart3 className="w-6 h-6 mr-2" />
            Join as Audience
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
              className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-emphasis mb-2">
                {feature.title}
              </h3>
              <p className="text-subtle text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;