type ScheduleCounsellingProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  capacity: number;
  setCapacity: (capacity: number) => void;
  message?: { type: "success" | "error"; text: string };
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const ScheduleCounselling = ({
    isOpen,
    setIsOpen,
    date,
    setDate,
    time,
    setTime,
    capacity,
    setCapacity,
    message,
    handleSubmit,
}: ScheduleCounsellingProps) => {

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
      >
        Schedule Counselling
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">Schedule Counselling Session</h2>
            <p className="text-sm text-gray-600 mb-4">Enter the details for the counselling session.</p>

            {/* Success/Error message */}
            {message && (
              <div
                className={`mb-3 p-2 rounded ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium">Time</label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium">Capacity</label>
                <input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
