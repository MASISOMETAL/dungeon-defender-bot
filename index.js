import 'dotenv/config'
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

const BOT_TOKEN = process.env.BOT_TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = join(process.cwd(), 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  import(`./commands/${file}`).then(command => {
    if (command.default?.data && command.default?.execute) {
      client.commands.set(command.default.data.name, command.default);
    }
  });
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
    }
  }
});

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.login(BOT_TOKEN);

// Server Dummy

import http from "http"

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El bot está funcionando.\n');
});

// Configurar el puerto
const PORT = process.env.PORT || 2400;
server.listen(PORT, () => {
  console.log(`Servidor web nativo corriendo en el puerto ${PORT}`);
});