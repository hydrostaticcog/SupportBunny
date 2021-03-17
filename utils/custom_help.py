from utils.bot_class import get_prefix
from discord.ext import commands
import discord
import json

from utils.config import load_config
from utils.models import get_from_db

config = load_config()

with open('release.json') as f:
    data = json.load(f)
    release = data['sbVersion']

class EmbedHelpCommand(commands.HelpCommand):
    """This is an example of a HelpCommand that utilizes embeds.
    It's pretty basic but it lacks some nuances that people might expect.
    1. It breaks if you have more than 25 cogs or more than 25 subcommands. (Most people don't reach this)
    2. It doesn't DM users. To do this, you have to override `get_destination`. It's simple.
    Other than those two things this is a basic skeleton to get you started. It should
    be simple to modify if you desire some other behaviour.

    To use this, pass it to the bot constructor e.g.:

    bot = commands.Bot(help_command=EmbedHelpCommand())
    """

    def get_command_signature(self, command):
        return '{0.qualified_name} {0.signature}'.format(command)

    async def send_bot_help(self, mapping):
        embed = discord.Embed(title="SupportBunny's Commands", colour=0x1abc9c)
        embed.add_field(name='Ticket', value='Open a ticket with `.ticket open <topic>`', inline=False)
        embed.add_field(name='Suggest', value='If you want a feature added, you can suggest it with `.suggest <suggestion>`.')
        embed.add_field(name='Initialize (admins only)', value='Admins can setup their servers with this command', inline=False)
        await self.get_destination().send(embed=embed)