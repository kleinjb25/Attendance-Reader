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
var admin = false; //whether the user is an admin or not
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
});

bot.on("message", function (user1, userID, channelID, message, evt) {
	if (message.substring(0, 1) === "$") {
		admin = false;
		var query = message.substring(1).split(" ");
		var command = query[0] + query[1];
		var uniqueid = query[1];
		query = query.splice(1);
		if (user1 === "Smitty Werbenjagermanjensen" 
				|| user1 === "JaxClayton" 
				|| user1 === "NinjaChicken" 
				|| user1 === "Eddy Reds"
				|| user1 === "UndecidedTrout"
				|| user1 === "木下")
			admin = true;
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
				if (admin) {
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
				if (admin) { 
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
				if (admin) {
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
				if (admin) {
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
			}  default: {
				bot.sendMessage({
					to: channelID,	
					message: "Oh I am SOOOOO sorry. ~~/s~~ I don't know what you were trying to type. You can see a list of commands to use by typing !help or !helpAdmin, if you're an admin."
				});
				break;
			}
			}
		}
});