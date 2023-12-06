import React, {useState} from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	gql,
	useQuery,
	useMutation,
} from '@apollo/client';
import {formatTimeFromTimestamp} from "./utils";

const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache: new InMemoryCache(),
});

const GET_MESSAGES = gql(`
query {
	messages {
		id
		content
		user
		date
	} 
}`)

const POST_MESSAGE = gql`
mutation ($user:String!,$content:String!){
  postMessage(user: $user, content: $content)
}`;

const Messages = ({ user }) => {
	const { data } = useQuery(GET_MESSAGES, {
		pollInterval: 500,
	})

	console.log(data)
	return (
		<main className="msger-chat">
			{data?.messages.map(({id, user: messageUser, content, date}) => (
				<div key={id} className={`msg ${ user === messageUser? "right-msg" : "left-msg"}`}>
					<div
						className="msg-img"
						style={{backgroundImage: "url(https://image.flaticon.com/icons/svg/327/327779.svg)}"}}
					>{messageUser.slice(0, 2).toUpperCase()}</div>

					<div className="msg-bubble">
						<div className="msg-info">
							<div className="msg-info-name">{messageUser}</div>
							<div className="msg-info-time">{formatTimeFromTimestamp(date)}</div>
						</div>

						<div className="msg-text">
							{content}
						</div>
					</div>
				</div>
			))}
		</main>
	)
}

const Form = ({user, setUser, content, setContent}) => {
	const [postMessage] = useMutation(POST_MESSAGE);
	const onSend = (e) => {
		e.preventDefault()

		if (content.length) {
			postMessage({
				variables: {user, content}
			})
		}
		setContent("")
	}
	return (
		<form className="msger-inputarea" onSubmit={onSend}>
			<input value={user} onChange={(e) => setUser(e.target.value)} type="text" className="msger-input-name"
				   placeholder="Enter Name..."/>
			<input value={content} onChange={(e) => setContent(e.target.value)} type="text" className="msger-input"
				   placeholder="Enter your message..."/>
			<button type="submit" className="msger-send-btn">Send</button>
		</form>
	)
}

const Header = () => (
	<header className="msger-header">
		<div className="msger-header-title">
			<i className="fas fa-comment-alt"></i> GraphQL Socket Chat
		</div>
		<div className="msger-header-options">
			<span><i className="fas fa-cog"></i></span>
		</div>
	</header>
)

const Chat = () => {
	const [user, setUser] = useState("");
	const [content, setContent] = useState([]);

	return (
		<section className="msger">
			<Header/>
			<Messages user={user}/>
			<Form user={user} setUser={setUser} content={content} setContent={setContent}/>
		</section>
	);
};

export default () => (
	<ApolloProvider client={client}>
		<Chat/>
	</ApolloProvider>
);
