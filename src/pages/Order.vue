<template>
  <Layout>

<div class="container mx-auto">
	<div class="flex mb-4">
		<div class="w-1/3 px-2">
<div class="max-w-sm rounded overflow-hidden shadow-md mx-auto">
  <img class="w-full" src="../../static/avatar.jpg" alt="Avatar" />
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">Transfer from / to the airport</div>
    <p class="text-gray-700 text-base">
      Book up to : 1 hour before<br />
      Up to 7 people
    </p>
    <div class="flex">
      <div class="w-1/2 text-700">Price : 175 &euro;</div>
      <div class="w-1/2 text-green-700 text-right">Available</div>
    </div>
  </div>
</div>
		</div>
		<div class="w-1/3 px-2">
<div class="max-w-sm rounded overflow-hidden shadow-md mx-auto">
  <img class="w-full" src="../../static/avatar.jpg" alt="Avatar" />
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">Transfer from / to the airport</div>
    <p class="text-gray-700 text-base">
      Book up to : 1 hour before<br />
      Up to 7 people
    </p>
    <div class="flex">
      <div class="w-1/2 text-700">Price : 175 &euro;</div>
      <div class="w-1/2 text-green-700 text-right">Available</div>
    </div>
  </div>
</div>
		</div>
		<div class="w-1/3 px-2">
<div class="max-w-sm rounded overflow-hidden shadow-md mx-auto">
  <img class="w-full" src="../../static/avatar.jpg" alt="Avatar" />
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">Transfer from / to the airport</div>
    <p class="text-gray-700 text-base">
      Book up to : 1 hour before<br />
      Up to 7 people
    </p>
    <div class="flex">
      <div class="w-1/2 text-700">Price : 175 &euro;</div>
      <div class="w-1/2 text-green-700 text-right">Available</div>
    </div>
  </div>
</div>
		</div>
	</div>
</div>

<div class="w-full max-w-xs mx-auto">
  <h1 class="font-bold text-xl mb-2 text-center">Fill in the form below</h1>
  <h2 class="font-bold text-lg mb-2 text-center">Transfer from / to the airport</h2>
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="date">
        Date
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="text" placeholder="Input Date" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="time">
        Time
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time" type="text" placeholder="Input Time" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="number">
        How many people
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="number" type="text" placeholder="Input Number" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="message">
        Message
      </label>
      <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Input Message"></textarea>
    </div>
    <div class="text-center">
      <button class="border-1 border-green-700 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Order
      </button>
    </div>
  </form>
</div>


  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'Order'
  }
}
</script>

