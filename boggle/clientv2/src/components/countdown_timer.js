import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CountdownTimer({ seconds, url, restfunction }) {
    const [time, setTime] = useState(seconds);
    const navigate = useNavigate();

    useEffect(() => {
        if (time > 0) {
            setTimeout(() => {
                setTime(time - 1);
            }, 1000);
        } else {
            if (restfunction) {
                restfunction();
            }
            navigate(url);
        }
    }, [time]);

    return (
        <div>
            <h1>{time}</h1>
        </div>
    );
}
