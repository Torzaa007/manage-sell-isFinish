<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import {onMount } from 'svelte';
    let passenger = {};

    // Fetch the stored data from sessionStorage
    onMount(() => {
        const storedPassenger = sessionStorage.getItem('passengerDetails');
        const storedTrip = sessionStorage.getItem('selectedTrip');

        // Check if data exists
        if (storedPassenger && storedTrip) {
            passenger = {
                ...JSON.parse(storedPassenger),
                ...JSON.parse(storedTrip),
            };
        } else {
            console.error('No passenger or trip data found in sessionStorage.');
        }
    });

    let enteredAmount = ""; // For payment confirmation

    // Confirm payment
    function confirmPayment() {
        if (enteredAmount) {
            alert(`Payment of ${enteredAmount} confirmed for trip ${passenger.tripId}`);
            // You can implement further payment processing logic here.
            goto('/sell/info/ticket');
        } else {
            alert('Please enter a valid payment amount.');
        }
    }
</script>

<nav class="bg-[#EADBC8] shadow-xl border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-24">
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="text-2xl font-bold text-[#102C57]">OURTRAINS</a>
                </div>
            </div>
        </div>
    </div>
</nav>

<div class="p-8 bg-white min-h-screen">
    <!-- Display passenger and trip details -->
    <div class="grid sm:grid-cols-3 gap-4 ">
        <div>
            <p><strong>ชื่อ - สกุล:</strong> {passenger.firstName} {passenger.lastName}</p>
        </div>
        <div>
            <p><strong>เบอร์โทรศัพท์:</strong> {passenger.phoneNumber}</p>
        </div>
    </div>
    <div class="grid sm:grid-cols-3 gap-4 my-4">
        <p><strong>เที่ยวโดยสาร:</strong> {passenger.tripId}</p>
        <p><strong>จาก:</strong> {passenger.start} - {passenger.end}</p>
        <p><strong>วันที่/เวลา เดินทาง:</strong> {passenger.from_datetime}</p>
        <p><strong>ชั้นโดยสาร:</strong> {passenger.seatType}</p>
        <p><strong>จำนวน:</strong> {passenger.amount}</p>
        <p><strong>ราคารวม:</strong> {passenger.totalPrice}</p>
    </div>

    <hr class="my-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="mb-6">
            <label for="paymentMethod" class="block text-lg font-bold mb-2">เลือกวิธีการชำระเงิน:</label>
            <select id="paymentMethod" class="border p-2 rounded w-full bg-gray-100">
                <option>วิธีการชำระเงิน</option>
                <option>พร้อมเพย์</option>
                <option>เงินสด</option>
                <option>บัตรเครดิต</option>
            </select>
            <label for="enteredAmount" class="block text-lg font-bold mb-2 my-6">จำนวนเงินที่ชำระ:</label>
            <input id="enteredAmount" type="text" class="border p-2 rounded w-full bg-gray-100" placeholder="0000" bind:value={enteredAmount} />
            
            <button on:click={confirmPayment} class="bg-[#102C57] text-white px-4 py-2 rounded w-full my-6">
                ยืนยันการชำระเงิน
            </button>
        </div>

        <div class="mb-6 text-5xl">
            ตรวจสอบข้อมูลของมึง
        </div>
    </div>
</div>
