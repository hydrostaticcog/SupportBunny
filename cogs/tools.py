import discord
import json
import sys

from utils.ctx_class import MyContext
from utils.cog_class import Cog

from discord.ext import commands
from discord.utils import get

with open('release.json') as f:
    data = json.load(f)
    release = data['sbVersion']

class Tools(Cog):
    @commands.command()
    async def invite(self, ctx: MyContext):
        inviteEmbed = discord.Embed(title='SupportBunny Invite Links', color=0x1abc9c)
        inviteEmbed.add_field(name='Bot Invite', value='https://discord.com/oauth2/authorize?client_id=812870733570768937&scope=bot&permissions=2146827775', inline=True)
        inviteEmbed.add_field(name='Support Server Invite', value='https://discord.gg/2uGynhee4K')
        inviteEmbed.set_footer(text=f'Current Bot Version: v{release}')
        await ctx.send(embed=inviteEmbed)

    @commands.command()
    async def credits(self, ctx: MyContext):
        hydro: discord.User = await self.bot.fetch_user(711960088553717781)
        eyes: discord.User =  await self.bot.fetch_user(138751484517941259)
        kai: discord.User = await self.bot.fetch_user(780818479376236555)
        hydro_mention: str = hydro.mention
        eyes_mention: str = eyes.mention
        kai_mention: str = kai.mention
        creditsEmbed = discord.Embed(title='SupportBunny Credits', color=0x1abc9c)
        creditsEmbed.add_field(name='Lead Developer', value=hydro_mention)
        creditsEmbed.add_field(name='Developer', value=kai_mention)
        creditsEmbed.add_field(name='Bot Framework Developer', value=eyes_mention)
        creditsEmbed.set_footer(text=f'Current Bot Version: v{release}')
        await ctx.send(embed=creditsEmbed)

    @commands.command()
    async def version(self, ctx: MyContext):
        verEmbed = discord.Embed(title="SupportBunny Version Info", description='', color=0x1abc9c)
        verEmbed.add_field(name='Version', value=data['sbVersion'], inline='true')
        verEmbed.add_field(name='Release Date', value=data['releaseDate'], inline='true')
        verEmbed.add_field(name='Have Issues?', value='Let us know at our GitHub page!\n https://github.com/hydrostaticcog/SupportBunny', inline='false')
        verEmbed.add_field(name='System Info', value=f'Running Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro} on {sys.platform}', inline='true')
        await ctx.send(embed=verEmbed)


setup = Tools.setup