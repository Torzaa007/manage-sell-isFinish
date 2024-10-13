<script>
    let isMenuOpen = false;
  
    // Toggle the menu open/close
    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
    };
  </script>
  
  <header class="bg-[#102C57]">
    <nav class="flex justify-between items-center h-24 w-[92%] mx-auto font-body">
      <div>
        <a class="text-white font-bold text-xl">OURTRIN</a>
      </div>
  
      <div class="flex">
        <div class={`md:static absolute bg-[#102C57] md:min-h-fit min-h-[30vh] left-0 ${isMenuOpen ? 'top-[9%]' : 'top-[-100%]'} md:w-auto w-full flex items-center px-5`}>
          <ul class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
            <li>
              <a class="text-white hover:text-gray-500" href="main">ค้นหาเที่ยวโดยสาร</a>
            </li>
            <li>
              <a class="text-white hover:text-gray-500" href="main">รายการตั๋วโดยสาร</a>
            </li>
            <li>
              <a class="text-white hover:text-gray-500" href="main">ลงทะเบียน</a>
            </li>
          </ul>
        </div>
  
        <img
          on:click={toggleMenu}
          name={isMenuOpen ? 'close' : 'menu'}
          class="text-3xl text-white cursor-pointer md:hidden size-16"
          src="https://static.thenounproject.com/png/4238597-200.png"
        >
      </div>
    </nav>
  </header>