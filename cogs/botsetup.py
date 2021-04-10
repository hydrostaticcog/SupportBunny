import discord

from discord.ext import commands

from utils.cog_class import Cog
from utils.ctx_class import MyContext
from utils.models import get_from_db

class BotSetup(Cog):
    @commands.has_guild_permissions(administrator=True)
    @commands.group()
    async def initialize(self, ctx: MyContext):
        """
        Setup the guild for support tickets! (Admins only!)
        """
        db_guild = await get_from_db(ctx.guild)
        if not ctx.invoked_subcommand:
            if (db_guild.isInit > 1):
                await ctx.send(f"It looks like you have already set your guild up!")
                return
            else:
                embed = discord.Embed(title='Setting up SupportBunny', color=0x1abc9c)
                embed.add_field(name='Support Role', value="Please create a support role, and then run `.initialize role <EXACT ROLE NAME>`.", inline=False)
                embed.add_field(name='Support Category', value="Please create a channel for the game to take place in, and then run `.initialize category <EXACT CATEGORY NAME>`.", inline=False)
                await ctx.send(embed=embed)
    
    @initialize.command()
    async def role(self, ctx: MyContext, *, role):
        """
        Sets the guild's support role
        """
        db_guild = await get_from_db(ctx.guild)
        if (db_guild.isInit > 1):
                await ctx.send(f"It looks like you have already set your guild up!")
                return
        else:
            db_guild.supportRole = role
            db_guild.isInit = db_guild.isInit + 1
            await db_guild.save()
            await ctx.send(f"Set {ctx.guild.name}'s support role to {role}")

    @initialize.command()
    async def category(self, ctx: MyContext, *, category):
        """
        Sets the category where tickets are created
        """
        db_guild = await get_from_db(ctx.guild)
        if (db_guild.isInit > 1):
                await ctx.send(f"It looks like you have already set your guild up!")
                return
        else:
            db_guild.supportCat = category
            db_guild.isInit = db_guild.isInit + 1
            await db_guild.save()
            await ctx.send(f"Set {ctx.guild.name}'s support category to {category}")

    @initialize.command()
    async def reset(self, ctx: MyContext):
        """
        Resets the guild's preferences
        """
        db_guild = await get_from_db(ctx.guild)
        if (db_guild.isInit < 2):
                await ctx.send(f"It looks like you haven't set your guild up!")
                return
        else:
            db_guild.supportCat = 'none'
            db_guild.supportRole = 'none'
            db_guild.isInit = 0
            await db_guild.save()
            await ctx.send(f'Reset bot! Please reinitialize soon for access to `game` commands!')



setup = BotSetup.setup