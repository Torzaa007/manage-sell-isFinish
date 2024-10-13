<script>
  import { onMount } from 'svelte';

  let passenger = {};
  let ticketData = {}; // Store ticket data for displaying QR code later

  onMount(() => {
    const storedPassenger = sessionStorage.getItem('passengerDetails');
    const storedTrip = sessionStorage.getItem('selectedTrip');

    // Check if data exists and assign it to the passenger object
    if (storedPassenger && storedTrip) {
      passenger = {
        ...JSON.parse(storedPassenger),
        ...JSON.parse(storedTrip),
      };
      // Log after setting the passenger details
      console.log('Passenger Details after sessionStorage load:', passenger);
    } else {
      console.error('No passenger or trip data found in sessionStorage.');
    }
  });

  async function issueTicket() {
    const url = new URL('/sell/info/ticket', window.location.origin);
    url.searchParams.append('tripNumber', passenger.tripId);
    url.searchParams.append('from_id', passenger.fromStation);  // Use fromStation stored in session
    url.searchParams.append('to_id', passenger.toStation);      // Use toStation stored in session
    
    // Log URL for debugging
    console.log('Request URL:', url.toString());

    const response = await fetch(url, {
      method: 'GET',  // Using GET method
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Response Data from issuing ticket:', result);  // Log response data

      if (result.success) {
        // Assuming the ticketData.qrCode will come from the response
        ticketData.qrCode = result.qrCode; 
        console.log('QR Code Data:', ticketData.qrCode);  // Log the QR code data
        alert('Ticket issued successfully!');
      } else {
        alert('Failed to issue ticket');
      }
    } else {
      alert('Error issuing ticket');
    }
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

<div class="bg-white min-h-screen">
  <div class="mx-auto py-24 rounded-md sm:px-8">
    <div class="bg-[#DAC0A3] p-2 text-white">
      <h2 class="text-lg font-bold text-[#102C57]">OURTRAIN TICKETS</h2>
    </div>
    <div class="bg-[#F8F0E5] p-4">
      <!-- Passenger and Trip Details -->
      <div class="grid grid-cols-2">
        <p><strong>ชื่อ-นามสกุล:</strong> {passenger.firstName} {passenger.lastName}</p>
        <p><strong>เบอร์โทรศัพท์:</strong> {passenger.phoneNumber}</p>
      </div>

      <div class="grid grid-cols-2">
        <p><strong>เที่ยวโดยสาร:</strong> {passenger.tripId}</p>
        <p><strong>วันที่/เวลาเดินทาง:</strong> {passenger.from_datetime}</p>
      </div>
      
      <hr class="border-t-1 border-black my-4"> 
      
      <!-- From/To and Seat Details -->
      <div class="grid grid-cols-2">
        <p><strong>สถานีต้นทาง:</strong> {passenger.fromStation}</p>
        <p><strong>ที่นั่ง:</strong> {passenger.selectedSeatId}</p>
      </div>
      <div class="grid grid-cols-2">
        <p></p> <!-- Empty space to align "ขบวนที่" with "ที่นั่ง" -->
        <p><strong>ขบวนที่:</strong> {passenger.coachId}</p>
      </div>
      <div class="grid grid-cols-2">
        <p><strong>สถานีปลายทาง:</strong> {passenger.toStation}</p>
        <p><strong>ชั้นโดยสาร:</strong> {passenger.seatType}</p>
      </div>
      
      <hr class="border-t-1 border-black my-4"> 

      <!-- QR Code section -->
      <div>
        {#if ticketData.qrCode}
          <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${ticketData.qrCode}&size=100x100`} alt="QR Code">
          <p>{ticketData.qrCode}</p>
        {/if}
      </div>
    </div>

    <!-- Button -->
    <div class="text-center py-8">
      <button on:click={issueTicket} class="bg-blue-800 text-white px-6 py-2 rounded-md">
        ออกตั๋ว
      </button>
    </div>
  </div>
</div>
