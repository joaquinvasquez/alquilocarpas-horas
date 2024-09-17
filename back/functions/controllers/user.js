export const UserController = {
	getAllUsers: async (req, res) => {
		try {
			const users = []
			const querySnapshot = await db.collection("users").get()
			for (const doc of querySnapshot.docs) {
				doc.data().enabled &&
					users.push({
						id: doc.id,
						...doc.data(),
						initial_date: doc.data().initial_date.toDate(),
						last_reading: doc.data().last_reading.toDate()
					})
			}
			return res.status(200).send(users)
		} catch (err) {
			console.log(err)
			return res.status(500).send("error")
		}
	},

	createUser: async (req, res) => {
		try {
			await db
				.collection("users")
				.doc()
				.create({
					name: req.body.name,
					key: req.body.key,
					initial_date: new Date(Date.now()),
					is_active: false,
					minutes: 0,
					weekly_hours: req.body.weekly_hours,
					last_reading: new Date(Date.now()),
					enabled: true
				})
			return res.status(200).send("created")
		} catch (err) {
			console.log(err)
			return res.status(500).send("error")
		}
	},

	getUserById: async (req, res) => {
		try {
			const user = await db.collection("users").doc(req.params.id).get()
			return res.status(200).send({
				id: user.id,
				...user.data(),
				initial_date: user.data().initial_date.toDate(),
				last_reading: user.data().last_reading.toDate()
			})
		} catch (err) {
			console.log(err)
			return res.status(500).send("error")
		}
	},

	updateUserById: async (req, res) => {
		try {
			await db.collection("users").doc(req.params.id).update({
				name: req.body.name,
				key: req.body.key,
				weekly_hours: req.body.weekly_hours
			})
			return res.status(200).send("updated")
		} catch (err) {
			console.log(err)
			return res.status(500).send("error")
		}
	},

	deleteUserById: async (req, res) => {
		try {
			await db.collection("users").doc(req.params.id).update({
				enabled: false
			})
			return res.status(200).send("deleted")
		} catch (err) {
			console.log(err)
			return res.status(500).send("error")
		}
	}
}
