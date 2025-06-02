export default {
  name: 'bonus',
  async execute(message) {
    const args = message.content.slice(8).trim().split(' ').map(Number);

    // ✅ Validación: asegurarse de que hay exactamente 4 números y son válidos
    if (args.length < 1 || args.length > 4 || args.some(isNaN)) {
      return message.reply('⚠ Debes ingresar **2, 3 o 4 números**. Ejemplo: `<<bonus 100 100` o `<<bonus 100 100 100` o `<<bonus 100 100 100 100`');
    }

    // 🔢 Calcular la suma total
    const sumaTotal = args.reduce((acc, num) => acc + num, 0);
    const bonus = (sumaTotal * 40) / 100

    // 🟢 Enviar el resultado
    message.reply(`🎲 **Estadisticas de la armadura:** \`${sumaTotal}\`\n` +
      `🎲 **Bonus total:** \`${Math.round(sumaTotal + bonus)}\``
    );
  }
};
