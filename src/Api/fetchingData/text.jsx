import React, { useState, useRef, useMemo } from 'react';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Filter,
  Download,
  Plus,
  Info,
  User,
  Clock,
  DollarSign,
  X,
  Edit,
  Trash2,
  BedDouble,
  BedSingle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { set } from 'date-fns/fp';

export const RoomPlanner = () => {
  const rooms = useSelector((state) => state.listRoom);
  const bookings = useSelector((state) => state.mockBookings);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const timelineRef = useRef(null);
  const [showaddnewBookingModal, setShowaddnewBookingModal] = useState(false);
  
  // New state for selection and modals
  const [selection, setSelection] = useState({
    isSelecting: false,
    room: null,
    startDate: null,
    endDate: null,
    startIndex: -1,
    endIndex: -1
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // NEW: Group rooms by type
  const groupedRooms = useMemo(() => {
    const groups = {};
    
    rooms.forEach(room => {
      if (!groups[room.type]) {
        groups[room.type] = [];
      }
      groups[room.type].push(room);
    });
    
    // Sort groups by custom order
    const groupOrder = ['single', 'double', 'suite', 'deluxe'];
    return groupOrder
      .filter(type => groups[type])
      .map(type => ({
        type,
        rooms: groups[type]
      }));
  }, [rooms]);

  // Memoized date range calculation with proper time boundaries
  const dateRange = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    if (viewMode === 'week') {
      start.setDate(start.getDate() - start.getDay());
      end.setDate(start.getDate() + 6);
    } else {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    
    // Normalize to start and end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  }, [currentDate, viewMode]);

  // Generate days array for timeline headers
  const days = useMemo(() => {
    const daysArray = [];
    const current = new Date(dateRange.start);
    
    while (current <= dateRange.end) {
      daysArray.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return daysArray;
  }, [dateRange]);

  // Calculate booking position with proper clipping to current range
  const getBookingPosition = (booking) => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const startTime = dateRange.start.getTime();
    const endTime = dateRange.end.getTime();
    const checkInTime = checkIn.getTime();
    const checkOutTime = checkOut.getTime();

    // Calculate visible portion of booking within current range
    const visibleStart = Math.max(checkInTime, startTime);
    const visibleEnd = Math.min(checkOutTime, endTime);
    
    // Calculate day-based positions
    const dayWidth = 120 * zoomLevel;
    const startOffsetDays = (visibleStart - startTime) / (1000 * 60 * 60 * 24);
    const visibleDurationDays = (visibleEnd - visibleStart) / (1000 * 60 * 60 * 24);
    
    return {
      left: `${startOffsetDays * dayWidth}px`,
      width: `${Math.max(0, visibleDurationDays) * dayWidth}px`
    };
  };

  // Handle mouse events for date range selection
  const handleMouseDown = (e, room, index) => {
    // Only start selection if clicking on day grid (not on existing booking)
    if (e.target.className.includes('grid-line') || 
        e.target.className.includes('relative')) {
      setSelection({
        isSelecting: true,
        room,
        startDate: days[index],
        endDate: days[index],
        startIndex: index,
        endIndex: index
      });
    }
  };

  const handleMouseMove = (e, room, index) => {
    if (selection.isSelecting && selection.room?.id === room.id) {
      setSelection(prev => ({
        ...prev,
        endDate: days[index],
        endIndex: index
      }));
    }
  };

  const handleMouseUp = () => {
    if (selection.isSelecting) {
      // Normalize start and end dates
      const startIdx = Math.min(selection.startIndex, selection.endIndex);
      const endIdx = Math.max(selection.startIndex, selection.endIndex);
      const startDate = days[startIdx];
      const endDate = days[endIdx];
      
      // Add one day to end date for checkout
      const checkoutDate = new Date(endDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      setSelection(prev => ({
        ...prev,
        isSelecting: false,
        startDate,
        endDate: checkoutDate
      }));
      
      // Show booking modal
      setShowBookingModal(true);
       setShowaddnewBookingModal(false);

    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500 border-blue-600';
      case 'checked-in': return 'bg-emerald-500 border-emerald-600';
      case 'checked-out': return 'bg-gray-500 border-gray-600';
      case 'cancelled': return 'bg-red-500 border-red-600';
      case 'no-show': return 'bg-orange-500 border-orange-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'checked-in': return 'Checked In';
      case 'checked-out': return 'Checked Out';
      case 'cancelled': return 'Cancelled';
      case 'no-show': return 'No Show';
      default: return status;
    }
  };

  const handleBookingHover = (booking, event) => {
    setSelectedBooking(booking);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setShowTooltip(true);
  };

  const handleBookingLeave = () => {
    setShowTooltip(false);
    setSelectedBooking(null);
  };

  // NEW: Handle booking click for detail modal
  const handleBookingClick = (booking) => {
    setEditingBooking(booking);
    setShowBookingDetailModal(true);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // NEW: Handle booking update
  const handleUpdateBooking = () => {
    // In a real app, you would dispatch an action to update the booking
    console.log("Updated booking:", editingBooking);
    setShowBookingDetailModal(false);
    // Show success message or update UI
  };

  // NEW: Handle booking deletion
  const handleDeleteBooking = () => {
    // In a real app, you would dispatch an action to delete the booking
    console.log("Deleted booking:", editingBooking.id);
    setShowBookingDetailModal(false);
    // Show success message or update UI
  };
  const showbookinform=()=>{
    setShowBookingModal(true);
    setShowaddnewBookingModal(true);

  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Planner</h1>
          <p className="text-gray-600 mt-2">Visual timeline of room bookings and availability</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={showbookinform} className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Booking</span>
          </button>
          <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                {viewMode === 'week' 
                  ? `Week of ${currentDate.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })
                }
              </div>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              Today
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={zoomLevel >= 2}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-700">Status Legend:</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-xs text-gray-600">Checked In</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-xs text-gray-600">Checked Out</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600">Cancelled</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-600">No Show</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* Room List */}
          <div className="w-48 bg-gray-50 border-r border-gray-200">
            <div className="h-16 flex items-center px-4 border-b border-gray-200 bg-gray-100">
              <span className="font-semibold text-gray-900">Rooms</span>
            </div>
            
            {/* NEW: Grouped room list */}
            {groupedRooms.map((group, groupIndex) => (
              <div key={group.type}>
                {/* Group header */}
                <div className="h-10 flex items-center px-4 border-b border-gray-200 bg-gray-50">
                 <BedSingle className="w-5 h-5 m-2 text-blue-600" />
                  <span className="font-semibold text-gray-700 text-sm"> {group.type} Rooms</span>
                </div>
                
                {/* Rooms in group */}
                {group.rooms.map((room) => (
                  <div key={room.id} className="h-20 flex items-center px-4 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Room {room.number}</div>
                      <div className="text-sm text-gray-600">{room.type} • Floor {room.floor}</div>
                      <div className="text-xs text-gray-500">${room.price}/night</div>
                    </div>
                  </div>
                ))}
                
                {/* Add separator between groups */}
                {groupIndex < groupedRooms.length - 1 && (
                  <div className="border-b border-gray-300"></div>
                )}
              </div>
            ))}
          </div>

          {/* Timeline Content */}
          <div className="flex-1 overflow-x-auto" ref={timelineRef}>
            <div style={{ minWidth: `${days.length * 120 * zoomLevel}px` }}>
              {/* Date Headers */}
              <div className="h-16 flex border-b border-gray-200 bg-gray-50">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 border-r border-gray-200 flex flex-col items-center justify-center"
                    style={{ width: `${120 * zoomLevel}px` }}
                  >
                    <div className="text-xs text-gray-500">
                      {day.toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* NEW: Grouped timeline */}
              {groupedRooms.map((group, groupIndex) => (
                <React.Fragment key={group.type}>
                  {/* Group header */}
                  <div className="h-10 flex items-center border-b border-gray-200 bg-gray-50">
                    <div className="pl-4 font-semibold text-gray-700 text-sm">
                      {group.type} Rooms
                    </div>
                  </div>
                  
                  {/* Rooms in group */}
                  {group.rooms.map((room) => (
                    <div 
                      key={room.id} 
                      className="h-20 border-b border-gray-200 relative"
                      onMouseUp={handleMouseUp}
                    >
                      {/* Day Grid */}
                      {days.map((day, index) => (
                        <div
                          key={index}
                          className="absolute border-r border-gray-100 h-full grid-line"
                          style={{
                            left: `${index * 120 * zoomLevel}px`,
                            width: `${120 * zoomLevel}px`
                          }}
                          onMouseDown={(e) => handleMouseDown(e, room, index)}
                          onMouseMove={(e) => handleMouseMove(e, room, index)}
                        />
                      ))}

                      {/* Selection highlight */}
                      {selection.isSelecting && selection.room?.id === room.id && (
                        <div 
                          className="absolute top-0 bottom-0 bg-blue-200 opacity-40"
                          style={{
                            left: `${Math.min(selection.startIndex, selection.endIndex) * 120 * zoomLevel}px`,
                            width: `${(Math.abs(selection.endIndex - selection.startIndex) + 1) * 120 * zoomLevel}px`
                          }}
                        />
                      )}

                      {/* Booking Blocks */}
                      {bookings
                        .filter(booking => {
                          // Only show bookings that overlap with current date range
                          const checkIn = new Date(booking.checkIn);
                          const checkOut = new Date(booking.checkOut);
                          return (
                            booking.roomId === room.id &&
                            checkIn <= dateRange.end && 
                            checkOut >= dateRange.start
                          );
                        })
                        .map((booking) => {
                          const position = getBookingPosition(booking);
                          return (
                            <div
                              key={booking.id}
                              className={`absolute top-2 bottom-2 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg hover:z-10 booking-block ${getStatusColor(booking.status)}`}
                              style={position}
                              onMouseEnter={(e) => handleBookingHover(booking, e)}
                              onMouseLeave={handleBookingLeave}
                              onMouseMove={(e) => setTooltipPosition({ x: e.clientX, y: e.clientY })}
                              onClick={() => handleBookingClick(booking)}
                            >
                              <div className="p-2 text-white text-xs">
                                <div className="font-medium truncate">{booking.clientName}</div>
                                <div className="opacity-90 truncate">
                                  {new Date(booking.checkIn).toLocaleDateString('en', { month: 'short', day: 'numeric' })} - 
                                  {new Date(booking.checkOut).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                  
                  {/* Add separator between groups */}
                  {groupIndex < groupedRooms.length - 1 && (
                    <div className="border-b border-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && selectedBooking && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900">{selectedBooking.clientName}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">{selectedBooking.roomNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">
                  {new Date(selectedBooking.checkIn).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">
                  {new Date(selectedBooking.checkOut).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)} text-white`}>
                  {getStatusText(selectedBooking.status)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-emerald-600">
                  ${selectedBooking.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedBooking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                  selectedBooking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">New Booking</h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {
                  !showaddnewBookingModal ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800">Selected Dates</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Check-in</label>
                      <div className="font-medium">
                        {selection.startDate ? formatDate(selection.startDate) : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Check-out</label>
                      <div className="font-medium">
                        {selection.endDate ? formatDate(selection.endDate) : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="text-sm text-gray-600">Room</label>
                    <div className="font-medium">
                      Room {selection.room?.number} - {selection.room?.type}
                    </div>
                  </div>
                </div>
                  ):(
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {/* Room Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                           Room Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter room number"
                            value={selection.roomNumber || ''}
                            onChange={(e) =>
                              setSelection({ ...selection, roomNumber: e.target.value })
                            }
                          />
                        </div>

                        {/* Room Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                             Room Type
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selection.roomType || ''}
                            onChange={(e) =>
                              setSelection({ ...selection, roomType: e.target.value })
                            }
                          >
                            <option value="">-- Select Room Type --</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="suite">Suite</option>
                            <option value="deluxe">Deluxe</option>
                          </select>
                        </div>

                        {/* Check-in */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                             Check-in Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => {
                              const selectedDate = new Date(e.target.value);
                              setSelection({
                                ...selection,
                                startDate: selectedDate,
                                endDate: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
                              });
                            }}
                          />
                        </div>

                        {/* Check-out */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                             Check-out Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => {
                              const selectedDate = new Date(e.target.value);
                              setSelection({
                                ...selection,
                                endDate: selectedDate,
                              });
                            }}
                          />
                        </div>

                      </div>

                  )
                }
                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <select 
                        
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                      <option value="">-- Select Payment Method --</option>
                      <option value="credit-card">💳 Credit Card</option>
                      <option value="versement">💸 Versement</option>
                      <option value="check">🧾 Check</option>
                      <option value="ispis">📄 Ispis</option>
                        </select>
                      </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter guest name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email or phone number"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking Status
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Confirmed</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

  {/* Wider Booking Detail Modal */}
{showBookingDetailModal && editingBooking && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
          <button 
            onClick={() => setShowBookingDetailModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Two-column layout */}
            {/* Left Column */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  Guest Information
                </h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  value={editingBooking.clientName}
                  onChange={(e) => setEditingBooking({...editingBooking, clientName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter guest name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={editingBooking.contact || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, contact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email or phone number"
                />
              </div>
          
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  Booking Details
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in
                  </label>
                  <div className="font-medium">
                    {formatDate(new Date(editingBooking.checkIn))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out
                  </label>
                  <div className="font-medium">
                    {formatDate(new Date(editingBooking.checkOut))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <div className="font-medium">
                    Room {editingBooking.roomNumber} - {editingBooking.roomType || 'Standard'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    value={editingBooking.guests || 1}
                    onChange={(e) => setEditingBooking({...editingBooking, guests: parseInt(e.target.value) || 1})}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Section */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Info className="w-5 h-5 text-gray-400 mr-2" />
                  Status & Payment
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select 
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment
                  </label>
                  <select 
                    value={editingBooking.paymentStatus}
                    onChange={(e) => setEditingBooking({...editingBooking, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                   <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select 
                    value={editingBooking.paymentStatus}
                    onChange={(e) => setEditingBooking({...editingBooking, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                <option value="">-- Select Payment Method --</option>
                <option value="credit-card">💳 Credit Card</option>
                <option value="versement">💸 Versement</option>
                <option value="check">🧾 Check</option>
                <option value="ispis">📄 Ispis</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Financial Section */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                  Financial Information
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={editingBooking.totalAmount}
                      onChange={(e) => setEditingBooking({...editingBooking, totalAmount: parseFloat(e.target.value) || 0})}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deposit Paid
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={editingBooking.deposit || 0}
                      onChange={(e) => setEditingBooking({...editingBooking, deposit: parseFloat(e.target.value) || 0})}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              value={editingBooking.requests || ''}
              onChange={(e) => setEditingBooking({...editingBooking, requests: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special requirements or notes..."
            />
          </div>
          
          <div className="pt-4 flex justify-between">
            <button
              onClick={handleDeleteBooking}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Booking</span>
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBookingDetailModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Update Booking</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};