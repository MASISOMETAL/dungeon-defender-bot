export default {
    name: 'res',
    async execute(message) {
        if (!message.content.includes('|')) {
            return message.reply('⚠ Formato incorrecto. Usa: `<<res -14 17 -12 -6 | 411 380 394`');
        }

        const [grupo1Str, grupo2Str] = message.content.slice(6).split('|').map(str => str.trim());
        const grupo1 = grupo1Str.split(' ').map(Number);
        const grupo2 = grupo2Str.split(' ').map(Number);

        if (grupo1.length !== 4 || grupo2.length !== 3 || grupo2.some(n => n <= 0) || grupo1.some(isNaN) || grupo2.some(isNaN)) {
            return message.reply('⚠ Debes ingresar **4 números** en el primer grupo y **3 números positivos** en el segundo grupo.\n'
                + 'Ejemplo: `<<res -14 17 -12 -6 | 411 380 394`');
        }

        const diferencias = grupo1.map(num => (num < 39 ? 39 - num : 0));
        const totalGastado = diferencias.reduce((acc, num) => acc + num, 0);
        let restanteGrupo2 = grupo2[2] - totalGastado;
        if (restanteGrupo2 < 0) restanteGrupo2 = 0;

        const nuevoValor1 = grupo2[0] + restanteGrupo2;
        const nuevoValor2 = grupo2[1] + restanteGrupo2;

        message.reply(
            `💰 **Total gastado para llegar a 39:** \`${totalGastado}\`\n`
            + `📊 **Nuevo estado del grupo 2:**\n`
            + `- 🟢 Primer valor actualizado: \`${nuevoValor1}\`\n`
            + `- 🟢 Segundo valor actualizado: \`${nuevoValor2}\`\n`
            + `- 🟢 Lo que quedó del tercero después de la resta: \`${restanteGrupo2}\``
        );
    }
};
