<script>
  export let data
  console.log(data.ticket)
</script>
  
  <!-- Navbar -->
<nav class="bg-[#EADBC8] shadow-xl border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-24">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="text-2xl font-bold text-[#102C57]">OURTRAINS</a>
          </div>
        </div>
  </nav>
  <div class="flex p-24 justify-center min-h-screen bg-white">
    <div class="">
      <h1 class="text-2xl font-bold text-center mb-6 text-[#102C57] underline">เข้าสู่ระบบพนักงาน</h1>
      <form >
        <div class="mb-4">
          
          <label class="block text-gray-700">ชื่อผู้ใช้งาน</label>
          <input type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700">รหัสผ่าน</label>
          <input type="password" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>
        <button type="submit" class="w-full bg-[#102C57] text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  </div>
  