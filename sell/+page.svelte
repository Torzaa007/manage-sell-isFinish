<script>
    export let data;
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let tripsQ = []; // Initially empty, will be filled after querying
    let trips = data.trips;
    let selectedTrip = null; // Selected trip
    let selectedSeatType = ""; // Selected seat type
    let amount = "";
    let showSeats = false; // Control whether the seat selection is shown
    let storeSuccessMessage = ""; // To store confirmation messages
    console.log(trips)
    let stations = data.stations;  // For dropdown
    let totalPrice = 0;
    let coachId = ''; // Selected coach ID
    let price = 0; // Selected seat ID
    let firstName = '';
    let lastName = '';
    let citizenID = '';
    let phoneNumber = '';
    let fromStation = '';
    let toStation = '';
    let travelDate = '';

    async function handleTripSelection(trip) {
    selectedTrip = trip;
    showSeats = true; // Show seat selection after selecting a trip

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
        const response = await fetch("/sell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tripId: selectedTrip.trip_id }),
        });

        const result = await response.json();
        if (result.success) {
            tripsQ = result.tripsQ; // Store the queried seat information in tripsQ
            console.log("TripsQ after fetch:", tripsQ); // Log tripsQ to check if it is filled correctly
        } else {
            console.error("Failed to fetch trip details from the backend.");
        }
    } catch (error) {
        console.error("Error while fetching trip details:", error);
    }
}

// Function to check seat type and price
function checkSeatTypePrice() {
    if (selectedSeatType) {
        const selectedSeat = tripsQ.find(seat => seat.seat_type === selectedSeatType);
        if (selectedSeat) {
            console.log("Selected Seat Type:", selectedSeatType);
            console.log("Selected Seat Price:", selectedSeat.price); // Log the price for the selected seat type
            price = selectedSeat.price
        } else {
            console.log("No price found for the selected seat type.");
        }
    }
}



    // Confirm selection and store the passenger details in sessionStorage
    function confirmSelection() {
        if (selectedTrip && selectedSeatType && firstName && lastName && citizenID && phoneNumber) {
            totalPrice = (price || 0) * parseInt(amount);
            console.log("Total Price:", selectedTrip.price, amount,totalPrice); // Log total price
            // Store selected passenger and seat details in sessionStorage
            sessionStorage.setItem('passengerDetails', JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                citizenID: citizenID,
                phoneNumber: phoneNumber,
                seatType: selectedSeatType,
                amount: amount,
                totalPrice: totalPrice,
                fromStation: fromStation,
                toStation: toStation,
                travelDate: travelDate,
            }));
            console.log(totalPrice)
            // Redirect to /sell/info
            goto('/sell/info');
        } else {
            alert("Please fill in all required fields.");
        }
    }

</script>

<!-- Rest of your HTML content -->

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
        <select class="bg-gray-300 border p-2 rounded" bind:value={selectedSeatType} on:change={checkSeatTypePrice}>
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

    <!-- ฟอร์มข้อมูลผู้โดยสาร -->
    {#if selectedTrip && selectedSeatType}
    <hr class="mb-6">
    <h2 class="text-xl font-bold mb-4">ข้อมูลผู้โดยสาร</h2>
    <div class="grid grid-cols-4 gap-4 mb-4">
        <input type="text" class="border p-2 rounded" placeholder="ชื่อ" bind:value={firstName} required>
        <input type="text" class="border p-2 rounded" placeholder="นามสกุล" bind:value={lastName}>
        <input type="text" class="border p-2 rounded" placeholder="รหัสประจำตัวประชาชน" bind:value={citizenID}>
        <input type="text" class="border p-2 rounded" placeholder="เบอร์โทรศัพท์" bind:value={phoneNumber}>
    </div>
    <div class="mt-4 flex items-center justify-center bg-white">
        <button on:click={confirmSelection} class="bg-[#102C57] text-white px-4 py-2 rounded-md">
            ยืนยัน
        </button>
    </div>
    {/if}
</div>
