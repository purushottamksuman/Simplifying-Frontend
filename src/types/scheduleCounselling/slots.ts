export type Slot = {
  id: string
  session_date: string // YYYY-MM-DD
  session_time: string // HH:mm:ss
  capacity: number
  students: string[]
}

export type CounsellingCalendarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  selectedSlot: Slot | null;
  days: Date[];
  getSlotForDate: (date: Date) => Slot[];
  handleSlotClick: (slot: Slot) => void;
  handleBooking: () => void;
};