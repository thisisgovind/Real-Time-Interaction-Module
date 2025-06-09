
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Clock, Copy, Check, StopCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PollHeader = ({ session, totalVotes, isAdminView, onEndSession, onToggleResults }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (session && session.endsAt && session.isActive) {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const endTime = new Date(session.endsAt).getTime();
        const difference = endTime - now;
        setTimeLeft(difference > 0 ? difference : 0);
      };
      calculateTimeLeft();
      const timerInterval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timerInterval);
    } else if (session && !session.isActive) {
      setTimeLeft(0);
    } else {
      setTimeLeft(null);
    }
  }, [session]);

  const formatTimeLeft = (ms) => {
    if (ms === null || ms < 0) return "No limit";
    if (ms === 0 && session.isActive) return "Ending...";
    if (ms === 0 && !session.isActive) return "Time's up!";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const copySessionCode = () => {
    navigator.clipboard.writeText(session.sessionCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Session code copied to clipboard",
      icon: <Check className="h-4 w-4 text-green-500" />
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(isAdminView ? '/admin' : '/audience')}
          className="button-outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emphasis">{session.poll.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-subtle mt-2 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-primary" />
              {totalVotes} votes
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className={session.isActive ? "text-green-400" : "text-red-400"}>
                {session.isActive ? (timeLeft !== null ? formatTimeLeft(timeLeft) : 'Live') : `Ended ${session.endedAt ? new Date(session.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) : ''}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <div className="glass-effect rounded-xl px-3 py-2 flex items-center gap-2 flex-grow sm:flex-grow-0">
          <span className="text-emphasis font-mono text-lg tracking-wider">{session.sessionCode}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copySessionCode}
            className="text-primary hover:bg-primary/10 p-1"
            aria-label="Copy session code"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PollHeader;
