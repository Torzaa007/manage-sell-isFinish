<script>
    import { onMount } from 'svelte';
    
    let selectedTrip = {};
    let seatDetails = {};
    let tripsQ = [];

    // Retrieve data from sessionStorage
    onMount(() => {
        const storedTrip = sessionStorage.getItem('selectedTrip');
        const storedSeatDetails = sessionStorage.getItem('seatDetails');
        const storedTripsQ = sessionStorage.getItem('tripsQ');

        if (storedTrip) {
            selectedTrip = JSON.parse(storedTrip);
            console.log('Retrieved Trip:', selectedTrip);
        }

        if (storedSeatDetails) {
            seatDetails = JSON.parse(storedSeatDetails);
            console.log('Retrieved Seat Details:', seatDetails);
        }

        if (storedTripsQ) {
            tripsQ = JSON.parse(storedTripsQ);
            console.log('Retrieved tripsQ:', tripsQ);
        }
    });
</script>

<h1>ข้อมูลการเดินทางที่เลือก</h1>
<div>
    <p><strong>จาก:</strong> {selectedTrip.start}</p>
    <p><strong>ถึง:</strong> {selectedTrip.end}</p>
    <p><strong>เวลาเดินทาง:</strong> {selectedTrip.from_datetime}</p>
    <p><strong>ประเภทที่นั่ง:</strong> {seatDetails.seatType}</p>
    <p><strong>จำนวนที่นั่ง:</strong> {seatDetails.amount}</p>
</div>

<h2>รายละเอียดที่นั่ง (tripsQ)</h2>
{#if tripsQ.length > 0}
    <ul>
        {#each tripsQ as seat}
            <li>ประเภทที่นั่ง: {seat.seat_type}, ว่าง: {seat['count(seat_id)']}</li>
        {/each}
    </ul>
{:else}
    <p>ไม่มีข้อมูลที่นั่ง</p>
{/if}
