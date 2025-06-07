export default {
    name: 'res',
    async execute(message) {
        if (!message.content.includes('|')) {
            return message.reply('⚠ Formato incorrecto. Usa: `<<res -14 17 -12 -6 | 411 380 394` o `<<res -14 17 -12 -6 | 411 380`');
        }

        const [grupo1Str, grupo2Str] = message.content.slice(6).split('|').map(str => str.trim());
        const grupo1 = grupo1Str.split(' ').map(Number);
        let grupo2 = grupo2Str.split(' ').map(Number);

        // ✅ Validaciones: 4 números en grupo 1, 2 o 3 números en grupo 2
        if (grupo1.length !== 4 || (grupo2.length !== 2 && grupo2.length !== 3) || grupo2.some(n => n <= 0) || grupo1.some(isNaN) || grupo2.some(isNaN)) {
            return message.reply('⚠ Debes ingresar **4 números** en el primer grupo y **2 o 3 números positivos** en el segundo grupo.\n'
                + 'Ejemplo: `<<res -14 17 -12 -6 | 411 380 394` o `<<res -14 17 -12 -6 | 411 380`');
        }

        // ✅ Si el usuario ingresa solo 2 valores en el segundo grupo, agregamos un `0` como tercer valor
        if (grupo2.length === 2) grupo2.push(0);

        // 🟢 1. Función para calcular puntos requeridos
        const calcularPuntosNecesarios = (valor) => {
            let puntos = 0;

            while (valor < 29) {
                if (valor >= -17 && valor < -13) {
                    valor += 2;
                } else if (valor >= -13 && valor < 14) {
                    valor += 1;
                } else if (valor >= 14 && valor < 20) {
                    valor += 2;
                } else if (valor >= 20 && valor < 22) {
                    valor += 3;
                } else if (valor >= 22 && valor < 29) {
                    valor += 1;
                }
                puntos++;
            }

            return puntos;
        };

        // 🔢 2. Aplicar la conversión de puntos a cada estadística
        const puntosGastados = grupo1.map(num => calcularPuntosNecesarios(num));
        const totalGastado = puntosGastados.reduce((acc, num) => acc + num, 0);

        // 🔄 3. Restar el gasto del tercer número del grupo 2 (si hay solo 2, será `0`)
        let restanteGrupo2 = grupo2[2] - totalGastado;
        if (restanteGrupo2 < 0) restanteGrupo2 = 0;

        // 🔄 4. Repartir lo que queda entre los primeros dos números del grupo 2
        const valorItem = grupo2[0] + grupo2[1] + restanteGrupo2;
        const bonusItem = (valorItem * 40) / 100;

        // 🟢 5. Responder con el resultado
        message.reply(
            `**Total de puntos gastados para alcanzar 29:** \`${totalGastado}\`\n` +
            `**Nuevo valor del ítem:** \`${valorItem}\`\n` +
            `**Valor con el bonus de set:** \`${Math.round(bonusItem + valorItem)}\``
        );
    }
};
