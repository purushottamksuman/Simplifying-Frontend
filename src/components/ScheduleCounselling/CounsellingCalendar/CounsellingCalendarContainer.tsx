import { useEffect, useState } from "react"
import { CounsellingCalendar } from "./CounsellingCalendar"
import { supabase } from "../../../lib/supabase"
import { Slot } from "../../../types/scheduleCounselling/slots"
import toast, { Toaster } from "react-hot-toast"
import { razorpayService } from "../../../lib/razorpay"

export const CounsellingCalendarContainer = () => {

    const [slots, setSlots] = useState<Slot[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

    // ✅ Fetch slots from Supabase
    useEffect(() => {
        const fetchSlots = async () => {
        const { data, error } = await supabase
            .from("counselling_schedules")
            .select("*")
            .order("session_date", { ascending: true })
            .order("session_time", { ascending: true })

        if (error) {
            toast.error("Error fetching slots: " + error.message)
        } else {
            setSlots(data as Slot[])
        }
        }

        fetchSlots()
    }, [])

    const getSlotForDate = (date: Date) => {
        return slots.filter(
        (s) => new Date(s.session_date).toDateString() === date.toDateString()
        )
    }

    const handleSlotClick = (slot: Slot) => {
        if (slot.students.length >= slot.capacity) {
            toast.error("This slot is full ❌")
            return
        }
        setSelectedSlot(slot)
    }

    const handleBooking = async () => {
        if (!selectedSlot) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Please log in to book a slot ❌");
            return;
        }
        const userId = user.id;

        if (selectedSlot.students.includes(userId)) {
            toast.error("You already booked this slot ❌");
            return;
        }

        try {
            // 1️⃣ Start Razorpay payment
            const paymentResult = await razorpayService.initiatePayment({
            amount: 500, // your counselling fee
            currency: "INR",
            description: "Counselling Session Booking",
            notes: { slot_id: selectedSlot.id, user_id: userId },
            });

            if (paymentResult.success) {
            // 2️⃣ Payment verified successfully → update Supabase
            const { error } = await supabase
                .from("counselling_schedules")
                .update({
                students: [...selectedSlot.students, userId],
                updated_at: new Date().toISOString(),
                })
                .eq("id", selectedSlot.id);

            if (error) {
                toast.error("Booking failed after payment: " + error.message);
            } else {
                toast.success("Booking confirmed ✅");
                setSelectedSlot(null);
                setSelectedDate(null);

                const { data } = await supabase.from("counselling_schedules").select("*");
                setSlots(data as Slot[]);
            }
            } else {
            toast.error("Payment not completed ❌");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Payment failed ❌ " + error.message);
        }
    };

    // Simple calendar: show next 30 days
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        return d
    })

    return (
        <>
            <CounsellingCalendar 
                days={days}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                getSlotForDate={getSlotForDate}
                selectedSlot={selectedSlot}
                handleSlotClick={handleSlotClick}
                handleBooking={handleBooking}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
            <Toaster 
                position="top-right" 
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#3479ff",
                        color: "#fff",
                        fontWeight: "500",
                    },
                }} 
            />
        </>
    )
}
