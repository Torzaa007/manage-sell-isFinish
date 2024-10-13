<script>
    export let data;

    let tripsQ = []; // Initially empty, will be filled after querying
    let trips = data.trips;
    let selectedTrip = null; // Selected trip
    let selectedSeatType = ""; // Selected seat type
    let amount = "";
    let showSeats = false; // Control whether the seat selection is shown
    let storeSuccessMessage = ""; // To store confirmation messages
    
    // Handle trip selection
    async function handleTripSelection(trip) {
        selectedTrip = trip;
        showSeats = false; // Hide seat selection when a new trip is selected

        console.log("Selected Trip:", selectedTrip); // Log selected trip details

        // Store trip_id in sessionStorage
        sessionStorage.setItem('selectedTrip', JSON.stringify({
            tripId: selectedTrip.trip_id,
            start: selectedTrip.start,
            end: selectedTrip.end,
            price: selectedTrip.price,
            from_datetime: selectedTrip.from_datetime,
            arrivalTime: selectedTrip.arrivalTime
        }));

        // Send the trip ID to the backend
        try {
            const response = await fetch("/sell/info/selecttrip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tripId: selectedTrip.trip_id }),
            });

            const result = await response.json();
            if (result.success) {
                console.log("Trip details successfully fetched from the backend:", result.tripsQ);
                tripsQ = result.tripsQ; // Store the queried seat information in tripsQ
            } else {
                console.error("Failed to fetch trip details from the backend.");
            }
        } catch (error) {
            console.error("Error while fetching trip details:", error);
        }
    }

    // Show seat options
    function handleShowSeats() {
        console.log("Showing seats for selected trip:", selectedTrip);
        showSeats = true; // Display seat selection dropdowns
    }
</script>

<nav class="bg-[#EADBC8] shadow-xl border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-24">
            <div class="flex">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="text-2xl font-bold text-[#102C57]">OURTRAINS</a>
                </div>
            </div>
        </div>
    </div>
</nav>

<div class="p-8 bg-white min-h-screen">
    <h1 class="text-3xl text-[#102C57] underline font-bold mb-6 text-center">ออกตั๋วโดยสาร</h1>

    <!-- Display Success Message -->
    {#if storeSuccessMessage}
        <div class="p-4 mb-4 text-green-800 bg-green-200 rounded">
            {storeSuccessMessage}
        </div>
    {/if}

    <!-- Trip details -->
    <div class="border-t mb-6"></div>
    <div class="overflow-auto max-h-96">
        {#each trips as trip}
        <div class="bg-gray-300 p-4 rounded mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
            <div>
                <p class="font-bold">จาก {trip.start} - {trip.end} {trip.from_datetime}</p>
                <p>เที่ยวโดยสาร {trip.trip_id} {trip.start} - {trip.end} ประเภท ชั้น {trip.class}</p>
                <p>ออกเดินทาง {trip.from_datetime} ถึง {trip.arrivalTime}</p>
            </div>
            <!-- Buttons for trip selection and showing seat options -->
            <div class="flex space-x-2 mt-2 sm:mt-0">
                <!-- Select Trip button -->
                <button 
                    class={`px-8 py-2 rounded ${selectedTrip === trip ? "bg-green-500" : "bg-[#102C57]"} text-white`} 
                    on:click={() => handleTripSelection(trip)}>
                    เลือก
                </button>
                
                <!-- Show Seats button, only visible after selecting a trip -->
                {#if selectedTrip === trip}
                    <button 
                        class={`px-8 py-2 rounded ${showSeats ? "bg-green-500" : "bg-[#102C57]"} text-white`} 
                        on:click={handleShowSeats}>
                        แสดงที่นั่ง
                    </button>
                {/if}
            </div>
        </div>
        {/each}
    </div>

    <!-- Seat selection section, only visible after clicking "แสดงที่นั่ง" -->
    {#if showSeats}
    <hr class="mb-6" />
    <h2 class="text-xl font-bold mb-4">เลือกที่นั่ง</h2>

    <!-- Display queried trip details -->
    {#if tripsQ.length > 0}
    <table class="table-auto w-full">
        <thead>
            <tr>
                <th class="px-4 py-2">Seat Type</th>
                <th class="px-4 py-2">Available Seats</th>
            </tr>
        </thead>
        <tbody>
            {#each tripsQ as trip}
            <tr>
                <td class="border px-4 py-2">{trip.seat_type}</td>
                <td class="border px-4 py-2">{trip.available_seats}</td>
            </tr>
            {/each}
        </tbody>
    </table>
    {/if}

    <!-- Seat selection dropdowns -->
    <div class="grid grid-cols-3 gap-4 mb-6">
        <select class="bg-gray-300 border p-2 rounded" bind:value={selectedSeatType} on:change={() => console.log("Selected Seat Type:", selectedSeatType)}>
            <option value="">ชั้นโดยสาร--ประเภทที่นั่ง</option>
            {#each tripsQ as trip}
                <option value={trip.seat_type}>{trip.seat_type} (ว่าง: {trip.available_seats})</option>
            {/each}
        </select>
        <select class="bg-gray-300 border p-2 rounded" bind:value={amount}>
            <option value="">--จำนวนที่นั่ง--</option>
            <option value="1"> 1 </option>
            <option value="2"> 2 </option>
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
        </select>
    </div>
    {/if}
</div>
