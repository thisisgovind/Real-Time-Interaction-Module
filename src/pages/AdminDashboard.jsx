
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { usePoll } from '@/contexts/PollContext';
import { Plus, Play, Users, BarChart3, ArrowLeft, Trash2, Clock, Eye, EyeOff, LogOut, UserCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { polls, activeSessions, createPoll, launchSession, toggleResultsVisibility } = usePoll();
  const { adminData, logoutAdmin } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pollData, setPollData] = useState({
    title: '',
    question: '',
    options: ['', ''],
    duration: 0,
    resultsVisibleToAudience: false,
  });
  const [duration, setDuration] = useState([0]);


  const handleCreatePoll = (e) => {
    e.preventDefault();
    
    if (!pollData.title.trim() || !pollData.question.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and question.",
        variant: "destructive"
      });
      return;
    }

    const validOptions = pollData.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Need More Options",
        description: "Please provide at least 2 options.",
        variant: "destructive"
      });
      return;
    }

    createPoll({
      title: pollData.title,
      question: pollData.question,
      options: validOptions,
      durationMinutes: duration[0] > 0 ? duration[0] : null,
      resultsVisibleToAudience: pollData.resultsVisibleToAudience,
    });

    setPollData({ title: '', question: '', options: ['', ''], duration: 0, resultsVisibleToAudience: false });
    setDuration([0]);
    setShowCreateForm(false);
  };

  const handleLaunchSession = (pollId) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;
    const session = launchSession(pollId, poll.durationMinutes);
    if (session) {
      navigate(`/session/${session.sessionCode}`);
    }
  };

  const addOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (pollData.options.length > 2) {
      setPollData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, value) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="button-outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold text-emphasis">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/profile')}
              className="rounded-full"
              aria-label="Admin Profile"
            >
              <Avatar className="w-10 h-10 border-2 border-primary">
                <AvatarImage src={adminData?.profilePhoto || undefined} alt={adminData?.name || "Admin"} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {adminData?.name ? adminData.name.charAt(0).toUpperCase() : <UserCircle size={20}/>}
                </AvatarFallback>
              </Avatar>
            </Button>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="button-primary pulse-glow flex-grow sm:flex-grow-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Poll
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-grow sm:flex-grow-0"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-2xl p-6 sm:p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-emphasis mb-6">Create New Poll</h2>
            <form onSubmit={handleCreatePoll} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-emphasis">Poll Title</Label>
                <Input
                  id="title"
                  value={pollData.title}
                  onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter poll title..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="question" className="text-emphasis">Question</Label>
                <Input
                  id="question"
                  value={pollData.question}
                  onChange={(e) => setPollData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="What's your question?"
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-emphasis">Options</Label>
                <div className="space-y-3 mt-2">
                  {pollData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {pollData.options.length > 2 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="mt-3 button-outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>

              <div>
                <Label htmlFor="duration" className="text-emphasis flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  Poll Duration (minutes)
                </Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    id="duration"
                    min={0}
                    max={120}
                    step={5}
                    value={duration}
                    onValueChange={setDuration}
                    className="w-full"
                  />
                  <span className="text-emphasis w-20 text-center p-2 bg-input rounded-md">
                    {duration[0] === 0 ? 'No limit' : `${duration[0]} min`}
                  </span>
                </div>
                <p className="text-xs text-subtle mt-1">Set to 0 for no time limit.</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="results-visibility"
                  checked={pollData.resultsVisibleToAudience}
                  onCheckedChange={(checked) => setPollData(prev => ({ ...prev, resultsVisibleToAudience: checked }))}
                />
                <Label htmlFor="results-visibility" className="text-emphasis">
                  Show results to audience immediately
                </Label>
              </div>


              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="button-primary w-full sm:w-auto"
                >
                  Create Poll
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setDuration([0]); 
                    setPollData(prev => ({...prev, title: '', question: '', options: ['', ''], duration: 0, resultsVisibleToAudience: false}));
                  }}
                  className="button-outline w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-emphasis mb-6">Your Polls</h2>
            <div className="space-y-4">
              {polls.length === 0 ? (
                <Card className="glass-effect p-8 text-center">
                  <p className="text-subtle">No polls created yet. Create your first poll!</p>
                </Card>
              ) : (
                polls.map((poll) => (
                  <motion.div
                    key={poll.id}
                    whileHover={{ scale: 1.02 }}
                    className="glass-effect rounded-xl p-6"
                  >
                    <h3 className="text-xl font-semibold text-emphasis mb-2">{poll.title}</h3>
                    <p className="text-subtle mb-4">{poll.question}</p>
                    {poll.durationMinutes && (
                      <p className="text-sm text-primary mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> Duration: {poll.durationMinutes} minutes
                      </p>
                    )}
                     <p className="text-sm text-primary mb-2 flex items-center">
                        {poll.resultsVisibleToAudience ? <Eye className="w-4 h-4 mr-1 text-green-400"/> : <EyeOff className="w-4 h-4 mr-1 text-red-400"/>} 
                        Results visible to audience: {poll.resultsVisibleToAudience ? 'Yes' : 'No (until end/toggled)'}
                      </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {poll.options.map((option, index) => (
                        <span
                          key={index}
                          className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleLaunchSession(poll.id)}
                      className="button-primary"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Launch Session
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-emphasis mb-6">Active Sessions</h2>
            <div className="space-y-4">
              {activeSessions.filter(s => s.isActive).length === 0 ? (
                <Card className="glass-effect p-8 text-center">
                  <p className="text-subtle">No active sessions. Launch a poll to get started!</p>
                </Card>
              ) : (
                activeSessions
                  .filter(session => session.isActive)
                  .map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass-effect rounded-xl p-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-xl font-semibold text-emphasis">
                          {session.poll.title}
                        </h3>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                          Live
                        </span>
                      </div>
                      <p className="text-subtle mb-1">Code: <span className="text-accent font-semibold">{session.sessionCode}</span></p>
                       {session.durationMinutes && (
                        <p className="text-sm text-primary mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-1" /> Ends in: {Math.max(0, Math.ceil((new Date(session.endsAt).getTime() - new Date().getTime()) / 60000))} min
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mb-2">
                        <Switch
                          id={`results-visibility-active-${session.id}`}
                          checked={session.resultsVisibleToAudience}
                          onCheckedChange={() => toggleResultsVisibility(session.sessionCode)}
                          disabled={!session.isActive}
                        />
                        <Label htmlFor={`results-visibility-active-${session.id}`} className="text-emphasis text-sm">
                          Audience sees results
                        </Label>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-subtle text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.votes.reduce((sum, vote) => sum + vote.count, 0)} votes
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          {session.poll.options.length} options
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(`/session/${session.sessionCode}`)}
                        variant="outline"
                        className="button-outline w-full sm:w-auto"
                      >
                        View Session
                      </Button>
                    </motion.div>
                  ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
