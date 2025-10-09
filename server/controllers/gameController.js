import User from "../models/userSchema.js";
import Party from "../models/partySchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class GameController {
  constructor() {}

  testing = async (req, res) => {
    try {
      const { name } = req.body;
      const response = "Hello " + name;
      res.status(200).json({ message: "Hello World", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Only the leader can delete the party. Ensure party.members are objects with .email
  deleteParty = async (req, res) => {
    try {
      const { email, partyId } = req.body;
      const party = await Party.findOne({ _id: partyId });
      if (!party) {
        return res.status(400).json({ message: "Party not found" });
      }
      if (party.leader !== email) {
        return res
          .status(400)
          .json({ message: "User is not the leader of the party" });
      } else {
        // Clear partyId from all members (members are objects with email)
        for (let i = 0; i < party.members.length; i++) {
          const memberEmail = party.members[i].email ?? party.members[i];
          const member = await User.findOne({ email: memberEmail });
          if (member) {
            member.partyId = null;
            await member.save();
          }
        }
        await party.deleteOne();
        return res.status(200).json({ message: "Party deleted successfully" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  sendInvite = async (req, res) => {
    try {
      const { email, partyName, senderName, receiverEmails } = req.body;
      if (receiverEmails.length > 4) {
        return res
          .status(400)
          .json({ message: "Receiver Email length is unaccepetable!" });
      }
      let partyId;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Sender user not found" });
      }
      if (user.partyId) {
        return res.status(400).json({ message: "User already in a party" });
      } else {
        const party = {
          partyName,
          leader: email,
          members: [
            { email, isJoined: true, name: senderName, gaming: user.gaming },
          ],
        };
        const newParty = new Party(party);
        partyId = newParty._id;
        user.partyId = partyId;
        await user.save();
        await newParty.save();
      }

      const party = await Party.findOne({ _id: partyId });

      // Add each receiver as a member object and send notification + email
      for (let i = 0; i < receiverEmails.length; i++) {
        const receiver = await User.findOne({ email: receiverEmails[i] });
        if (!receiver) {
          return res.status(400).json({ message: `User ${receiverEmails[i]} not found` });
        } else {
          party.members.push({
            email: receiverEmails[i],
            isJoined: false,
            name: receiver.name,
            gaming: receiver.gaming,
          });
          receiver.notifications.unshift({
            title: `You have been invited to join a party from ${senderName} to ${partyName}`,
            isRead: false,
            info: { partyId: partyId.toString(), partyName, type: "party_invite" },
          });
          await receiver.save();

          // send email
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.MAIL,
              pass: process.env.MAILPASS,
            },
          });

          let mailOptions = {
            from: `One-Hub <support>`,
            to: receiverEmails[i],
            subject: "One-Hub: Party Invite",
            text: `You have been invited to join a party from ${senderName} to ${partyName}\n\nClick here to Login: http://localhost:5173/ and join party with party id: ${partyId}`,
          };
          // await send — allow transporter errors to be caught by outer try/catch
          await transporter.sendMail(mailOptions);
        }
      }

      await party.save();
      res.status(200).json({ message: "Invite sent successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  acceptInvite = async (req, res) => {
    try {
      const { email, partyId } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (user.partyId) {
        return res.status(400).json({ message: "User already in a party" });
      } else {
        const party = await Party.findOne({ _id: partyId });
        if (!party) {
          return res.status(400).json({ message: "Party not found" });
        }

        // make isJoined true for the member object
        const memberIndex = party.members.findIndex((m) => m.email === email);
        if (memberIndex === -1) {
          return res
            .status(400)
            .json({ message: "Invite not found for this user in party" });
        }
        party.members[memberIndex].isJoined = true;

        // remove the notification safely (only if present)
        const notifIndex = user.notifications.findIndex(
          (notification) =>
            notification.info && notification.info.partyId === partyId
        );
        if (notifIndex !== -1) {
          user.notifications.splice(notifIndex, 1);
        }

        user.partyId = partyId;
        await user.save();
        await party.save();
        res.status(200).json({ message: "Invite accepted successfully" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  /**
   * startFight:
   * - NO LONGER requires all members to be ready (isJoined)
   * - sets up opponent stats the same as before
   * - sets party.isFighting = true
   * - sets a "live" marker + liveUrl + liveStartedAt so frontend can show a "Live Party" button
   * - returns updated party in response
   */
  startFight = async (req, res) => {
    try {
      const { partyId } = req.body;
      const party = await Party.findOne({ _id: partyId });
      if (!party) {
        return res.status(400).json({ message: "Party not found" });
      }

      // Removed requirement that all members must be ready.
      // (If you want only the leader to start, enforce party.leader === req.body.requesterEmail or similar.)

      // Setup opponent as before
      party.opp = party.opp || {};
      party.opp.name = "Ender Dragon";
      let oppHealth = 0;
      let oppAttack = 0;

      for (let i = 0; i < party.members.length; i++) {
        const memberObj = party.members[i];
        // defend against stale/malformed member entries
        if (!memberObj || !memberObj.email) continue;
        const member = await User.findOne({ email: memberObj.email });
        if (!member || !member.gaming) continue;
        oppAttack += (member.gaming.maxHealth || 0) * 0.6;
        oppHealth += (member.gaming.avatar?.attack || 0) * 10;
      }

      party.opp.maxHealth = oppHealth || 100;
      party.opp.health = oppHealth || 100;
      party.opp.attack = oppAttack || 10;
      party.opp.image = "/assets/ender_dragon.gif";
      party.isFighting = true;

      // NEW: live-party metadata so frontend can show a "Live Party" button
      party.isLive = true;
      party.liveUrl = `/live/${party._id}`;
      party.liveStartedAt = new Date();

      await party.save();

      // Return updated party so frontend can immediately render a Live button
      res.status(200).json({ message: "Fight started successfully", party });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Correct leave logic for member objects in party.members
  leaveParty = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user || !user.partyId) {
        return res.status(400).json({ message: "User not in a party" });
      } else {
        const party = await Party.findOne({ _id: user.partyId });
        if (!party) {
          // clear stale partyId on user if party doesn't exist
          user.partyId = null;
          await user.save();
          return res.status(400).json({ message: "Party not found" });
        }

        // members are objects: find index by email
        const index = party.members.findIndex((m) => m.email === email);
        if (index === -1) {
          return res
            .status(400)
            .json({ message: "User is not a member of the party" });
        }

        // remove member object
        party.members.splice(index, 1);

        // clear user's partyId
        user.partyId = null;
        await user.save();

        // if leader left, transfer leadership or delete if no members remain
        if (party.leader === email) {
          if (party.members.length === 0) {
            // delete party and ensure any remaining (none) members have partyId cleared
            await party.deleteOne();
            return res
              .status(200)
              .json({ message: "User left party successfully (party deleted)" });
          }
          // set leader to email of first remaining member object
          party.leader = party.members[0].email;
        }

        await party.save();
        res.status(200).json({ message: "User left party successfully" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getParty = async (req, res) => {
    try {
      const { partyId } = req.body;
      console.log(req.body);
      const party = await Party.findOne({ _id: partyId });
      if (!party) {
        return res.status(400).json({ message: "Party not found" });
      }
      res.status(200).json({ party });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  /**
   * completeFight:
   * - sets isFighting = false
   * - clears isLive and liveUrl
   * - clears partyId from all members
   * - deletes the party
   * - returns success response
   */
  completeFight = async (req, res) => {
    try {
      const { partyId } = req.body;
      const party = await Party.findOne({ _id: partyId });
      if (!party) {
        return res.status(400).json({ message: "Party not found" });
      }

      party.isFighting = false;
      party.isLive = false;
      party.liveUrl = null;
      party.liveStartedAt = null;

      // remove the party from all the users
      for (let i = 0; i < party.members.length; i++) {
        const memberObj = party.members[i];
        if (!memberObj || !memberObj.email) continue;
        const member = await User.findOne({ email: memberObj.email });
        if (member) {
          member.partyId = null;
          await member.save();
        }
      }

      // delete the party from the database
      await party.deleteOne();

      res.status(200).json({ message: "Fight completed and party removed" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default GameController;
