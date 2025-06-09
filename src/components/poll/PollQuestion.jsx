
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

const PollQuestion = ({ question, isActive, userHasVoted, timeLeft }) => {
  return (
    <Card className="glass-effect p-6 sm:p-8 mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-emphasis mb-1 flex items-center">
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary"/>
        {question}
      </h2>
      <p className="text-sm text-subtle mb-6">Select an option below to cast your vote.</p>
      
      <AnimatePresence>
        {!isActive && (timeLeft === null || timeLeft <=0) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-destructive/20 border border-destructive/30 rounded-lg p-4 mb-6 text-center overflow-hidden"
          >
            <p className="text-destructive-foreground font-semibold flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 mr-2"/> This polling session has ended.
            </p>
          </motion.div>
        )}

        {userHasVoted && isActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 text-center overflow-hidden"
          >
            <p className="text-green-300 font-semibold flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2"/> You've voted! Results are updating live.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default PollQuestion;
