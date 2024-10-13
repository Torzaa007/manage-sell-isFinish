<script>
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  export let data;

  let videoElement;
  let isCameraOpen = false;

  let stationsQ = data.stationsQ;
  let currentTab = 'ตรวจตั๋วโดยสาร'; // ตั้งค่า tab เริ่มต้น

  let from_datetime = $page.url.searchParams.get('from_datetime') || '';
  let trip_id = $page.url.searchParams.get('trip_id') || '';
  let start_id = $page.url.searchParams.get('start_id') || '';
  let end_id = $page.url.searchParams.get('end_id') || '';
  let start = $page.url.searchParams.get('start') || '';
  let end = $page.url.searchParams.get('end') || '';
  let price = $page.url.searchParams.get('price') || 0;
  let selectedSeats = '1';
  let selectedStartStation = start_id;
  let selectedEndStation = end_id;
  let trip_class = $page.url.searchParams.get('class') || '';
  let trip_name = $page.url.searchParams.get('trip_name') || '';

  $: totalPrice = price * parseInt(selectedSeats);

  function changeTab(tabName) {
    currentTab = tabName;
  }

  function confirmTicket() {
    try {
      const query = new URLSearchParams({
        trip_name: trip_name, 
        trip_class: trip_class,
        seats: selectedSeats.toString(),
        start_station: selectedStartStation,
        price: totalPrice.toString(),
        end_station: selectedEndStation,
        from_datetime: from_datetime,
        trip_id: trip_id,
        start: start,
        end: end,
        class: trip_class
      }).toString();

      window.location.href = `/check/check2/confirm_ticket?${query}`;
    } catch (error) {
      console.error("Error occurred while confirming the ticket:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้ง");
    }
  }

  // ฟังก์ชันเปิดกล้อง
  async function openCamera() {
    try {
      // ขอสิทธิ์เข้าถึงกล้อง
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // นำ stream ที่ได้จากกล้องแสดงใน video element
      videoElement.srcObject = stream;
      isCameraOpen = true; // อัพเดทสถานะว่ากล้องเปิดแล้ว
    } catch (error) {
      console.error("ไม่สามารถเข้าถึงกล้องได้:", error);
      alert("ไม่สามารถเข้าถึงกล้องได้ กรุณาลองใหม่อีกครั้งหรืออนุญาตการเข้าถึงกล้อง");
    }
  }

  // ฟังก์ชันปิดกล้อง
  function closeCamera() {
    let stream = videoElement.srcObject;
    if (stream) {
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    videoElement.srcObject = null;
    isCameraOpen = false;
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

<div class="min-h-screen bg-white py-12">
  <div class="text-center">
    <h1 class="text-2xl font-bold text-[#102C57]">เที่ยวโดยสาร {trip_id} / {start} - {end}</h1>
  </div>

  <div class="flex justify-center mt-4">
    <!-- ปุ่มสลับ tab -->
    <button 
      on:click={() => changeTab('ตรวจตั๋วโดยสาร')} 
      class="px-6 py-2 text-lg font-bold text-[#102C57]"
      class:bg-gray-300={currentTab === 'ตรวจตั๋วโดยสาร'}>
      ตรวจตั๋วโดยสาร
    </button>
    <span class="px-2 text-4xl">|</span>
    <button 
      on:click={() => changeTab('ออกตั๋วโดยสาร')} 
      class="px-6 py-2 text-lg font-bold text-[#102C57]"
      class:bg-gray-300={currentTab === 'ออกตั๋วโดยสาร'}>
      ออกตั๋วโดยสาร
    </button>
  </div>

  <div class="container mx-auto mt-4 p-6 border border-gray-400 rounded-md bg-gray-300 max-w-md">
    {#if currentTab === 'ตรวจตั๋วโดยสาร'}
      <div in:fade={{ duration: 400 }}>
        <p class="text-lg font-bold text-[#102C57]">โปรดสแกน QR code หรือนำกล้องส่องไปที่ตั๋ว</p>
        
        {#if isCameraOpen}
          <!-- วิดีโอที่จะแสดงผลการถ่ายจากกล้อง -->
          <video bind:this={videoElement} autoplay playsinline class="w-full h-auto mt-4 border-2 border-gray-300"></video>
          <button on:click={closeCamera} class="bg-red-600 text-white px-6 py-2 rounded-md mt-4">ปิดกล้อง</button>
        {/if}
      
        {#if !isCameraOpen}
          <button on:click={openCamera} class="bg-[#102C57] text-white px-6 py-2 rounded-md mt-4">เปิดกล้อง</button>
        {/if}
      </div>
    {/if}

    {#if currentTab === 'ออกตั๋วโดยสาร'}
      <div in:fade={{ duration: 400 }}>
        <h3 class="text-lg font-bold text-[#102C57]">เที่ยวโดยสาร</h3>
        <div>
          <p class="mt-4 text-gray-700">จำนวนที่นั่ง</p>
          <select bind:value={selectedSeats} class="border rounded text-sm">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div>
          <p class="text-gray-700">สถานีต้นทาง</p>
          <select bind:value={selectedStartStation} class="border rounded text-sm">
            <option value="" disabled selected hidden>โปรดเลือกสถานีต้นทาง</option>
            {#each stationsQ as station}
              <option value={station.station_name}>{station.station_name}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <p class="text-gray-700">สถานีปลายทาง</p>
          <select bind:value={selectedEndStation} class="border rounded text-sm">
            <option value="" disabled selected hidden>โปรดเลือกสถานีปลายทาง</option>
            {#each stationsQ as station}
              <option value={station.station_name}>{station.station_name}</option>
            {/each}
          </select>
        </div>
        
      </div>

      <div class="mt-8">
        <button on:click={confirmTicket} class="bg-[#102C57] text-white px-6 py-2 rounded-md">ยืนยัน</button>
      </div>
    {/if}
  </div>
</div>

<style>
  button {
    transition: background-color 0.3s ease-in-out;
  }
</style>
