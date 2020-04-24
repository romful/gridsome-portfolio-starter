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
								<div class="w-1/2 font-bold">
									<span v-if="edge.node.Price_vat_excluded">
										Price : {{ edge.node.Price_vat_excluded }} &euro;
										<span v-if="edge.node.Price_per_hour">per hour</span>
										<span v-else-if="edge.node.Price_per_people">per person</span>
									</span>
								</div>
								<div class="w-1/2 font-bold text-right">
									<a href="#order" @click="initOrder(edge.node)" v-if="edge.node.Price_vat_excluded" class="text-green-700">Available</a>
									<span v-else class="text-red-700">Unavailable</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="orderData.title" id="order">
				<h1 class="font-bold text-xl mb-2 text-center">Fill in the form below :</h1>
				<h2 class="text-md mb-2 text-center bg-blue-700 text-white rounded-xl py-2 max-w-xs mx-auto">{{ orderData.title }}</h2>
				<form class="mb-8"
					name="order"
					method="post"
					v-on:submit.prevent="handleSubmit"
					action="/order/">
					<div class="bg-white rounded-xl px-8 pt-6 pb-8 mb-4 w-full max-w-xs mx-auto">
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="date">
								Date
							</label>
							<input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="text" placeholder="Input Date" v-model="orderData.date" />
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="time">
								Time
							</label>
							<input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time" type="text" placeholder="Input Time" v-model="orderData.time" />
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="number">
								How many people
							</label>
							<span class="text-center inline-block cursor-pointer w-12 border rounded-l py-2 leading-tight" @click="decrementNumber">-</span>
							<input class="text-center appearance-none w-16 border-t border-b py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="number" type="text" placeholder="Input Number" v-model="orderData.number" />
							<span class="text-center inline-block cursor-pointer w-12 border rounded-r py-2 leading-tight" @click="incrementNumber">+</span>
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="message">
								Message
							</label>
							<textarea class="appearance-none border rounded w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Input Message" v-model="orderData.message"></textarea>
						</div>
					</div>
					<div class="text-center mb-4">
						By clicking in the Order button below, you accept the <span class="font-bold">terms and conditions</span> related to this request.<br />
						You will receive an email to make the payment and finalise your booking.
					</div>
					<div class="text-center mb-4">
						Total price: <span class="font-bold"><span id="total">175</span> &euro;</span>
					</div>
					<div class="text-center">
						<button class="border-1 text-white border-green-700 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
							Order
						</button>
					</div>
				</form>
			</div>
		</div>
	</Layout>
</template>

<script>
export default{
	metaInfo: {
		title: 'Order'
	},
	data(){
		return{
			orderData: {
				title: "",
				date: "",
				time: "",
				number: 1,
				message: ""
			}
		}
	},
	methods: {
		initOrder(data){
			this.orderData.title = data.Title
		},
		incrementNumber(){
			this.orderData.number++
		},
		decrementNumber(){
			if(this.orderData.number > 1){
				this.orderData.number--
			}
		},
		encode(data) {
			return Object.keys(data)
				.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
				.join('&')
		},
		handleSubmit(e) {
			fetch(e.target.getAttribute('action'), {
				method: e.target.getAttribute('method'),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: this.encode({
					'form-name': e.target.getAttribute('name'),
					...this.orderData,
				}),
			})
			.then(() => this.$router.push(e.target.getAttribute('action')))
			.catch(error => alert(error))
		}
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
