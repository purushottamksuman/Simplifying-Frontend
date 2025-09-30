import { CounsellingCalendarProps } from "../../../types/scheduleCounselling/slots";



export const CounsellingCalendar = ({
    isOpen,
    setIsOpen,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    days,
    getSlotForDate,
    handleSlotClick,
    handleBooking,
}: CounsellingCalendarProps) => {

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Open Counselling Calendar
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Book a Counselling Slot</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {days.map((date) => {
                const slotList = getSlotForDate(date)
                const isAvailable = slotList.some(
                  (s) => s.students.length < s.capacity
                )
                const isFull =
                  slotList.length > 0 &&
                  slotList.every((s) => s.students.length >= s.capacity)

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded-md text-sm ${
                      isFull
                        ? "bg-red-200 text-red-700 cursor-not-allowed"
                        : isAvailable
                        ? "bg-green-200 hover:bg-green-300"
                        : "bg-gray-100"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>

            {/* Slots */}
            {selectedDate && (
              <div className="border rounded-md p-3 mb-3">
                <h3 className="font-medium mb-2">
                  Slots for {selectedDate.toDateString()}
                </h3>
                <div className="flex flex-col gap-2">
                  {getSlotForDate(selectedDate).map((slot) => {
                    const isFull = slot.students.length >= slot.capacity
                    return (
                      <button
                        key={slot.id}
                        disabled={isFull}
                        onClick={() => handleSlotClick(slot)}
                        className={`px-3 py-2 rounded-md text-sm text-left border ${
                          isFull
                            ? "bg-red-200 text-red-700 cursor-not-allowed"
                            : selectedSlot?.id === slot.id
                            ? "bg-blue-500 text-white"
                            : "bg-green-100 hover:bg-green-200"
                        }`}
                      >
                        {slot.session_time} (
                        {slot.students.length}/{slot.capacity})
                      </button>
                    )
                  })}
                  {getSlotForDate(selectedDate).length === 0 && (
                    <p className="text-sm text-gray-500">No slots available</p>
                  )}
                </div>
              </div>
            )}

            {/* Booking Button */}
            {selectedSlot && (
              <button
                onClick={handleBooking}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Book Slot at {selectedSlot.session_time}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
