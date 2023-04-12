//Copyright Justin Klein 2023
//This file was created to read uniqueids(terminology courtesy of Miami University) 
//and input them into a text file to be submitted for attendance on The Hub. 
//Any other use of this bot is forbidden by the author.
const Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require("fs"); //used to append content to file
var file;
var testing = false; //whether the bot is in testing mode or not (able to add names outside of club)
var options, attendees = [];
const now = new Date();
const start = 18 * 60;
const end = 21 * 60;
var time = now.getHours() * 60 + now.getMinutes();
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
	colorize: true
});
logger.level = "debug";
const bot = new Discord.Client({token: auth.token,
   autorun: true});
bot.on("ready", () => {
	logger.info("connected with " + bot.username + ", which has an id of " + bot.id);
	if (now.getDay() === 2 && time >= start && time <= end) {
		bot.channels.cache.get("1092974337369329694").send("test");
	}
	if (now.getDay() === 2 && time === (12 * 60)) {
		bot.sendMessage({
			to: channelID,
			message: "Meeting today! Where it at? Laws 301 from 6-9pm! The voting has ended! " + options[0] + " won!"
		});
	}
	if (now.getDay() === 2 && time === (20 * 60)) {
		if (options.size != 0) {
			bot.sendMessage({
				to: channelID,
				message: "Vote for what we are going to do for next weeks meeting! the options are " + options.join(", ")
			});
		}
		
	}
});

bot.on("message", function (user1, userID, channelID, message, evt) {
	if (message.substring(0, 1) === "$") {
		var query = message.substring(1).split(" ");
		var command = query[0] + query[1];
		var uniqueid = query[1];
		query = query.splice(1);
		switch(command) {
			case "attend" + uniqueid: {
				if (uniqueid === undefined) {
					bot.sendMessage({
						to: channelID,
						message: "No uniqueid? D:"
					});
					break;
				}
				if (now.getDay() != 2 || time < start || time > end && !testing) {
					//if not in testing mode, check if the current time is between 6:00pm and 9:00pm on Tuesday (day 0 is Sun, 6 is Sat)
					bot.sendMessage({
						to: channelID,
						message: "Club isn't meeting now!"
					});
					break;
				} else {
					let con = uniqueid + "@miamioh.edu\n";
					const content = `${con}`;
					if (file === undefined) {
						bot.sendMessage({
							to: channelID,
							message: "Please set a file name first!"
						});
						break;
					}
					fs.appendFile(file, content, err => {
						if (err) {
							bot.sendMessage({
								to: channelID,
								message: "We are verwy sowwy, but our uniqueid uploading monkeys have screwed up. Tell the admin to find out what is wrong with them."
							});
							console.log(err)
							return;
						}
					})
					attendees.push(uniqueid);
					bot.sendMessage({
						to: channelID,
						message: "Current attendees: " + attendees.join(", ")
					});
					break;
				}
			} case "help" + uniqueid : {
				bot.sendMessage({
					to: channelID,
					message: "commands:\n$attend uniqueid: " +
					"saves the uniqueid into a txt file\n" +
					"$help: displays this message\n" +
					"$ping: displays latency in milliseconds\n"
				});
				break;
			} case "helpAdmin" + uniqueid : {
				if (user1 === "Smitty Werbenjagermanjensen" 
				|| user1 === "JaxClayton" 
				|| user1 === "NinjaChicken" 
				|| user1 === "Eddy Reds"
				|| user1 === "UndecidedTrout"
				|| user1 === "木下") {
					bot.sendMessage({
						to: channelID,
						message: "Admin commands:\n" + 
						"$changeFile f: changes the current filename to f\n" +
						"$helpAdmin: displays this message\n" +
						"$stop: stops the bot, depending on how it was launched\n" +
						"$test: changes whether the bot is in testing mode or not"
					});
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
				break;
			} case "ping" + uniqueid: {
				const now = Date.now();
				bot.sendMessage({
					to: channelID,	
					message: "Pong! Latency: "
				});
				setTimeout(function() {
					bot.sendMessage({
					to: channelID,	
					message: Date.now() - now - 100 + ' ms '
				});
				}, 100);
				break;	
			} case "changeFile" + query[0]: {
				if (user1 === "Smitty Werbenjagermanjensen" 
				|| user1 === "JaxClayton" 
				|| user1 === "NinjaChicken" 
				|| user1 === "Eddy Reds"
				|| user1 === "UndecidedTrout"
				|| user1 === "木下") { 
					bot.sendMessage({
						to: channelID,	
						message: "The file has been changed from " + file + " to " + query[0]
					});
					file = query[0];
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
				break;
			} case 'stop' + uniqueid: {
				if (user1 === "Smitty Werbenjagermanjensen" 
				|| user1 === "JaxClayton" 
				|| user1 === "NinjaChicken" 
				|| user1 === "Eddy Reds"
				|| user1 === "UndecidedTrout"
				|| user1 === "木下") {
					bot.sendMessage({
						to: channelID,	
						message: "Warning: depending on how I was launched, this may not do anything. If I do not go offline after a minute, you need to contact my creator.\nBye!"
					});
					setTimeout(function() {
						process.exit();
					}, 500);
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
				break;
			} case 'test' + uniqueid: {
				if (user1 === "Smitty Werbenjagermanjensen" 
				|| user1 === "JaxClayton" 
				|| user1 === "NinjaChicken" 
				|| user1 === "Eddy Reds"
				|| user1 === "UndecidedTrout"
				|| user1 === "木下") {
					if(testing) {
						testing = false;
					} else {
						testing = true;
					}
					bot.sendMessage({
						to: channelID,	
						message: "The testing boolean has been set from " + !testing + " to " + testing 
					});
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
				break;
			}  case 'addEvent' + query[1]: {
				if (user1 === "Smitty Werbenjagermanjensen" 
				|| user1 === "JaxClayton" 
				|| user1 === "NinjaChicken" 
				|| user1 === "Eddy Reds"
				|| user1 === "UndecidedTrout"
				|| user1 === "木下") {
					if (query[1] === undefined) {
						bot.sendMessage({
							to: channelID,	
							message: "No Event? D:"
						});
					} else {
						options.push(query[1]);
						bot.sendMessage({
							to: channelID,
							message: "Your event has been added to the list of possible events for next meeting."
						});
					}
					
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
			} case 'remEvent' + query[1]: {
				if (user1 === "Smitty Werbenjagermanjensen" 
				|| user1 === "JaxClayton" 
				|| user1 === "NinjaChicken" 
				|| user1 === "Eddy Reds"
				|| user1 === "UndecidedTrout"
				|| user1 === "木下") {
					if (query[1] === undefined) {
						bot.sendMessage({
							to: channelID,	
							message: "No Event? D:"
						});
					} else {
						options.push(query[1]);
						bot.sendMessage({
							to: channelID,
							message: "Your event has been added to the list of possible events for next meeting."
						});
					}
					
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
			} default: {
				bot.sendMessage({
					to: channelID,	
					message: "Oh I am SOOOOO sorry. ~~/s~~ I don't know what you were trying to type. You can see a list of commands to use by typing !help or !helpAdmin, if you're an admin."
				});
				break;
			}
			}
		}
});

/*
var links = ['https://www.youtube.com/watch?v=IEt8aHdxSHE',
	'https://youtu.be/0W3OdO18t0U', 'https://youtu.be/Hv6RbEOlqRo',
	'https://www.youtube.com/watch?v=VZrDxD0Za9I&list=PLu4wnki9NI_8VmJ7Qz_byhKwCquXcy6u9&index=1',
	'https://www.youtube.com/watch?v=K-KiXxf4Uls',
	'https://www.youtube.com/watch?v=3VbIYzB4H6s', 'https://www.youtube.com/watch?v=twC-qa7xdSA',
		'https://www.youtube.com/watch?v=oI9B7qWXV9Q', 'https://www.youtube.com/watch?v=TSJEKU9qKJI',
		'https://youtu.be/4axh8RYwDa8', 'https://www.youtube.com/watch?v=3tM0Sow-2r8', 'https://youtu.be/bj2FvGcXRKs',
		'https://www.youtube.com/watch?v=oq2OBtcQnCg', 'https://www.youtube.com/watch?v=7Zu6Jt4wtWQ',
		'https://youtu.be/p_t5CLyTwAI', 'https://www.youtube.com/watch?v=wX9Bc2JWItY', 'https://youtu.be/cba9yh_Jv6g',
		'https://youtu.be/lzD-MQXGyb8', 'https://www.youtube.com/watch?v=4_iLFT86y3k'];

var random = Math.random();
if (random <= 0.05) {
	bot.sendMessage({
		to: channelID,
		message: "I added your name to the text file, but only because I had to. D:"
	});
} else if (random >0.05 && random <= .69) {     
	bot.sendMessage({
		to: channelID,
		message: links[Math.floor(Math.random() * links.length)]
	});
} else {
bot.sendMessage({
to: channelID,
message: " I added your name because I wanted to, not because I had to. :D"
});
} 
*/