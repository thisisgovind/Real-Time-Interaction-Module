
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, StopCircle } from 'lucide-react';

const AdminControls = ({ session, onEndSession, onToggleResults }) => {
  if (!session.isActive) return null;

  return (
    <Card className="glass-effect p-4 sm:p-6 mt-6">
      <h3 className="text-lg font-semibold text-emphasis mb-4">Admin Controls</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`results-visibility-session-${session.id}`} className="text-emphasis flex items-center">
            {session.resultsVisibleToAudience ? <Eye className="w-4 h-4 mr-2 text-green-400"/> : <EyeOff className="w-4 h-4 mr-2 text-red-400"/>}
            Audience Sees Results
          </Label>
          <Switch
            id={`results-visibility-session-${session.id}`}
            checked={session.resultsVisibleToAudience}
            onCheckedChange={onToggleResults}
            disabled={!session.isActive}
          />
        </div>
        <Button
          onClick={onEndSession}
          variant="destructive"
          className="w-full"
          disabled={!session.isActive}
        >
          <StopCircle className="w-4 h-4 mr-2" />
          End Session
        </Button>
      </div>
    </Card>
  );
};

export default AdminControls;
