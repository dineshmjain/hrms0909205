import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Button, 
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from '@material-tailwind/react';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheck, 
  FaTimes,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaHistory,
  FaLocationArrow
} from 'react-icons/fa';
import { MdLocationOn, MdTimer, MdCheckCircle } from 'react-icons/md';

const FieldOfficerAttendance = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('not_marked');
  const [todaysAttendance, setTodaysAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  // Mock office locations for geofencing
  const officeLocations = [
    {
      id: '1',
      name: 'Main Office',
      latitude: 40.7589,
      longitude: -73.9851,
      radius: 100 // meters
    },
    {
      id: '2',
      name: 'Client Site - ABC Corp',
      latitude: 40.7505,
      longitude: -73.9934,
      radius: 50
    }
  ];

  useEffect(() => {
    // Initialize attendance history
    setAttendanceHistory([
      {
        id: '1',
        date: '2024-09-10',
        checkIn: {
          time: '08:45',
          location: { lat: 40.7589, lng: -73.9851 },
          address: 'Main Office, Downtown',
          status: 'on_time'
        },
        checkOut: {
          time: '17:30',
          location: { lat: 40.7589, lng: -73.9851 },
          address: 'Main Office, Downtown',
          status: 'on_time'
        },
        workingHours: '8h 45m',
        status: 'present'
      },
      {
        id: '2',
        date: '2024-09-09',
        checkIn: {
          time: '09:15',
          location: { lat: 40.7505, lng: -73.9934 },
          address: 'ABC Corp Client Site',
          status: 'late'
        },
        checkOut: {
          time: '18:00',
          location: { lat: 40.7505, lng: -73.9934 },
          address: 'ABC Corp Client Site',
          status: 'overtime'
        },
        workingHours: '8h 45m',
        status: 'late'
      },
      {
        id: '3',
        date: '2024-09-08',
        checkIn: {
          time: '08:30',
          location: { lat: 40.7589, lng: -73.9851 },
          address: 'Main Office, Downtown',
          status: 'early'
        },
        checkOut: {
          time: '17:00',
          location: { lat: 40.7589, lng: -73.9851 },
          address: 'Main Office, Downtown',
          status: 'on_time'
        },
        workingHours: '8h 30m',
        status: 'present'
      }
    ]);

    // Check for today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendanceHistory.find(record => record.date === today);
    
    if (todayRecord) {
      setTodaysAttendance(todayRecord);
      setAttendanceStatus(todayRecord.checkOut ? 'checked_out' : 'checked_in');
    }

    // Request geolocation permission
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setGeolocationEnabled(true);
          setLocationAccuracy(position.coords.accuracy);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGeolocationEnabled(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const isWithinOfficeRadius = () => {
    if (!currentLocation) return false;

    return officeLocations.some(office => {
      const distance = calculateDistance(
        currentLocation.latitude, 
        currentLocation.longitude,
        office.latitude, 
        office.longitude
      );
      return distance <= office.radius;
    });
  };

  const getNearestOffice = () => {
    if (!currentLocation) return null;

    let nearestOffice = null;
    let minDistance = Infinity;

    officeLocations.forEach(office => {
      const distance = calculateDistance(
        currentLocation.latitude, 
        currentLocation.longitude,
        office.latitude, 
        office.longitude
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestOffice = { ...office, distance };
      }
    });

    return nearestOffice;
  };

  const markAttendance = (type) => {
    if (!geolocationEnabled || !currentLocation) {
      alert('Location access is required to mark attendance');
      return;
    }

    const withinRadius = isWithinOfficeRadius();
    if (!withinRadius) {
      alert('You must be within office premises to mark attendance');
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toISOString().split('T')[0];
    
    const nearestOffice = getNearestOffice();
    const attendanceData = {
      time,
      location: { lat: currentLocation.latitude, lng: currentLocation.longitude },
      address: nearestOffice?.name || 'Unknown Location',
      status: determineAttendanceStatus(type, time),
      accuracy: locationAccuracy
    };

    if (type === 'check_in') {
      const newAttendance = {
        id: Date.now().toString(),
        date,
        checkIn: attendanceData,
        workingHours: null,
        status: attendanceData.status === 'late' ? 'late' : 'present'
      };
      
      setTodaysAttendance(newAttendance);
      setAttendanceStatus('checked_in');
      setAttendanceHistory([newAttendance, ...attendanceHistory.filter(h => h.date !== date)]);
    } else {
      const updatedAttendance = {
        ...todaysAttendance,
        checkOut: attendanceData,
        workingHours: calculateWorkingHours(todaysAttendance.checkIn.time, time)
      };
      
      setTodaysAttendance(updatedAttendance);
      setAttendanceStatus('checked_out');
      setAttendanceHistory([updatedAttendance, ...attendanceHistory.filter(h => h.date !== date)]);
    }

    setShowMarkModal(false);
  };

  const determineAttendanceStatus = (type, time) => {
    const hour = parseInt(time.split(':')[0]);
    const minute = parseInt(time.split(':')[1]);
    
    if (type === 'check_in') {
      if (hour < 9 || (hour === 9 && minute === 0)) return 'on_time';
      if (hour < 8) return 'early';
      return 'late';
    } else {
      if (hour >= 17) return 'on_time';
      if (hour >= 18) return 'overtime';
      return 'early_out';
    }
  };

  const calculateWorkingHours = (checkInTime, checkOutTime) => {
    const [inHour, inMinute] = checkInTime.split(':').map(Number);
    const [outHour, outMinute] = checkOutTime.split(':').map(Number);
    
    const inTotalMinutes = inHour * 60 + inMinute;
    const outTotalMinutes = outHour * 60 + outMinute;
    
    const diffMinutes = outTotalMinutes - inTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_time': case 'present': case 'early': return 'green';
      case 'late': case 'early_out': return 'red';
      case 'overtime': return 'orange';
      default: return 'gray';
    }
  };

  const preventDuplicateEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceHistory.some(record => 
      record.date === today && 
      ((attendanceStatus === 'not_marked' && record.checkIn) || 
       (attendanceStatus === 'checked_in' && record.checkOut))
    );
  };

  const AttendanceMarkModal = () => (
    <Dialog open={showMarkModal} handler={() => setShowMarkModal(false)}>
      <DialogHeader>
        Mark {attendanceStatus === 'not_marked' ? 'Check-In' : 'Check-Out'}
      </DialogHeader>
      <DialogBody className="space-y-4">
        <div className="text-center">
          <FaLocationArrow className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <Typography variant="h6" color="blue-gray">
            Location Verification
          </Typography>
        </div>

        {geolocationEnabled && currentLocation ? (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <Typography variant="small" color="green" className="font-medium flex items-center gap-2">
                <FaCheck className="h-4 w-4" />
                Location verified
              </Typography>
              <Typography variant="small" color="gray">
                Accuracy: ±{Math.round(locationAccuracy)}m
              </Typography>
            </div>

            {isWithinOfficeRadius() ? (
              <div className="p-4 bg-blue-50 rounded-lg">
                <Typography variant="small" color="blue" className="font-medium">
                  ✓ Within office premises
                </Typography>
                <Typography variant="small" color="gray">
                  Nearest office: {getNearestOffice()?.name}
                </Typography>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg">
                <Typography variant="small" color="red" className="font-medium flex items-center gap-2">
                  <FaExclamationTriangle className="h-4 w-4" />
                  Outside office radius
                </Typography>
                <Typography variant="small" color="gray">
                  Distance to nearest office: {Math.round(getNearestOffice()?.distance || 0)}m
                </Typography>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-red-50 rounded-lg">
            <Typography variant="small" color="red" className="font-medium flex items-center gap-2">
              <FaTimes className="h-4 w-4" />
              Location access required
            </Typography>
            <Button 
              size="sm" 
              color="blue" 
              onClick={requestLocation}
              className="mt-2"
            >
              Enable Location
            </Button>
          </div>
        )}

        <div className="text-center">
          <Typography variant="small" color="gray">
            Current time: {new Date().toLocaleTimeString()}
          </Typography>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" onClick={() => setShowMarkModal(false)}>
          Cancel
        </Button>
        <Button 
          color="blue" 
          onClick={() => markAttendance(attendanceStatus === 'not_marked' ? 'check_in' : 'check_out')}
          disabled={!geolocationEnabled || !isWithinOfficeRadius()}
        >
          Confirm {attendanceStatus === 'not_marked' ? 'Check-In' : 'Check-Out'}
        </Button>
      </DialogFooter>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 text-white rounded-xl">
              <MdLocationOn className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Field Officer Attendance
              </Typography>
              <Typography color="gray" className="font-normal">
                Mark self-attendance with geolocation validation
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Today's Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`border-2 ${
          attendanceStatus === 'checked_out' ? 'border-green-200' :
          attendanceStatus === 'checked_in' ? 'border-blue-200' :
          'border-gray-200'
        }`}>
          <CardBody className="p-6">
            <div className="text-center">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Today's Attendance
              </Typography>
              
              <div className="mb-6">
                {attendanceStatus === 'not_marked' && (
                  <div>
                    <MdTimer className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <Typography variant="h6" color="gray">
                      Not Marked
                    </Typography>
                  </div>
                )}
                
                {attendanceStatus === 'checked_in' && todaysAttendance && (
                  <div>
                    <MdCheckCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <Typography variant="h6" color="blue">
                      Checked In
                    </Typography>
                    <Typography variant="small" color="gray">
                      {todaysAttendance.checkIn.time} at {todaysAttendance.checkIn.address}
                    </Typography>
                  </div>
                )}
                
                {attendanceStatus === 'checked_out' && todaysAttendance && (
                  <div>
                    <FaCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <Typography variant="h6" color="green">
                      Day Complete
                    </Typography>
                    <Typography variant="small" color="gray">
                      Working hours: {todaysAttendance.workingHours}
                    </Typography>
                  </div>
                )}
              </div>

              <Button
                color={attendanceStatus === 'not_marked' ? 'blue' : attendanceStatus === 'checked_in' ? 'green' : 'gray'}
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowMarkModal(true)}
                disabled={attendanceStatus === 'checked_out' || preventDuplicateEntry()}
              >
                <FaClock className="h-4 w-4" />
                {attendanceStatus === 'not_marked' ? 'Mark Check-In' :
                 attendanceStatus === 'checked_in' ? 'Mark Check-Out' :
                 'Attendance Complete'}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Location Status */}
        <Card>
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Location Status
            </Typography>
            
            {geolocationEnabled ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaCheck className="h-4 w-4 text-green-500" />
                  <Typography variant="small" color="green" className="font-medium">
                    Location services enabled
                  </Typography>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Current Location:
                  </Typography>
                  <Typography variant="small" color="gray">
                    Lat: {currentLocation?.latitude.toFixed(6)}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Lng: {currentLocation?.longitude.toFixed(6)}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Accuracy: ±{Math.round(locationAccuracy)}m
                  </Typography>
                </div>
                
                {isWithinOfficeRadius() ? (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Typography variant="small" color="green" className="font-medium flex items-center gap-2">
                      <FaMapMarkerAlt className="h-4 w-4" />
                      Within office premises
                    </Typography>
                  </div>
                ) : (
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Typography variant="small" color="orange" className="font-medium flex items-center gap-2">
                      <FaExclamationTriangle className="h-4 w-4" />
                      Outside office radius
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <FaTimes className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <Typography variant="small" color="red" className="mb-4">
                  Location access disabled
                </Typography>
                <Button size="sm" color="blue" onClick={requestLocation}>
                  Enable Location
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardBody className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
            <FaHistory className="h-5 w-5" />
            Attendance History
          </Typography>
          
          <div className="space-y-4">
            {attendanceHistory.map((record) => (
              <Card key={record.id} className="border">
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </div>
                    <Chip
                      value={record.status}
                      color={getStatusColor(record.status)}
                      size="sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                        Check-In:
                      </Typography>
                      <Typography variant="small" color="gray">
                        🕒 {record.checkIn.time}
                      </Typography>
                      <Typography variant="small" color="gray">
                        📍 {record.checkIn.address}
                      </Typography>
                      <Chip
                        value={record.checkIn.status}
                        color={getStatusColor(record.checkIn.status)}
                        size="sm"
                        className="mt-1"
                      />
                    </div>
                    
                    {record.checkOut && (
                      <div>
                        <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                          Check-Out:
                        </Typography>
                        <Typography variant="small" color="gray">
                          🕒 {record.checkOut.time}
                        </Typography>
                        <Typography variant="small" color="gray">
                          📍 {record.checkOut.address}
                        </Typography>
                        <Chip
                          value={record.checkOut.status}
                          color={getStatusColor(record.checkOut.status)}
                          size="sm"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  {record.workingHours && (
                    <div className="mt-3 p-2 bg-blue-50 rounded">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Working Hours: {record.workingHours}
                      </Typography>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Attendance Mark Modal */}
      <AttendanceMarkModal />
    </div>
  );
};

export default FieldOfficerAttendance;