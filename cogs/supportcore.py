
import discord
import json
import datetime

from discord.ext import commands
from discord.ext.commands import bot
from discord.utils import get

from utils.ctx_class import MyContext
from utils.cog_class import Cog
from utils.models import get_from_db

class SupportCore(Cog):
    @commands.group()
    async def ticket(self, ctx: MyContext):
        if not ctx.invoked_subcommand:
            await ctx.send(f"Support Bunny's ticket command!\nSyntax: `&ticket <option>`")

    @ticket.command(aliases=['create'])
    async def open(self, ctx: MyContext, *, topic='Not Specified'):
        db_guild = await get_from_db(ctx.guild)
        if (db_guild.isInit < 2):
            await ctx.send(f"It looks like you haven't setup your guild yet, please run `.initialize` to set it up!")
            await ctx.message.delete()
            return
        await ctx.message.delete()
        db_user = await get_from_db(ctx.author)
        ticketNum = db_guild.ticketNum
        db_user.ticketNum = ticketNum
        supportCat = get(ctx.guild.categories, id=db_guild.supportCat)
        supportRole = get(ctx.guild.roles, id=db_guild.supportRole)
        botRole = get(ctx.guild.roles, name=self.bot.user.name)
        channelName = f'ticket-{ticketNum}'
        await ctx.guild.create_text_channel(channelName, category=supportCat)
        channel = get(ctx.guild.channels, name=channelName)
        await channel.set_permissions(supportRole, view_channel=True)
        await channel.set_permissions(ctx.guild.default_role, view_channel=False)
        await channel.set_permissions(ctx.author, view_channel=True)
        await channel.set_permissions(botRole, view_channel=True)
        db_guild.ticketNum = ticketNum + 1
        await db_guild.save()
        await db_user.save()
        date = datetime.date.today()
        embed = discord.Embed(title=f'Support Ticket #{ticketNum}', color=0x2f3136)
        embed.add_field(name='Topic', value=topic, inline=False)
        embed.add_field(name='Support', value='You can add other people here with `.ticket adduser <@user>`.\nYou can also remove them with `.ticket rmuser <@user>`.', inline=False)
        embed.add_field(name='Resolving Ticket', value='You can resolve this ticket with `.ticket resolve`.')
        embed.set_footer(text=f'Ticket #{ticketNum} created by {ctx.author.name} on {date.month}/{date.day}/{date.year}')
        await channel.send(f"{supportRole.mention}, new ticket from {ctx.author.mention}", embed=embed)

    @ticket.command(aliases=['resolve'])
    async def close(self, ctx: MyContext):
        db_user = await get_from_db(ctx.author)
        ticketNum = db_user.ticketNum
        channel = get(ctx.guild.channels, name=f'ticket-{ticketNum}')
        try:
            await channel.delete()
        except discord.ext.commands.errors.CommandInvokeError:
            await ctx.send("You can't close this channel")
        db_user.ticketNum = 0
        await db_user.save()
            
    @commands.has_guild_permissions(manage_channels=True)
    @ticket.command()
    async def forceclose(self, ctx: MyContext, ticketNum):
        channel = get(ctx.guild.channels, name=f'ticket-{ticketNum}')
        await channel.delete()

    @ticket.command()
    async def adduser(self, ctx: MyContext, user: discord.User):
        db_user = await get_from_db(ctx.author)
        channelname= ctx.channel.name
        ticketNum1 = db_user.ticketNum
        if (channelname == f'ticket-{ticketNum1}' or ctx.message.author.guild_permissions.manage_channels):
            await ctx.channel.set_permissions(user, view_channel=True)
            await ctx.send(f'{user.mention} added to the channel!')
        else:
            await ctx.send('You are not in a channel you own!')
            

    @ticket.command()
    async def rmuser(self, ctx: MyContext, user: discord.User):
        db_user = await get_from_db(ctx.author)
        channelname= ctx.channel.name
        ticketNum1 = db_user.ticketNum
        if (channelname == f'ticket-{ticketNum1}' or ctx.message.author.guild_permissions.manage_channels):
            await ctx.channel.set_permissions(user, view_channel=False)
            await ctx.send(f'{user.mention} removed from the channel!')
        else:
            await ctx.send('You are not in a channel you own!')



setup = SupportCore.setup