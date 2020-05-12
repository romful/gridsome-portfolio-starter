<script>
export default {
	props: ['categories']
},
methods: {
	created() {
		this.categories = [];
		this.$static.allGoogleSheet.edges.forEach((edge) => {
			if(!this.categories.includes(edge.node.Category)){
				this.categories.push(edge.node.Category);
			}
		});
	}
}
</script>

<static-query>
query {
	allGoogleSheet {
		edges {
			node {
				Category
				Featured
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
</static-query>
