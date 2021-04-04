'''
Credit to 0/0#0001, he wrote this.
'''

import asyncio
from typing import Optional
from datetime import datetime

import discord
from discord.ext import commands

from utils.cog_class import Cog
from utils.ctx_class import MyContext

active_suggestions = {}
class Suggestions(Cog):
    @commands.command()
    async def suggest(self, ctx: MyContext, *, suggestion):
        """
        Sends a suggestion to hydrostaticcog!
        """
        suggestionChannel = self.bot.get_channel(816121030434488321)
        await suggestionChannel.trigger_typing()
        hydro: discord.User = await self.bot.fetch_user(711960088553717781)
        hydro_mention: str = hydro.mention
        embed = discord.Embed(title='Suggestion', color=0x1abc9c)
        embed.add_field(name='Suggestor:', value=ctx.author.mention, inline=False)
        embed.add_field(name='Suggestion:', value=suggestion, inline=False)
        embed.add_field(name='Voting:', value=f'React with :white_check_mark: to vote for the suggestion\nReact with :x: to vote against this suggestion\n{hydro_mention} can deny a suggestion with :octagonal_sign:', inline=False)
        timestamp = datetime.now()
        embed.set_footer(text=timestamp)
        try:
            msg: discord.Message = await suggestionChannel.send(embed=embed)
            await msg.add_reaction("✅")
            await msg.add_reaction("❌")
            await msg.add_reaction("🛑")
        except discord.HTTPException:
            await ctx.send("Failed to send suggestion due to a Discord error. Try again.")
        else:
            await ctx.send("Sent suggestion successfully.")

setup = Suggestions.setup
