<template>
	<Layout>
		<div class="container max-w-none bg-green-100 overflow-hidden">
			<h1 class="text-center">booking available up to 1 hour before the requested service</h1>
			<div class="flex flex-wrap mb-4 max-w-5xl mx-auto">
				<div class="md:w-1/2 lg:w-1/3 w-full px-2" v-for="edge in $page.allGoogleSheet.edges">
					<div class="mx-auto max-w-sm overflow-hiddenmx-auto">
						<img class="w-full rounded-xl" src="../../static/avatar.jpg" />
						<div class="px-6 pb-4 pt-8 mx-6 -mt-4 mb-4 relative rounded-xl bg-white-700">
							<div class="font-bold text-xl mb-2">{{ edge.node.Title }}</div>
							<p class="text-gray-700 text-base">
								<span v-if="edge.node.Booking_Up_to_X_hours != ''">Book up to : {{ edge.node.Booking_Up_to_X_hours }} <span v-if="edge.node.Booking_Up_to_X_hours > 1">hours</span><span v-else>hour</span> before<br /></span>
								<span v-if="edge.node.Up_to_X_pax != ''">Up to {{ edge.node.Up_to_X_pax }} <span v-if="edge.node.Up_to_X_pax > 1">people</span><span v-else>person</span><br /></span>
							</p>
							<div class="flex">
								<div class="w-1/2 font-bold">Price : 175 &euro;</div>
								<div class="w-1/2 font-bold text-green-700 text-right">Available</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full max-w-xs mx-auto">
				<h1 class="font-bold text-xl mb-2 text-center">Fill in the form below :</h1>
				<h2 class="text-md mb-2 text-center bg-blue-700 rounded-xl">Transfer from / to the airport</h2>
				<form class="bg-white rounded-xl px-8 pt-6 pb-8 mb-4">
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="date">
							Date
						</label>
						<input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="text" placeholder="Input Date" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="time">
							Time
						</label>
						<input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time" type="text" placeholder="Input Time" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="number">
							How many people
						</label>
						<input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="number" type="text" placeholder="Input Number" />
					</div>
					<div class="mb-4">
						<label class="block text-gray-700 text-sm font-bold mb-2" for="message">
							Message
						</label>
						<textarea class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Input Message"></textarea>
					</div>
					<div class="text-center">
						<button class="border-1 border-green-700 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
							Order
						</button>
					</div>
				</form>
			</div>
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

<page-query>
query {
	allGoogleSheet {
		edges {
			node {
				Title
				Price_vat_excluded
				Booking_Up_to_X_hours
				Up_to_X_pax
				Price_to_define
				Price_per_hour
				Fixed_price
				Price_per_people
				Included
			}
		}
	}
}
</page-query>
