<script>
  import { page } from '$app/stores';

  // ตรวจสอบว่า $page และ $page.url พร้อมใช้งาน

  const seats = $page.url.searchParams.get('seats');
  const startStation = $page.url.searchParams.get('start_station');
  const endStation = $page.url.searchParams.get('end_station');
  let from_datetime = $page.url.searchParams.get('from_datetime') || '';
  let trip_id = $page.url.searchParams.get('trip_id') || '';
  let price = $page.url.searchParams.get('price') || 0;
  let trip_class = $page.url.searchParams.get('trip_class') || '';
  let trip_name = $page.url.searchParams.get('trip_name') || '';
  // Mock data แต่เราจะใช้ข้อมูลจาก queryParams ที่ดึงมา
  let ticketData = {
    train: `${trip_id}`,
    tripNumber: `เที่ยวโดยสารที่ ${trip_name} ที่นั่ง`,
    travelDate: `วันที่เดินทาง: ${from_datetime}`, // สามารถเพิ่มการดึงวันที่จริงได้
    startStation: `สถานีต้นทาง: ${startStation}`,
    endStation: `สถานีปลายทาง: ${endStation}`,
    class: `ชั้นโดยสาร ${trip_class}`,
    price: `ราคา: ${price} บาท`, // สมมุติว่าราคาเป็น 300 บาท
  };

  
  function goback()  {
    const query = new URLSearchParams({
      seats: seats.toString(),
      start_station: startStation.toString(),
      end_station: endStation.toString(),
      from_datetime: from_datetime.toString(),
      trip_id: trip_id.toString(),
      price: price.toString(),
      trip_class: trip_class.toString()
    }).toString();

    return `/check/check2?${query}`;
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

<div class="min-h-screen bg-white ">
    <div class="min-h-screen flex flex-col items-center pt-8">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-[#102C57] mb-6">ใบยืนยันการจองตั๋วโดยสาร</h1>
        
        <!-- Content Box -->
        <div class="container mx-auto mt-4 p-6 border rounded-md bg-[#EADBC8] w-96 h-96">
            <h2 class="text-lg font-bold text-[#102C57] mb-4">{ticketData.train}</h2>
            <ul class="text-[#102C57] ml-8">
              <p><strong>{ticketData.tripNumber}</strong></p>
              <p><strong>{ticketData.travelDate}</strong></p>
              <p><strong>{ticketData.startStation}</strong></p>
              <p><strong>{ticketData.endStation}</strong></p>
              <p><strong>{ticketData.class}</strong></p>
              <p><strong>{ticketData.price}</strong></p>
            </ul>
        </div>
        
        <!-- Button -->
        <div class='pt-8'>
            <a href="/check"
               class="bg-[#102C57] text-white px-6 py-2 rounded-md mt-6">
              ออกตั๋ว
            </a>
        </div>
        
    </div>
</div>
