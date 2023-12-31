const { createServer } = require('node:http');
const { createYoga, createSchema } = require('graphql-yoga');

const messages = []

const schema = createSchema({
	typeDefs: /* GraphQL */ `
	type Message {
		id: ID!
		user: String!
		content: String!
		date: String!
	}
	
	type Query {
		messages: [Message!]
	}
	
	type Mutation {
		postMessage(user: String!, content: String!): ID!
	}
`,
	resolvers: {
		Query: {
			messages: () => messages,
		},
		Mutation: {
			postMessage: (parent, {user, content}) => {
				const id = messages.length
				messages.push({
					id,
					user,
					content,
					date: Date.now(),
				})
				return id;
			}
		},
	}
})

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
	schema,
})

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Start the server and you're done!
server.listen(4000, () => {
	console.info('Server is running on http://localhost:4000/graphql')
})
