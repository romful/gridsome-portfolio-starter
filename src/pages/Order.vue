<template>
	<Layout>
		<div class="container max-w-none bg-green-100 overflow-hidden">
			<h1 class="text-center">booking available up to 1 hour before the requested service</h1>
			<div class="flex flex-wrap mb-4 max-w-5xl mx-auto">
				<div class="md:w-1/2 lg:w-1/3 w-full px-2" v-for="edge in $page.allGoogleSheet.edges">
					<div class="mx-auto max-w-sm overflow-hiddenmx-auto">
						<img v-if="edge.node.Img" class="w-full rounded-xl" :src="edge.node.Img" />
						<img v-else class="w-full rounded-xl" src="../../static/avatar.jpg" />
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
									<a href="#order"  v-scroll-to="'#order'" @click="init(edge.node)" v-if="edge.node.Availability" class="text-green-700">Available</a>
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
					<input type="hidden" name="title" v-model="orderData.title" />
					<input type="hidden" name="cost" v-model="orderData.cost" />
					<div class="bg-white rounded-xl px-8 pt-6 pb-8 mb-4 w-full max-w-xs mx-auto">
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="date">
								Date
							</label>
							<input type="hidden" name="dete" x-ref="date" />
							<input readonly
								class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="date"
								type="text"
								placeholder="Input Date"
								v-model="orderData.date"
								@click="showDatepicker = !showDatepicker"
								@keydown.escape="showDatepicker = false" />
							<div class="absolute top-0 right-0 px-3 py-2">
								<svg class="h-6 w-6 text-gray-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
								</svg>
							</div>
							<!-- <div x-text="no_of_days.length"></div>
							<div x-text="32 - new Date(year, month, 32).getDate()"></div>
							<div x-text="new Date(year, month).getDay()"></div> -->
							<div 
								class="bg-white mt-12 rounded-lg shadow p-4 absolute top-0 left-0" 
								style="width: 17rem" 
								x-show.transition="showDatepicker"
								@click.away="showDatepicker = false">
								<div class="flex justify-between items-center mb-2">
									<div>
										<span x-text="MONTH_NAMES[month]" class="text-lg font-bold text-gray-800"></span>
										<span x-text="year" class="ml-1 text-lg text-gray-600 font-normal"></span>
									</div>
									<div>
										<button 
											type="button"
											class="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full" 
											:class="{'cursor-not-allowed opacity-25': month == 0 }"
											:disabled="month == 0 ? true : false"
											@click="month--; getNoOfDays()">
											<svg class="h-6 w-6 text-gray-500 inline-flex"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
											</svg>  
										</button>
										<button 
											type="button"
											class="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full" 
											:class="{'cursor-not-allowed opacity-25': month == 11 }"
											:disabled="month == 11 ? true : false"
											@click="month++; getNoOfDays()">
											<svg class="h-6 w-6 text-gray-500 inline-flex"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
											</svg>									  
										</button>
									</div>
								</div>
								<div class="flex flex-wrap mb-3 -mx-1">
									<template x-for="(day, index) in DAYS" :key="index">	
										<div style="width: 14.26%" class="px-1">
											<div
												x-text="day" 
												class="text-gray-800 font-medium text-center text-xs"
												></div>
										</div>
									</template>
								</div>
								<div class="flex flex-wrap -mx-1">
									<template x-for="blankday in blankdays">
										<div 
											style="width: 14.28%"
											class="text-center border p-1 border-transparent text-sm"	
											></div>
									</template>	
									<template x-for="(date, dateIndex) in no_of_days" :key="dateIndex">	
										<div style="width: 14.28%" class="px-1 mb-1">
											<div
												@click="getDateValue(date)"
												x-text="date"
												class="cursor-pointer text-center text-sm leading-none rounded-full leading-loose transition ease-in-out duration-100"
												:class="{'bg-blue-500 text-white': isToday(date) == true, 'text-gray-700 hover:bg-blue-200': isToday(date) == false }"	
												></div>
										</div>
									</template>
								</div>
							</div>
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="time">
								Time
							</label>
							<input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time" type="text" placeholder="Input Time" v-model="orderData.time" />
						</div>
						<div class="mb-4" v-if="orderData.Price_per_people">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="people">
								How many people
							</label>
							<span class="text-center inline-block cursor-pointer w-12 border rounded-l py-2 leading-tight" @click="decrementPeople">-</span>
							<input class="text-center appearance-none w-16 border-t border-b py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="people" type="text" placeholder="Input Number" v-model="orderData.people" />
							<span class="text-center inline-block cursor-pointer w-12 border rounded-r py-2 leading-tight" @click="incrementPeople">+</span>
						</div>
						<div class="mb-4" v-if="orderData.Price_per_hour">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="hours">
								How many hours
							</label>
							<span class="text-center inline-block cursor-pointer w-12 border rounded-l py-2 leading-tight" @click="decrementHours">-</span>
							<input class="text-center appearance-none w-16 border-t border-b py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hours" type="text" placeholder="Input Number" v-model="orderData.hours" />
							<span class="text-center inline-block cursor-pointer w-12 border rounded-r py-2 leading-tight" @click="incrementHours">+</span>
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
					<div class="text-center mb-4" v-if="orderData.Price_vat_excluded">
						Total price: <span class="font-bold">{{ orderData.cost }} &euro;</span>
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
				people: 1,
				hours: 1,
				Up_to_X_pax: 0,
				Booking_Up_to_X_hours: 0,
				message: "",
				Price_vat_excluded: 0,
				Price_per_people: 0,
				Price_per_hour: 0,
				cost: 0
			}
		}
	},
	methods: {
		init(data){
			this.orderData.title = data.Title
			this.orderData.people = 1
			this.orderData.Up_to_X_pax = data.Up_to_X_pax
			this.orderData.Price_vat_excluded = data.Price_vat_excluded
			this.orderData.Price_per_people = data.Price_per_people
			this.orderData.Price_per_hour = data.Price_per_hour
			this.calc()
		},
		calc(){
			this.orderData.cost = this.orderData.Price_vat_excluded
			if(this.orderData.Price_per_people){
				this.orderData.cost *= this.orderData.people
			}
			if(this.orderData.Price_per_hour){
				this.orderData.cost *= this.orderData.hours
			}
		},
		incrementPeople(){
			if(!this.orderData.Up_to_X_pax || this.orderData.people < this.orderData.Up_to_X_pax){
				this.orderData.people++
				this.calc()
			}
		},
		decrementPeople(){
			if(this.orderData.people > 1){
				this.orderData.people--
				this.calc()
			}
		},
		incrementHours(){
			this.orderData.hours++
			this.calc()
		},
		decrementHours(){
			if(this.orderData.hours > 1){
				this.orderData.hours--
				this.calc()
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
<script>
	const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function app() {
	return {
		showDatepicker: false,
		datepickerValue: '',
		month: '',
		year: '',
		no_of_days: [],
		blankdays: [],
		days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		initDate() {
			let today = new Date();
			this.month = today.getMonth();
			this.year = today.getFullYear();
			this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString();
		},
		isToday(date) {
			const today = new Date();
			const d = new Date(this.year, this.month, date);
			return today.toDateString() === d.toDateString() ? true : false;
		},
		getDateValue(date) {
			let selectedDate = new Date(this.year, this.month, date);
			this.datepickerValue = selectedDate.toDateString();
			this.$refs.date.value = selectedDate.getFullYear() +"-"+ ('0'+ selectedDate.getMonth()).slice(-2) +"-"+ ('0' + selectedDate.getDate()).slice(-2);
			console.log(this.$refs.date.value);
			this.showDatepicker = false;
		},
		getNoOfDays() {
			let daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
			// find where to start calendar day of week
			let dayOfWeek = new Date(this.year, this.month).getDay();
			let blankdaysArray = [];
			for ( var i=1; i <= dayOfWeek; i++) {
				blankdaysArray.push(i);
			}
			let daysArray = [];
			for ( var i=1; i <= daysInMonth; i++) {
				daysArray.push(i);
			}
			this.blankdays = blankdaysArray;
			this.no_of_days = daysArray;
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
				Img
				Price_vat_excluded
				Booking_Up_to_X_hours
				Up_to_X_pax
				Price_per_hour
				Price_per_people
				Included
				Availability
			}
		}
	}
}
</page-query>
