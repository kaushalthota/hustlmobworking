import React from 'react';
import { CheckCircle, Package, Clock, Truck, Flag, AlertTriangle } from 'lucide-react';

interface TaskStatusMessageProps {
  status: string;
  notes?: string;
  timestamp: Date;
  userName?: string;
}

const TaskStatusMessage: React.FC<TaskStatusMessageProps> = ({ status, notes, timestamp, userName }) => {
  const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'picked_up':
        return <Package className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'on_way':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <Flag className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'accepted': return 'bg-blue-50 border-blue-100';
      case 'picked_up': return 'bg-yellow-50 border-yellow-100';
      case 'in_progress': return 'bg-orange-50 border-orange-100';
      case 'on_way': return 'bg-purple-50 border-purple-100';
      case 'delivered': return 'bg-green-50 border-green-100';
      case 'completed': return 'bg-green-50 border-green-100';
      case 'cancelled': return 'bg-red-50 border-red-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'accepted': return 'text-blue-800';
      case 'picked_up': return 'text-yellow-800';
      case 'in_progress': return 'text-orange-800';
      case 'on_way': return 'text-purple-800';
      case 'delivered': return 'text-green-800';
      case 'completed': return 'text-green-800';
      case 'cancelled': return 'text-red-800';
      default: return 'text-gray-800';
    }
  };

  const getNotesColor = () => {
    switch (status) {
      case 'accepted': return 'text-blue-600';
      case 'picked_up': return 'text-yellow-600';
      case 'in_progress': return 'text-orange-600';
      case 'on_way': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex justify-center my-4 animate-fadeIn">
      <div className={`${getStatusColor()} rounded-lg px-4 py-3 inline-flex items-start shadow-md border max-w-md`}>
        {getStatusIcon()}
        <div className="ml-2">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {userName ? `${userName} updated status to ` : 'Status updated to '}
            <span className="font-bold">{formatStatus(status)}</span>
          </p>
          {notes && (
            <p className={`text-xs ${getNotesColor()} mt-1 italic`}>
              "{notes}"
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formatTimestamp(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusMessage;