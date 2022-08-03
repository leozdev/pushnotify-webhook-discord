import discord
from stockx import search
from config import TOKEN, CHANNEL_ID


client = discord.Client()


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.channel.id != CHANNEL_ID:
        return

    if message.content.split(' ')[0] == '!stockx':
        query = message.content.replace('!stockx ', '')

        item = search(query)

        embed = discord.Embed(
            title=item['title'],
            url='https://stockx.com/en-gb/' + item['urlKey',]
        )
        embed.set_thumbnail(
            url=item['media']['imageUrl']
        )
        embed.set_footer(
            text="Push StockX"
        )
        embed.set_Image(
            url='https://cdn.discordapp.com/attachments/1002335282500223026/1004244865569259620/unknown.png'
            )
        embed.add_field(
            name='Cw',
            value=item['colorway']
        )
        embed.add_field(
            name='SKU',
            value=item['styleId']
        )
        embed.add_field(
            name='Oferta Baixa',
            value=item['market']['lowestAsk']
        )
        embed.add_field(
            name='Oferta Alta',
            value=item['market']['highestBid']
        )
        embed.add_field(
            name='Última Venda',
            value=item['market']['lastSale']
        )
        embed.add_field(
            name='Vendas nas últimas 72h',
            value=item['market']['salesLast72Hours']
        )
        await message.channel.send(embed=embed)

client.run(TOKEN)