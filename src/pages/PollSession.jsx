
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { usePoll } from '@/contexts/PollContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Eye, EyeOff, Info } from 'lucide-react';

import PollHeader from '@/components/poll/PollHeader';
import PollQuestion from '@/components/poll/PollQuestion';
import PollOptions from '@/components/poll/PollOptions';
import PollResults from '@/components/poll/PollResults';
import AdminControls from '@/components/poll/AdminControls';

const PollSession = () => {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const { 
    currentSession, 
    activeSessions, 
    submitVote, 
    endSession, 
    hasUserVoted, 
    setCurrentSession,
    toggleResultsVisibility 
  } = usePoll();
  const { isAdminAuthenticated } = useAuth();

  const [voterId] = useState(() => `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isTrulyAdminView, setIsTrulyAdminView] = useState(false);
  
  useEffect(() => {
    setIsTrulyAdminView(isAdminAuthenticated && document.referrer.includes('/admin'));
  }, [isAdminAuthenticated]);


  useEffect(() => {
    const session = activeSessions.find(s => s.sessionCode === sessionCode);
    if (session) {
      setCurrentSession(session);
    } else {
      toast({
        title: "Session Not Found",
        description: "This session may have ended or doesn't exist.",
        variant: "destructive",
        icon: <AlertTriangle className="h-4 w-4 text-destructive-foreground" />
      });
      navigate(isTrulyAdminView ? '/admin' : '/audience');
    }
  }, [sessionCode, activeSessions, setCurrentSession, navigate, isTrulyAdminView]);
  

  useEffect(() => {
    if (!currentSession) return;

    const updateLiveSessionData = () => {
      const liveSession = activeSessions.find(s => s.sessionCode === sessionCode);
      if (liveSession) {
        setCurrentSession(prev => ({...prev, ...liveSession}));
      } else if (currentSession.isActive) {
        toast({
          title: "Session Update",
          description: "This session may have ended or been modified.",
        });
        navigate(isTrulyAdminView ? '/admin' : '/audience');
      }
    };

    const interval = setInterval(updateLiveSessionData, 1000);
    return () => clearInterval(interval);
  }, [sessionCode, activeSessions, currentSession, setCurrentSession, isTrulyAdminView, navigate]);


  const handleVote = (optionIndex) => {
    if (!currentSession || !currentSession.isActive || hasUserVoted(sessionCode, voterId) || (currentSession.endsAt && new Date() > new Date(currentSession.endsAt))) return;
    submitVote(sessionCode, optionIndex, voterId);
  };

  const totalVotes = useMemo(() => currentSession?.votes.reduce((sum, vote) => sum + vote.count, 0) || 0, [currentSession]);
  const userHasVotedStatus = hasUserVoted(sessionCode, voterId);

  const canAudienceSeeResults = useMemo(() => {
    if (!currentSession) return false;
    if (isTrulyAdminView) return true; 
    return currentSession.resultsVisibleToAudience || !currentSession.isActive;
  }, [currentSession, isTrulyAdminView]);


  if (!currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="text-center text-emphasis">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <PollHeader 
          session={currentSession}
          totalVotes={totalVotes}
          isAdminView={isTrulyAdminView}
          onEndSession={() => endSession(currentSession.sessionCode)}
          onToggleResults={() => toggleResultsVisibility(currentSession.sessionCode)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
            className="flex flex-col"
          >
            <PollQuestion 
              question={currentSession.poll.question}
              isActive={currentSession.isActive}
              userHasVoted={userHasVotedStatus}
              timeLeft={currentSession.endsAt ? new Date(currentSession.endsAt).getTime() - new Date().getTime() : null}
            />
            <PollOptions
              options={currentSession.poll.options}
              votes={currentSession.votes}
              totalVotes={totalVotes}
              onVote={handleVote}
              disabled={!currentSession.isActive || userHasVotedStatus || (currentSession.endsAt && new Date(currentSession.endsAt).getTime() <= Date.now())}
              showPercents={isTrulyAdminView || userHasVotedStatus || !currentSession.isActive || currentSession.resultsVisibleToAudience}
            />
             {isTrulyAdminView && (
              <AdminControls 
                session={currentSession}
                onEndSession={() => endSession(currentSession.sessionCode)}
                onToggleResults={() => toggleResultsVisibility(currentSession.sessionCode)}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
            className="flex flex-col"
          >
          {canAudienceSeeResults ? (
            <PollResults
              votes={currentSession.votes}
              totalVotes={totalVotes}
              options={currentSession.poll.options}
            />
          ) : (
            <div className="glass-effect p-6 sm:p-8 rounded-2xl flex-grow flex flex-col items-center justify-center text-center h-full">
              <EyeOff className="w-16 h-16 text-primary opacity-50 mb-4" />
              <h3 className="text-xl font-semibold text-emphasis mb-2">Results are Hidden</h3>
              <p className="text-subtle">The host has not made the results public yet. Results will be shown here once available or after the poll ends.</p>
            </div>
          )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PollSession;
