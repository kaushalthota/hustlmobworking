import React, { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, User, Route, ChevronDown, ChevronUp, Navigation, Zap } from 'lucide-react';
import { mapsLoader } from '../lib/maps';
import { taskService } from '../lib/database';
import { auth } from '../lib/firebase';
import { Location } from '../lib/locationService';
import toast from 'react-hot-toast';

interface RouteTaskSuggestionsProps {
  currentTask: any;
  userLocation?: Location | null;
}

interface RouteTask {
  id: string;
  title: string;
  description: string;
  location: string;
  location_coords: Location;
  estimated_time: string;
  price: number;
  creator?: {
    full_name: string;
    avatar_url?: string;
  };
  distanceFromRoute: number;
  category: string;
}

const RouteTaskSuggestions: React.FC<RouteTaskSuggestionsProps> = ({
  currentTask,
  userLocation
}) => {
  const [routeTasks, setRouteTasks] = useState<RouteTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [routePolyline, setRoutePolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (userLocation && currentTask?.location_coords) {
      findTasksOnRoute();
    }
  }, [userLocation, currentTask]);

  const findTasksOnRoute = async () => {
    if (!userLocation || !currentTask?.location_coords) return;

    setLoading(true);
    try {
      // Get all open tasks
      const user = auth.currentUser;
      if (!user) return;

      const filters = [
        { field: 'status', operator: '==', value: 'open' },
        { field: 'created_by', operator: '!=', value: user.uid }
      ];

      const allTasks = await taskService.getTasks(filters);
      
      // Filter tasks that have location coordinates
      const tasksWithCoords = allTasks.filter(task => 
        task.location_coords?.lat && task.location_coords?.lng
      );

      if (tasksWithCoords.length === 0) {
        setRouteTasks([]);
        setLoading(false);
        return;
      }

      // Get route from user location to current task destination
      const route = await getRoute(userLocation, currentTask.location_coords);
      
      if (!route) {
        setLoading(false);
        return;
      }

      // Check which tasks are within 300 meters of the route
      const tasksOnRoute: RouteTask[] = [];
      
      for (const task of tasksWithCoords) {
        const distanceFromRoute = calculateDistanceFromRoute(
          task.location_coords,
          route
        );
        
        // If task is within 300 meters of the route
        if (distanceFromRoute <= 0.3) { // 0.3 km = 300 meters
          tasksOnRoute.push({
            ...task,
            distanceFromRoute
          });
        }
      }

      // Sort by distance from route (closest first)
      tasksOnRoute.sort((a, b) => a.distanceFromRoute - b.distanceFromRoute);

      setRouteTasks(tasksOnRoute);
    } catch (error) {
      console.error('Error finding tasks on route:', error);
      toast.error('Error finding tasks on your route');
    } finally {
      setLoading(false);
    }
  };

  const getRoute = async (origin: Location, destination: Location): Promise<google.maps.DirectionsRoute | null> => {
    try {
      const { DirectionsService } = await mapsLoader.importLibrary('routes');
      const directionsService = new DirectionsService();

      const result = await directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING
      });

      if (result.status === 'OK' && result.routes && result.routes[0]) {
        return result.routes[0];
      }

      return null;
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  };

  const calculateDistanceFromRoute = (
    taskLocation: Location,
    route: google.maps.DirectionsRoute
  ): number => {
    if (!route.overview_path) return Infinity;

    let minDistance = Infinity;
    const taskLatLng = new google.maps.LatLng(taskLocation.lat, taskLocation.lng);

    // Check distance to each point on the route
    for (let i = 0; i < route.overview_path.length - 1; i++) {
      const segmentStart = route.overview_path[i];
      const segmentEnd = route.overview_path[i + 1];
      
      // Calculate distance from task location to this route segment
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        taskLatLng,
        segmentStart
      );
      
      minDistance = Math.min(minDistance, distance);
    }

    // Convert from meters to kilometers
    return minDistance / 1000;
  };

  const formatDistance = (distanceKm: number): string => {
    const meters = distanceKm * 1000;
    if (meters < 100) {
      return `${Math.round(meters)}m from route`;
    }
    return `${Math.round(meters)}m from route`;
  };

  const handleTaskClick = (task: RouteTask) => {
    // Dispatch event to view task details
    window.dispatchEvent(new CustomEvent('view-task', { 
      detail: { taskId: task.id } 
    }));
  };

  if (!userLocation || !currentTask?.location_coords) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Route className="w-5 h-5 text-[#0038FF] mr-2" />
            <h3 className="font-medium text-gray-900">
              Tasks On Your Route
              {routeTasks.length > 0 && (
                <span className="ml-2 bg-[#0038FF] text-white text-xs px-2 py-1 rounded-full">
                  {routeTasks.length}
                </span>
              )}
            </h3>
          </div>
          <div className="flex items-center">
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0038FF] mr-2"></div>
            )}
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0038FF] mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Finding tasks on your route...</p>
            </div>
          ) : routeTasks.length === 0 ? (
            <div className="p-4 text-center">
              <Navigation className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No tasks found on your route</p>
              <p className="text-xs text-gray-400 mt-1">
                We'll check for tasks within 300m of your path to {currentTask.location}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <MapPin className="w-3 h-3 mr-1" />
                <span>Tasks within 300m of your route to {currentTask.location}</span>
              </div>
              
              {routeTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{task.title}</h4>
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                          <Route className="w-3 h-3 mr-1" />
                          On Your Route
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">{task.description}</p>
                    </div>
                    <div className="ml-3 text-right">
                      <div className="text-sm font-bold text-[#0038FF]">${task.price}</div>
                      <div className="text-xs text-gray-500">{task.estimated_time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate max-w-[120px]">{task.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600 font-medium">
                        {formatDistance(task.distanceFromRoute)}
                      </span>
                      
                      {task.creator && (
                        <div className="flex items-center">
                          {task.creator.avatar_url ? (
                            <img
                              src={task.creator.avatar_url}
                              alt={task.creator.full_name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="w-2 h-2 text-gray-500" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500">
                  <Zap className="w-3 h-3 mr-1 text-[#0038FF]" />
                  <span>Earn extra money by completing tasks along your route!</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteTaskSuggestions;