import { useState } from "react"
import { ScheduleCounselling } from "./ScheduleCounselling"
import { supabase } from "../../lib/supabase"

export const ScheduleCounsellingContainer = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [capacity, setCapacity] = useState("")
    interface Message {
        type: "error" | "success";
        text: string;
    }

    const [message, setMessage] = useState<Message | null>(null)

    interface HandleSubmitEvent {
        preventDefault: () => void;
    }

    const handleSubmit = async (e: HandleSubmitEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (!date || !time || !capacity) {
        setMessage({ type: "error", text: "Please fill in all fields." });
        return;
    }

    if (parseInt(capacity) <= 0) {
        setMessage({ type: "error", text: "Capacity should be greater than 0." });
        return;
    }

    // ✅ Insert into DB
    const { error } = await supabase
        .from("counselling_schedules")
        .insert([
        {
            session_date: date,
            session_time: time,
            capacity: parseInt(capacity),
        },
        ]);

    if (error) {
        setMessage({ type: "error", text: error.message });
        return;
    }

    setMessage({
        type: "success",
        text: `Session on ${date} at ${time} with capacity ${capacity} saved successfully.`,
    });

    // ✅ Reset fields & close dialog
    setDate("");
    setTime("");
    setCapacity("");
    setTimeout(() => setIsOpen(false), 1000); // auto-close after 1s
    };

    return (
        <ScheduleCounselling 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            capacity={capacity ? Number(capacity) : 0}
            setCapacity={(capacity: number) => setCapacity(capacity.toString())}
            message={message ?? undefined}
            handleSubmit={handleSubmit}
        />
    )
}