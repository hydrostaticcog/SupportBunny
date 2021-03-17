'''
Credit to 0/0#0001, he wrote this.
'''

import asyncio
from typing import Optional

import discord
from discord.ext import commands

from utils.cog_class import Cog
from utils.ctx_class import MyContext

active_suggestions = {}
class Suggestions(Cog):
    @commands.command()
    async def suggest(self, ctx: MyContext, *, suggestion):
        suggestion_embed = discord.Embed(title="Suggestion",
                                         description=f"By {ctx.author.mention}.\n"
                                                     "React with ✅ to vote for this suggestion, and ❌ to vote "
                                                     "against this suggestion.\n"
                                                     "hydro can deny a suggestion by reacting with 🛑.\n")
        suggestion_embed.add_field(name="Suggestion", value=suggestion)
        try:
            suggestion_channel = self.bot.get_channel(816121030434488321)
            msg: discord.Message = await suggestion_channel.send(embed=suggestion_embed)
            await msg.add_reaction("✅")
            await msg.add_reaction("❌")
            await msg.add_reaction("🛑")
        except discord.HTTPException:
            await ctx.send("Failed to send suggestion due to a Discord error. Try again.")
        else:
            await ctx.send("Sent suggestion successfully.")
            active_suggestions[msg.id] = suggestion

setup = Suggestions.setup
