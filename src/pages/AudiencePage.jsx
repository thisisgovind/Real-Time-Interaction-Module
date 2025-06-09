import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePoll } from '@/contexts/PollContext';
import { ArrowLeft, Users, Hash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AudiencePage = () => {
  const navigate = useNavigate();
  const { joinSession } = usePoll();
  const [sessionCode, setSessionCode] = useState('');

  const handleJoinSession = (e) => {
    e.preventDefault();
    
    if (!sessionCode.trim()) {
      toast({
        title: "Session Code Required",
        description: "Please enter a session code to join.",
        variant: "destructive"
      });
      return;
    }

    const session = joinSession(sessionCode.toUpperCase());
    if (session) {
      navigate(`/session/${sessionCode.toUpperCase()}`);
    } else {
      toast({
        title: "Session Not Found",
        description: "Please check the session code and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="button-outline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            className="floating mb-6"
          >
            <img   
              className="w-24 h-24 mx-auto mb-6 rounded-full shadow-2xl"
              alt="Audience members with speech bubbles icon"
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87" />
          </motion.div>

          <h1 className="text-4xl font-bold text-emphasis mb-4">
            Join Live Poll
          </h1>
          <p className="text-subtle text-lg">
            Enter the session code to participate in real-time polling
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-8"
        >
          <form onSubmit={handleJoinSession} className="space-y-6">
            <div>
              <Label htmlFor="sessionCode" className="text-emphasis text-lg">
                Session Code
              </Label>
              <div className="relative mt-3">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="sessionCode"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  maxLength={6}
                  className="pl-12 text-center text-2xl font-mono tracking-widest placeholder:text-muted-foreground"
                />
              </div>
              <p className="text-subtle text-sm mt-2">
                Ask the host for the session code. It's 6 characters long.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full button-primary text-lg py-6 pulse-glow"
              disabled={sessionCode.length !== 6}
            >
              <Users className="w-5 h-5 mr-2" />
              Join Session
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="glass-effect rounded-xl p-4">
              <h3 className="text-emphasis font-semibold mb-2">How it works:</h3>
              <div className="text-subtle text-sm space-y-1">
                <p>1. Get the session code from your host</p>
                <p>2. Enter the code above</p>
                <p>3. Vote and see live results!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AudiencePage;