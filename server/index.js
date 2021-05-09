const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const uuid = require("uuid");

const PORT = 80;

let turtles = [];
let runningEvals = [];

const app = express();
const server = http.createServer(app);

/*
 *
 * WebSocket (WS) server
 *
 */

const wss = new WebSocket.Server({
	server: server,
	path: "/socket",
	clientTracking: true
});

function noop() {}

function webSocketHeartbeat() {
	this.isAlive = true;
}

wss.on("connection", function connection(ws, req) {
	ws.isAlive = true;
	ws.on("pong", webSocketHeartbeat);

	const ID = req.headers["id"];
	ws.id = ID;
	const name = req.headers["name"];

	if (turtles.length > 0 && turtles.find((t) => t && t.id === ID)) {
		turtles[turtles.findIndex((t) => t && t.id === ID)] = {
			name: name,
			id: ID,
			ws: ws
		};
	} else {
		turtles.push({ id: ID, name: name, ws: ws });
	}

	console.log(`Turtle '${name}' connected.`);

	ws.on("message", (msg) => {
		if (msg.type == "eval") {
			const i = runningEvals.findIndex((e) => e && e.nonce == msg.nonce);
			console.log(runningEvals[i]);
			runningEvals[i].cb(msg.result);
			delete runningEvals[i];
		}
	});
	ws.on("close", (code, reason) => {
		//console.log(turtles);
		const i = turtles.findIndex((t) => t && t.id === ID);
		delete turtles[i];
		console.log(`Turtle '${name}' disconnected. Reason: ${reason}`);
	});
});

const interval = setInterval(function ping() {
	wss.clients.forEach(function each(ws) {
		if (ws.isAlive === false) return ws.terminate();

		ws.isAlive = false;
		ws.ping(noop);
	});
}, 30000);

wss.on("close", function close() {
	clearInterval(interval);
});

/*
 *
 * Express (HTTP) server
 *
 */

app.use(express.static("public"));
app.use(express.json({ type: "application/json" }));

app.get("/api/turtles", (req, res) => {
	res.send(
		turtles
			.filter((t) => !!t)
			.map((t) => {
				// console.log(`Turtle '${t.name} is #${t.id}'`);
				return { name: t.name, id: t.id };
			})
	);
});

app.post("/api/eval", (req, res) => {
	try {
		const data = req.body;

		const { turtleID, code } = data;

		console.log(`Running '${code.slice(0, 50)}' on turtle #${turtleID}`);

		//console.log(turtles.map((t) => ({ id: t.id, name: t.name })));
		//console.log(runningEvals);
		const turtle = turtles.find((t) => {
			// console.log(t);
			return t && t.id == turtleID;
		});
		const nonce = uuid.v4();
		const evalTimeout = setTimeout(() => {
			res.status(500).send("Turtle Error: timed out");
		}, 10000);
		runningEvals.push({
			nonce: nonce,
			cb: (result) => {
				clearTimeout(evalTimeout);
				res.send({ result: result });
			}
		});

		turtle.ws.send(
			JSON.stringify({ type: "eval", code: code, nonce: nonce })
		);
	} catch (err) {
		res.status(500).send(
			`lmao get shidded on loser\n\n\n\n\n\n\n\n\n\n${err}`
		);
		throw err;
	}
});

server.listen(PORT, () => console.log(`🚀 App listening on port ${PORT}!`));
