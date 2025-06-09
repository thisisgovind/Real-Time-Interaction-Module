
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';

const PollContext = createContext();

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
};

export const PollProvider = ({ children }) => {
  const [polls, setPolls] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    const savedPolls = localStorage.getItem('polls');
    const savedSessions = localStorage.getItem('activeSessions');
    
    if (savedPolls) {
      setPolls(JSON.parse(savedPolls));
    }
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setActiveSessions(parsedSessions.map(s => ({
        ...s,
        startedAt: s.startedAt ? new Date(s.startedAt) : null,
        endsAt: s.endsAt ? new Date(s.endsAt) : null,
        resultsVisibleToAudience: s.resultsVisibleToAudience === undefined ? false : s.resultsVisibleToAudience,
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
  }, [activeSessions]);

  const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createPoll = (pollData) => {
    const newPoll = {
      id: Date.now().toString(),
      ...pollData,
      createdAt: new Date().toISOString(),
      votes: pollData.options.map(option => ({ option, count: 0, voters: [] })),
      resultsVisibleToAudience: false,
    };
    
    setPolls(prev => [...prev, newPoll]);
    toast({
      title: "Poll Created! 🎉",
      description: "Your poll is ready to launch!"
    });
    
    return newPoll;
  };

  const launchSession = (pollId, durationMinutes) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return null;

    const sessionCode = generateSessionCode();
    const startedAt = new Date();
    let endsAt = null;
    if (durationMinutes && durationMinutes > 0) {
      endsAt = new Date(startedAt.getTime() + durationMinutes * 60000);
    }

    const session = {
      id: Date.now().toString(),
      sessionCode,
      pollId,
      poll,
      isActive: true,
      startedAt,
      endsAt,
      durationMinutes,
      votes: poll.options.map(option => ({ option, count: 0, voters: [] })),
      resultsVisibleToAudience: poll.resultsVisibleToAudience || false,
    };

    setActiveSessions(prev => [...prev, session]);
    setCurrentSession(session);
    
    toast({
      title: "Session Launched! 🚀",
      description: `Session code: ${sessionCode}${durationMinutes ? ` (ends in ${durationMinutes} min)` : ''}`
    });

    return session;
  };

  const joinSession = (sessionCode) => {
    const session = activeSessions.find(s => s.sessionCode === sessionCode);
    if (session && (session.isActive || (!session.isActive && session.resultsVisibleToAudience))) {
      if (session.isActive && session.endsAt && new Date() > new Date(session.endsAt)) {
         endSession(sessionCode, true); 
         const updatedSession = activeSessions.find(s => s.sessionCode === sessionCode);
         if (updatedSession && updatedSession.resultsVisibleToAudience) {
           setCurrentSession(updatedSession);
           return updatedSession;
         }
         toast({
            title: "Session Expired",
            description: "This session has already ended.",
            variant: "destructive",
            icon: <AlertTriangle className="h-4 w-4" />
         });
         return null;
      }
      setCurrentSession(session);
      return session;
    }
    if (session && !session.isActive && !session.resultsVisibleToAudience) {
      toast({
        title: "Session Ended",
        description: "This session is no longer active and results are not public.",
        variant: "destructive",
        icon: <AlertTriangle className="h-4 w-4" />
      });
      return null;
    }
    return null;
  };

  const submitVote = (sessionCode, optionIndex, voterId) => {
    setActiveSessions(prev => prev.map(session => {
      if (session.sessionCode === sessionCode) {
        if (!session.isActive || (session.endsAt && new Date() > new Date(session.endsAt))) {
          toast({
            title: "Session Closed",
            description: "Voting is closed for this session.",
            variant: "destructive",
          });
          return session;
        }
        const hasVoted = session.votes.some(vote => vote.voters.includes(voterId));
        if (hasVoted) {
          toast({
            title: "Already Voted",
            description: "You can only vote once per session.",
            variant: "destructive",
          });
          return session;
        }

        const updatedVotes = session.votes.map((vote, index) => {
          if (index === optionIndex) {
            return {
              ...vote,
              count: vote.count + 1,
              voters: [...vote.voters, voterId]
            };
          }
          return vote;
        });

        const updatedSession = { ...session, votes: updatedVotes };
        
        if (currentSession && currentSession.sessionCode === sessionCode) {
          setCurrentSession(updatedSession);
        }

        toast({
          title: "Vote Submitted! ✅",
          description: "Thanks for participating!"
        });
        return updatedSession;
      }
      return session;
    }));
  };

  const endSession = useCallback((sessionCode, autoEnded = false) => {
    setActiveSessions(prevSessions => prevSessions.map(session => {
      if (session.sessionCode === sessionCode) {
        const updatedSession = { 
          ...session, 
          isActive: false, 
          endedAt: session.endedAt || new Date().toISOString(),
          resultsVisibleToAudience: true 
        };
        
        if (currentSession && currentSession.sessionCode === sessionCode) {
          setCurrentSession(prevCurrent => ({ ...prevCurrent, ...updatedSession }));
        }
        
        if (!autoEnded) {
          toast({
            title: "Session Ended",
            description: "The polling session has been closed. Results are now visible."
          });
        } else {
          toast({
            title: "Session Time Expired",
            description: "The polling session has automatically ended. Results are now visible.",
            variant: "destructive"
          });
        }
        return updatedSession;
      }
      return session;
    }));
  }, [currentSession]);


  const toggleResultsVisibility = (sessionCode) => {
    setActiveSessions(prevSessions => prevSessions.map(session => {
      if (session.sessionCode === sessionCode) {
        const newVisibility = !session.resultsVisibleToAudience;
        const updatedSession = { ...session, resultsVisibleToAudience: newVisibility };

        if (currentSession && currentSession.sessionCode === sessionCode) {
          setCurrentSession(prev => ({ ...prev, resultsVisibleToAudience: newVisibility }));
        }
        toast({
          title: `Results Visibility ${newVisibility ? 'On' : 'Off'}`,
          description: `Audience can ${newVisibility ? 'now' : 'no longer'} see results.`,
        });
        return updatedSession;
      }
      return session;
    }));
  };

  const hasUserVoted = (sessionCode, voterId) => {
    const session = activeSessions.find(s => s.sessionCode === sessionCode);
    if (!session) return false;
    
    return session.votes.some(vote => vote.voters.includes(voterId));
  };


  useEffect(() => {
    const timers = {};
    activeSessions.forEach(session => {
      if (session.isActive && session.endsAt) {
        const timeLeft = new Date(session.endsAt).getTime() - new Date().getTime();
        if (timeLeft > 0) {
          timers[session.sessionCode] = setTimeout(() => {
            endSession(session.sessionCode, true);
          }, timeLeft);
        } else if (session.isActive) {
          endSession(session.sessionCode, true);
        }
      }
    });
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, [activeSessions, endSession]);


  const value = {
    polls,
    activeSessions,
    currentSession,
    createPoll,
    launchSession,
    joinSession,
    submitVote,
    endSession,
    hasUserVoted,
    setCurrentSession,
    toggleResultsVisibility
  };

  return (
    <PollContext.Provider value={value}>
      {children}
    </PollContext.Provider>
  );
};
