import { SlashCommandBuilder, MessageFlags } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('res')
    .setDescription('Divide los números ingresados y muestra el resultado.')
    .addStringOption(option =>
      option.setName('grupo1')
        .setDescription('Coloca las resistencias')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('grupo2')
        .setDescription('Coloca el stat, la hab1 o hab2 y los upgrades')
        .setRequired(true)),

  async execute(interaction) {
    const grupo1 = interaction.options.getString('grupo1').split(' ').map(Number);
    const grupo2 = interaction.options.getString('grupo2').split(' ').map(Number);

    // Validaciones
    if (grupo1.length !== 4 || grupo2.length !== 3 || grupo2.some(n => n <= 0) || grupo1.some(isNaN) || grupo2.some(isNaN)) {
      return interaction.reply({
        content: '⚠ Los parámetros deben cumplir:\n'
          + '➡ **Primer grupo:** 4 números (pueden ser positivos o negativos).\n'
          + '➡ **Segundo grupo:** 3 números (deben ser **positivos**).\n'
          + 'Ejemplo de uso: `/res "10 10 10 10" "100 200 300"`',
        flags: MessageFlags.Ephemeral
      });
    }

    // 🟢 1. Calcular cuánto falta para llegar a 39
    const diferencias = grupo1.map(num => (num < 39 ? 39 - num : 0));
    const totalGastado = diferencias.reduce((acc, num) => acc + num, 0);

    // 🟢 2. Restar el total gastado al tercer número del segundo parámetro
    let restanteGrupo2 = grupo2[2] - totalGastado;
    if (restanteGrupo2 < 0) restanteGrupo2 = 0;  // No puede ser negativo

    // 🟢 3. Sumar el resultado restante a los primeros dos números del segundo parámetro
    const valorItem = grupo2[0] + grupo2[1] + restanteGrupo2;

    // 📢 Respuesta al usuario
    interaction.reply(
      `**Resistencias:** ${grupo1[0]}, ${grupo1[1]}, ${grupo1[2]}, ${grupo1[3]},\n` +
      `**Stat:** ${grupo2[0]}, **Hab1 o 2:** ${grupo2[1]},\n` +
      `**Total gastado para llegar a 39:** \`${totalGastado}\`\n` +
      `- 🟢 El valor del item seria: \`${valorItem}\``
    );
  }
};
