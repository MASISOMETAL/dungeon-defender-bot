import 'dotenv/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

const TOKEN = process.env.BOT_TOKEN;
const PREFIX = '<<';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

// Cargar comandos dinámicamente
const commandsPath = join(process.cwd(), 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  import(`./commands/${file}`).then(command => {
    if (command.default?.name && command.default?.execute) {
      client.commands.set(command.default.name, command.default);
    }
  });
}

// 🛠️ Manejo de mensajes con prefijo
client.on('messageCreate', async message => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  const command = client.commands.get(commandName);
  if (command) {
    try {
      await command.execute(message);
    } catch (error) {
      console.error(error);
      message.reply('Hubo un error al ejecutar el comando.');
    }
  }
});

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.login(TOKEN);


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