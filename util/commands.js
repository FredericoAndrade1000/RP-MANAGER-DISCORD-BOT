import guild from "../command-list/guild.js"
import user from "../command-list/user.js"
import bot from "../command-list/bot.js"

export default [
    {
        syntax: ["pagar-lançamento", "pagar-lancamento", "pl"],
        use: "pagar-lançamento [usuário] [massa] [reutilizável(s/n)] [dificuldade(1 a 6)]",
        description: "Concluí um lançamento para a agência selecionada.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: user.payLaunch,
        example: "pagar-lançamento @RP-Manager 578.83 s 3"
    },
    {
        syntax: ["pagar-missão", "pagar-missao", "pm"],
        use: "pagar-missão [usuário] [massa] [reutilizável(s/n)] [dificuldade(1 a 6)]",
        description: "Concluí uma missão para a agência selecionada.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: user.payMission,
        example: "pagar-missão @RP-Manager 433.71 s 1"
    },
    {
        syntax: ["pagar-criador", "pc"],
        use: "pagar-criador [usuário] [número de concluíntes] [dificuldade(1 a 6)]",
        description: "Faz um pagamento da recompensa dada aos criadores de missão.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: user.payCreator,
        example: "calcule-criador @RP-Manager 3 2"
    },
    {
        syntax: ["mostrar-níveis", "mostrar-niveis", "mn"],
        use: "mostrar-níveis",
        description: "Mostra todos os níveis criados.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: guild.showLevels,
        example: "mostrar-níveis 2"
    },
    {
        syntax: ["definir-prefíxo", "definir-prefixo", "dp"],
        use: "definir-prefixo [prefixo]",
        description: "Define o prefixo do bot para o servidor.",
        serverLevelPermission: 1,
        userLevelPermission: 2,
        execute: guild.setPrefix,
        example: "definir-prefixo !"
    },
    {
        syntax: ["adicionar-missão", "am"],
        use: "adicionar-missão [título] & [descrição] & [objetivo] & [nível] & (observações) & (proibições) & [prazo de entrega]",
        description: "Cria uma nova missão. Use & para separar argumentos.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: guild.addMission,
        example: "adicionar-missão Sputnik-1 & Depois de se ver perdendo espaço em uma disputa, o governo da URSS quer enviar algo para o espaço & Lance um satélite que represente a Sputnik-1 na órbita da Terra & 1 & O foguete deve se parecer com o Semiorka & Uso de Cheats ou edições dos arquivos do jogo & 04/10/2021"
    },
    {
        syntax: ["mostrar-missões", "mostrar-missoes", "mm"],
        use: "mostrar-missões",
        description: "Mostra todas as missões criadas.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: guild.showMissions,
        example: "mostrar-missões 3"
    },
    {
        syntax: ["remover-missão", "remover-missao", "rm"],
        use: "remover-missão [número da missão]",
        description: "Remove a missão selecionada. Redefine a ordem das missões subsequentes.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: guild.removeMission,
        example: "remover-missão 5"
    },
    {
        syntax: ["postar-missão", "postar-missao", "pm"],
        use: "postar-missão [número da missão]",
        description: "Posta no canal definido a missão selecionada.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: guild.postMission,
        example: "postar-missão 2"
    },
    {
        syntax: ["definir-canal-missões", "definir-canal-missoes", "dcm"],
        use: "definir-canal-missões [canal]",
        description: "Define o canal onde serão postadas as missões.",
        serverLevelPermission: 1,
        userLevelPermission: 2,
        execute: guild.setMissionsChannel,
        example: "definir-canal-missões #missões"
    },
    {
        syntax: ["definir-canal-registros", "definir-canal-registros", "dcr"],
        use: "definir-canal-registros [canal]",
        description: "Define o canal onde serão postados os registros.",
        serverLevelPermission: 1,
        userLevelPermission: 2,
        execute: guild.setLogsChannel,
        example: "definir-canal-registros #registros"
    },
    {
        syntax: ["definir-cargo-gerenciador", "dcg"],
        use: "definir-cargo-gerenciador [cargo]",
        description: "Define o cargo que pode usar alguns comandos específicos.",
        serverLevelPermission: 1,
        userLevelPermission: 2,
        execute: guild.setManagerRole,
        example: "definir-cargo-gerenciador Moderador"
    },
    {
        syntax: ["registrar-agência", "registrar-agencia", "ra"],
        use: "registrar-agência [nome] & (descrição)",
        description: "Registra uma agência para o usuário. Use & para separar argumentos.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.setAgency,
        example: "registrar-agência Red Shift Nebular & Sempre fazendo um \"desvio\""
    },
    {
        syntax: ["agência", "agencia", "a"],
        use: "agência (usuário)",
        description: "Mostra informações sobre a agência do usuário.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.showAgency,
        example: "agência @RP-Manager"
    },
    {
        syntax: ["pesquisar", "pesquisa", "p"],
        use: "pesquisar [número de pacotes de pesquisas]",
        description: "Faz um investimento em um determinado número de pacotes de pesquisa.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.research,
        example: "pesquisar 5"
    },
    {
        syntax: ["atualizar"],
        use: "atualizar (entidade)",
        description: "Avança para o próximo nível a entidade escolhida pelo usuário.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.upgrade,
        example: "atualizar agência"
    },
    {
        syntax: ["remover-dinheiro", "rd"],
        use: "remover-dinheiro [usuário] [quantidade]",
        description: "Remove dinheiro da agência do usuário selecionado.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: user.removeMoney,
        example: "remover-dinheiro @RP-Manager 10000"
    },
    {
        syntax: ["adicionar-dinheiro", "ad"],
        use: "adicionar-dinheiro [usuário] [quantidade]",
        description: "Adiciona dinheiro para agência do usuário selecionado.",
        serverLevelPermission: 1,
        userLevelPermission: 1,
        execute: user.addMoney,
        example: "adicionar-dinheiro @RP-Manager 10000"
    },
    {
        syntax: ["pagar"],
        use: "pagar [usuário] [quantidade]",
        description: "Transfere dinheiro para agência do usuário selecionado.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.transferMoney,
        example: "pagar @RP-Manager 25000"
    },
    {
        syntax: ["top"],
        use: "top (página) (entidade) (critério)",
        description: "Mostra as dez melhores entidades do índice pelo critério escolhido.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: guild.top,
        example: "top 2"
    },
    {
        syntax: ["ajuda", "help", "?"],
        use: "ajuda",
        description: "Mostra informações sobre o bot.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: bot.help,
        example: "ajuda adicionar-missão"
    },
    {
        syntax: ["registrar-fazenda", "registrar-fazenda", "rf", "definir-fazenda", "df"],
        use: "registrar-fazenda [nome]",
        description: "Registra uma fazenda para o usuário.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.setFarm,
        example: "registrar-agência Fazendo Nada"
    },
    {
        syntax: ["loja"],
        use: "loja (atributo)",
        description: "Mostra itens na loja disponíveis para o usuário.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.shop,
        example: "loja fazenda"
    },
    {
        syntax: ["comprar"],
        use: "comprar [item] (quantidade)",
        description: "Compra itens da loja.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.buy,
        example: "comprar milho"
    },
    {
        syntax: ["fazenda", "f"],
        use: "fazenda (usuário)",
        description: "Mostra informações sobre a fazenda do usuário.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.showFarm,
        example: "fazenda @RP-Manager"
    },
    {
        syntax: ["plantas"],
        use: "plantas (usuário)",
        description: "Mostra plantas da fazenda do usuário.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.showPlants,
        example: "plantas @RP-Manager"
    },
    {
        syntax: ["colher"],
        use: "colher",
        description: "Colhe plantas da fazenda do usuário.",
        serverLevelPermission: 1,
        userLevelPermission: 0,
        execute: user.harvest,
    }
]