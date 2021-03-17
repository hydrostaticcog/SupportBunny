import discord
from typing import Optional

from discord.ext import commands
from discord.utils import get

from utils.cog_class import Cog
from utils.ctx_class import MyContext

active_suggestions = {}

class Suggestions(Cog):
    @commands.command()
    async def suggest(self, ctx: MyContext, *, suggestion):
        hydro: discord.User = self.bot.get_user(711960088553717781)
        hydro_mention = hydro.mention
        embed = discord.Embed(title='Suggestion', description=f'By {ctx.author.mention}\n React with :white_check_mark: to vote for this suggestion. React with :x: to downvote this suggestion. {hydro_mention} can deny this suggestion with :octagonal_sign:.', color=0x1abc9c)
        embed.add_field(name='Suggestion', value=suggestion, inline=False)
        try:
            suggestion_channel = self.bot.get_channel(816121030434488321)
            msg: discord.Message = await suggestion_channel.send(embed=embed)
            await msg.add_reaction("✅")
            await msg.add_reaction("❌")
            await msg.add_reaction("🛑")
        except discord.HTTPException:
            await ctx.send("Failed to send suggestion due to a Discord error. Try again.")
        else:
            await ctx.send("Sent suggestion successfully.")
            active_suggestions[msg.id] = suggestion

        
        @commands.Cog.listener()
        async def on_raw_reaction_add(self, payload: discord.RawReactionActionEvent):
            hydro: discord.User = self.bot.get_user(711960088553717781)
            hydro_mention = hydro.mention
            if payload.emoji.name == ':x:' and payload.channel_id == 816121030434488321:
                if payload.user_id in self.bot.owner_ids and payload.message_id in active_suggestions:
                    denied_suggestion = discord.Embed(title='This Suggestion was Denied!', description=f'{hydro_mention} denied this suggestion!', color=0x1abc9c)
                    denied_suggestion.add_field(name='Suggestion', value=active_suggestions[payload.message_id])
                    channel: discord.TextChannel = self.bot.get_channel(payload.channel_id)
                    suggestmsg: discord.Message = await channel.fetch_message(payload.message_id)
                    await suggestmsg.edit(embed=denied_suggestion)
                    await suggestmsg.clear_reactions()
                else:
                    user: Optional[discord.User] = self.bot.get_user(payload.user_id)
                    if user is not None:
                        await user.send("You don't have permission to deny this suggestion!")

setup = Suggestions.setup