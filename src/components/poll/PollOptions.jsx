
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const PollOptions = ({ options, votes, totalVotes, onVote, disabled, showPercents }) => {
  const chartColors = [
    'hsl(var(--primary))', 
    'hsl(var(--secondary))', 
    'hsl(var(--accent))', 
    'hsl(30, 70%, 60%)',
    'hsl(120, 50%, 60%)',
    'hsl(180, 60%, 55%)',
    'hsl(330, 70%, 65%)',
    'hsl(60, 70%, 50%)'
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {options.map((option, index) => {
        const voteCount = votes[index]?.count || 0;
        const percentage = totalVotes > 0 ? parseFloat(((voteCount / totalVotes) * 100).toFixed(1)) : 0;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <Button
              onClick={() => onVote(index)}
              disabled={disabled}
              className={`w-full p-4 sm:p-5 text-left justify-start relative overflow-hidden poll-option text-base sm:text-md font-medium rounded-lg
                ${disabled
                  ? 'bg-muted/30 text-muted-foreground cursor-default'
                  : 'button-primary hover:bg-primary/80' 
                }`}
              aria-label={`Vote for ${option}`}
            >
              <motion.div 
                className="absolute left-0 top-0 h-full vote-bar opacity-20"
                initial={{ width: 0 }}
                animate={{ width: showPercents ? `${percentage}%` : '0%'}}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ backgroundColor: chartColors[index % chartColors.length] }}
              />
              <div className="relative z-10 flex items-center justify-between w-full">
                <span>{option}</span>
                {showPercents && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <span className="opacity-80">{voteCount}</span>
                    <span className="font-bold">{percentage}%</span>
                  </motion.div>
                )}
              </div>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PollOptions;
