import { useEffect } from "react";

function EventWatcher() {

    // Refresh and store a list of all events
    const refreshEvents = async () => {
        console.log('refreshing');
        
    }

    useEffect(() => {
        const refreshTimer = setInterval(refreshEvents, 2000);
        return () => clearInterval(refreshTimer);
    }, []);
}

export default EventWatcher;