/* ==========================================================================
   VINGADORES: DOUTOR DESTINO — Guia de fã
   Base de dados do site. Pesquisa fechada em 12/10/2026.
   Status usados:
     oficial  -> mostrado em trailer, cena ou material oficial da Marvel/Disney
     indicio  -> leitura de imagens oficiais (pode estar errada)
     rumor    -> vazamento/relato sem confirmação
     hq       -> precedente nos quadrinhos
     teoria   -> especulação de fãs/canais
   ========================================================================== */
window.DOOM = {
  updated: "12 de outubro de 2026",

  /* ---------------------------------------------------------------- datas */
  releases: [
    { id: "br", label: "Brasil", date: "2026-12-17T00:00:00-03:00", human: "17 de dezembro de 2026", flag: "BR" },
    { id: "us", label: "EUA", date: "2026-12-18T00:00:00-05:00", human: "18 de dezembro de 2026", flag: "EUA" },
    { id: "uk", label: "Reino Unido", date: "2026-12-16T00:00:00+00:00", human: "16 de dezembro de 2026", flag: "RU" }
  ],
  announced: "2024-07-27T19:00:00-07:00", // SDCC 2024: Downey revelado como Destino

  facts: [
    { k: "Direção", v: "Anthony e Joe Russo" },
    { k: "Roteiro", v: "Michael Waldron, Stephen McFeely, Chris McKenna e Erik Sommers" },
    { k: "Música", v: "Alan Silvestri (Guerra Infinita, Ultimato)" },
    { k: "Filmagens", v: "28/04 a 19/09/2025 — Pinewood (Inglaterra) e Bahrein. Título de trabalho: “Apple Pie 1”" },
    { k: "Lugar no MCU", v: "39º filme • Fase 6 • penúltimo capítulo da Saga do Multiverso" },
    { k: "Formatos", v: "Selo Disney “Infinity Vision” (salas premium). Nos EUA, sem IMAX nas 3 primeiras semanas por causa de Duna: Parte Três" },
    { k: "Pré-venda BR", v: "Aberta desde 28/09/2026 para salas Infinity Vision" },
    { k: "Sequência", v: "Vingadores: Guerras Secretas — 17/12/2027" }
  ],

  universes: [
    { id: "616", name: "Terra-616", kicker: "O “nosso” MCU", who: "Vingadores, Novos Vingadores, Wakanda e Talokan", color: "#3d7bff",
      faces: ["hemsworth", "evans", "pugh", "wright", "mackie"],
      note: "O universo de todos os filmes desde Homem de Ferro (2008). Doutor Destino se passa 14 meses depois de Thunderbolts*: os Vingadores estão rachados e Sam Wilson tenta reerguê-los." },
    { id: "828", name: "Terra-828", kicker: "Retrofuturo dos anos 60", who: "Quarteto Fantástico", color: "#ff8a3d",
      faces: ["pascal", "kirby", "quinn", "mossbachrach"],
      note: "O mundo de Primeiros Passos (2025), onde o Quarteto é a única equipe de heróis. O número homenageia o aniversário de Jack Kirby (28/08), cocriador de Destino. Foi aqui que Victor apareceu diante do bebê Franklin." },
    { id: "10005", name: "Terra-10005", kicker: "Os X-Men da Fox", who: "Professor X, Magneto e os mutantes originais", color: "#ffc629",
      faces: ["stewart", "mckellen", "marsden", "romijn", "grammer"],
      note: "O universo dos filmes X-Men (2000–2014), batizado assim em Deadpool & Wolverine. Na cena nova de Ultimato Encore, a TVA vê esta Terra colidir com outra — e a escola de Xavier aparece destruída no trailer." }
  ],

  glossary: [
    { t: "Multiverso", d: "Infinitas realidades paralelas. Desde Loki e Sem Volta Para Casa, o MCU mostra que elas estão se esbarrando." },
    { t: "Incursão", d: "Quando dois universos colidem num mesmo ponto: se nada for feito, os dois são destruídos. Foi explicado pelos Illuminati em Doutor Estranho no Multiverso da Loucura. No filme, o céu vermelho é o sinal." },
    { t: "TVA", d: "Autoridade de Variância Temporal. Na cena nova de Ultimato Encore, Mobius, O.B. e Casey assistem às Terras 10005 e 1127 colidirem: “O multiverso está colapsando.”" },
    { t: "Latvéria", d: "Pequeno reino fictício do Leste Europeu governado por Destino. Capital: Doomstadt (Cidade do Destino). Imunidade diplomática total." },
    { t: "Doombots", d: "Robôs com a aparência de Destino. Nos quadrinhos servem de dublês; arte promocional de outubro/2026 mostra um exército deles diante do trono." },
    { t: "Mundo Bélico", d: "Battleworld. Em Guerras Secretas (2015), Destino junta os fragmentos do multiverso destruído num único planeta e se torna seu Deus Imperador." },
    { t: "Novos Vingadores", d: "Os ex-Thunderbolts* (Bucky, Yelena, Alexei, Walker, Ava e Bob), rebatizados no fim de Thunderbolts* (2025)." },
    { t: "Infinity Vision", d: "Certificação criada pela Disney para salas premium (Dolby, ScreenX, 4DX etc.). Segundo a Disney, 70% da pré-venda foi para essas sessões." }
  ],

  timeline: [
    { d: "jul/2024", t: "O anúncio", x: "Na San Diego Comic-Con, Robert Downey Jr. tira a máscara: ele é o novo Doutor Destino. O filme deixa de ser Dinastia Kang e vira Doomsday, com os Russo de volta." },
    { d: "26/mar/2025", t: "A live das cadeiras", x: "Quase 5h30 de transmissão revelando o elenco cadeira por cadeira. Virou a live promocional mais vista da história." },
    { d: "abr–set/2025", t: "Filmagens", x: "Pinewood, Bahrein e Windsor. Em maio o filme é adiado de 1º de maio para dezembro de 2026." },
    { d: "dez/2025", t: "Quatro teasers", x: "Exibidos antes de Avatar: Fogo e Cinzas, um por semana. O primeiro confirma: “Steve Rogers vai voltar”." },
    { d: "abr/2026", t: "CinemaCon", x: "O primeiro trailer completo é exibido para exibidores. Destino: “Algo está chegando”." },
    { d: "jul/2026", t: "Trailer oficial", x: "Lançado na internet; recepção dividida. Pré-venda premium bate US$ 16,5 mi em 24h nos EUA." },
    { d: "jul–ago/2026", t: "Special Look", x: "Mostrado na SDCC e na D23. Destino derruba Thor e ergue Sentinelas: “O inferno me obedece.”" },
    { d: "set/2026", t: "Ultimato Encore", x: "Relançamento com 4 cenas novas: Loki na porta de Steve, a TVA vendo o multiverso ruir, Destino “coletando” Banner e forjando a máscara." },
    { d: "out/2026", t: "O laboratório", x: "Na NYCC, a Marvel monta o laboratório de Destino com relíquias do MCU e três máscaras diferentes." }
  ],

  /* ---------------------------------------------------- quem é Destino */
  chapters: [
    { n: "01", t: "A origem", y: "Fantastic Four Annual #2 (1964)", img: "assets/img/covers/ff-annual-2.webp", credit: "Capa original: Marvel Comics", recap: 180,
      x: "Victor nasceu numa comunidade romani da Latvéria, um pequeno reino do Leste Europeu. A mãe, Cynthia, era feiticeira e morreu por causa de um pacto com Mefisto; o pai, o curandeiro Werner, morreu na neve tentando salvá-lo de um barão cruel. O menino herdou os livros de magia da mãe — e um rancor do tamanho do mundo." },
    { n: "02", t: "O gênio e o rival", y: "Os Livros de Destino (2005)", img: "assets/img/covers/livros-de-destino.webp", credit: "Capa: Panini Comics", recap: 180,
      x: "Uma bolsa leva Victor à Universidade Empire State, nos EUA, onde conhece Ben Grimm e Reed Richards. Ele constrói uma máquina para falar com a mãe no além; Reed aponta um erro nos cálculos e Victor ignora. A explosão marca seu rosto — e ele nunca perdoa Reed." },
    { n: "03", t: "A máscara", y: "Tibete", img: "assets/img/covers/livros-de-destino-4.webp", credit: "Capa original: Os Livros de Destino #4 · Marvel Comics", recap: 180,
      x: "Expulso, Victor vaga até o Tibete, onde monges o ajudam a forjar uma armadura. Impaciente, veste a máscara ainda em brasa e queima o rosto de vez. Ali nasce o Doutor Destino — que passa a falar de si mesmo na terceira pessoa." },
    { n: "04", t: "O rei da Latvéria", y: "Fantastic Four #5 (1962)", img: "assets/img/covers/ff-5.webp", credit: "Capa original: Marvel Comics", recap: 180,
      x: "Destino volta para casa, derruba o regime e coroa a si mesmo. Estreia nos quadrinhos em 1962, criado por Stan Lee e Jack Kirby, prendendo Sue Storm e mandando o Quarteto ao passado. Governa com mão de ferro — mas, na Latvéria dele, ninguém passa fome." },
    { n: "05", t: "A primeira aliança", y: "Fantastic Four #6 (1962)", img: "assets/img/covers/ff-6.webp", credit: "Capa original: Marvel Comics", recap: 803,
      x: "Logo na sexta edição, Destino se une a Namor, o rei submarino, na primeira aliança de vilões da Marvel. Os dois reis se respeitam e se traem várias vezes — por isso tanta gente desconfia do Namor de Doomsday." },
    { n: "06", t: "Wakanda", y: "Doomwar (2010)", img: "assets/img/covers/doomwar.webp", credit: "Capa original: Marvel Comics", recap: 1152,
      x: "Destino invade Wakanda para tomar o vibranium e fundi-lo à magia. Quem lidera a resistência é Shuri, então Pantera Negra — a mesma Shuri que estará no filme." },
    { n: "07", t: "O inferno me obedece", y: "Triunfo e Tormento (1989)", img: "assets/img/covers/triunfo-e-tormento.webp", credit: "Capa: Panini Comics", recap: 1675,
      x: "Todo ano Destino enfrenta Mefisto pela alma da mãe. Em Triunfo e Tormento, ele vence o torneio de Mago Supremo e cobra a ajuda do Doutor Estranho para descer ao inferno — e liberta Cynthia. É daí que vem a fala do Special Look." },
    { n: "08", t: "O Homem de Ferro", y: "Doomquest (1981) · Infame (2016)", img: "assets/img/covers/doomquest.webp", credit: "Capa original: Marvel Comics", recap: 2077,
      x: "Destino e Tony Stark já se enfrentaram até na Camelot do Rei Arthur. Em 2016, com Tony em coma, Destino vestiu a armadura do Homem de Ferro tentando ser herói. Dá para entender por que escalar Robert Downey Jr. foi um golpe de mestre." },
    { n: "09", t: "Valéria", y: "Impensável (2003)", img: "assets/img/covers/impensavel.webp", credit: "Capa original: Marvel Comics", recap: 3184,
      x: "Destino ajudou Sue no parto da filha e, como pagamento, escolheu o nome: Valéria, como seu primeiro amor — a mesma Valéria que ele sacrifica para ganhar poder em Impensável. Para os Richards, Destino é padrinho e pesadelo ao mesmo tempo." },
    { n: "10", t: "O Deus Imperador", y: "Guerras Secretas (1984 e 2015)", img: "assets/img/covers/guerras-secretas-2015.webp", credit: "Capa original: Marvel Comics", recap: 3544,
      x: "Em 1984 ele rouba o poder do Beyonder. Em 2015, quando as Incursões destroem o multiverso, Destino toma o poder dos Beyonders, junta os destroços no Mundo Bélico e reina como Deus — casado com Sue, pai de Franklin e Valéria. No fim, admite a Reed que ele teria feito melhor." },
    { n: "11", t: "Contra todos", y: "Caçada Sangrenta (2024) · Um Mundo Sob Destino (2025)", img: "assets/img/covers/um-mundo-sob-destino.webp", credit: "Capa: Panini Comics", recap: 4167,
      x: "Depois de salvar a Terra dos vampiros, Destino vira Mago Supremo e, em seguida, Imperador do planeta. Ele acaba com guerras e fome — e os heróis precisam derrubar um tirano que está melhorando o mundo." },
    { n: "12", t: "No cinema", y: "2025 → 2026", img: "assets/img/doom/doom-tapestry.webp", credit: "Pôster oficial (jul/2026) © Marvel Studios", play: "ntOtyJwxcsM", playT: "Ver o Special Look",
      x: "Primeiros Passos termina com Destino diante do bebê Franklin. No Ultimato Encore, ele forja a máscara e “coleta” Bruce Banner. No Special Look, Sue resume: “Victor era o cara mais inteligente de qualquer sala… ele já foi gentil, antes de tirarem dele tudo o que amava.”" }
  ],

  recap: {
    id: "ibczMiqvyBA", dur: "1:20:51",
    t: "Marvel Recap: a história completa do Doutor Destino", h: "A vida inteira de Victor, em 1h20",
    note: "O Recap oficial, dublado pela Marvel Brasil. O título no YouTube diz “Parte 1/3”, mas este vídeo já é o Recap completo: as três partes (a origem, os inimigos e o Deus Imperador) estão juntas aqui. Escolha um capítulo e o vídeo começa direto nele.",
    chapters: [
      ["A origem de Destino", 180], ["Destino contra Namor", 803], ["Destino contra o Pantera Negra", 1152], ["Destino contra Mefisto", 1675],
      ["Destino contra o Homem de Ferro", 2077], ["Destino contra os X-Men", 2414], ["Destino contra os Vingadores", 2738],
      ["Destino contra Valéria Richards", 3184], ["Destino contra os Beyonders", 3544], ["Destino contra todos", 4167]
    ]
  },

  doomFile: [
    { k: "Nome", v: "Victor Von Doom" },
    { k: "Criadores", v: "Stan Lee e Jack Kirby" },
    { k: "Estreia", v: "Fantastic Four #5 (1962)" },
    { k: "País", v: "Latvéria — capital Doomstadt" },
    { k: "Armas", v: "Gênio científico, armadura, feitiçaria, Doombots, imunidade diplomática" },
    { k: "Fraqueza", v: "O orgulho. E Reed Richards." },
    { k: "No cinema", v: "Julian McMahon (2005/2007), Toby Kebbell (2015), Robert Downey Jr. (2026)" }
  ],

  /* ------------------------------------------------- o lado de Destino */
  allies: [
    {
      id: "bruxas", name: "As Bruxas da Latvéria", conf: 95,
      tags: ["oficial", "hq"],
      seen: "Aparecem ajoelhadas diante de Destino no trailer ScreenX (29/09/2026) e na vitrine da NYCC, que o chama de “Rei da Latvéria”.",
      how: "São súditas do reino — e o elo com a herança da mãe de Victor, a feiticeira romani Cynthia Von Doom. Destino transformou a magia que matou sua mãe em arma de Estado.",
      comics: "Victor aprendeu feitiçaria com bruxas e místicos e já se aliou a Morgana Le Fay (Doomquest, 1981)."
    },
    {
      id: "sentinelas", name: "Sentinelas", conf: 100,
      tags: ["oficial", "hq"],
      seen: "O Special Look termina com Destino tocando o chão e erguendo Sentinelas gigantes. Uma Sentinela também foi exibida na SDCC 2026.",
      how: "Não são aliados: são máquinas. Destino reativa e reprograma os caçadores de mutantes do mundo dos X-Men e os volta contra eles — uma crueldade bem ao estilo dele.",
      comics: "As Sentinelas vêm de X-Men #14 (1965) e do clássico Dias de um Futuro Esquecido (1981)."
    },
    {
      id: "doombots", name: "Doombots", conf: 85,
      tags: ["oficial", "hq"],
      seen: "Arte promocional de outubro/2026 mostra um exército de Doombots verdes enfileirados diante do trono em Doomstadt.",
      how: "Fabricados por ele. Nos quadrinhos são dublês tão perfeitos que nem os heróis sabem se venceram o Destino verdadeiro — no filme, ao que tudo indica, são tropa de choque.",
      comics: "Presentes desde os anos 1960. Ninguém sabe ao certo quantas “vitórias” sobre Destino foram contra robôs."
    },
    {
      id: "hulk", name: "Hulk / Bruce Banner", conf: 60,
      tags: ["oficial", "teoria"],
      seen: "Cena nova de Ultimato Encore: Banner, isolado após Homem-Aranha: Um Novo Dia, ouve Destino dizer que veio “coletá-lo”. O Hulk ruge, some — e ficam runas verdes no chão.",
      how: "Ninguém sabe se Banner vira aliado, prisioneiro ou bateria. Os Russo só disseram que ele está “envolvido na história que gira em torno de Destino”. Antes, Mark Ruffalo havia dito à Empire que o Hulk não estaria no filme.",
      comics: "Destino já manipulou e aprisionou o Hulk várias vezes — força bruta é exatamente o que falta ao seu arsenal."
    },
    {
      id: "namor", name: "Namor e Talokan", conf: 35,
      tags: ["indicio", "rumor", "hq"],
      seen: "No trailer, Shuri e M'Baku encaram Namor em Talokan; no Special Look ele aparece atrás dos wakandanos. A aliança está em aberto.",
      how: "Se acontecer, será por pragmatismo: Namor faz qualquer coisa para salvar o próprio povo — inclusive destruir outros mundos. Um vazamento não confirmado o coloca como tenente de Destino.",
      comics: "Fantastic Four #6 (1962) traz a primeira aliança de vilões da Marvel: Destino e Namor. Em Novos Vingadores (2013), Namor monta a Cabala para destruir Terras inteiras durante as Incursões."
    },
    {
      id: "estranho", name: "Doutor Estranho", conf: 30,
      tags: ["rumor", "hq"],
      seen: "Benedict Cumberbatch é dado como presente por vários veículos, sem confirmação oficial.",
      how: "Em Guerras Secretas (2015), Estranho vira o “xerife” do Mundo Bélico, servindo Destino a contragosto para manter os sobreviventes vivos — até ser morto por ele.",
      comics: "Doutor Estranho & Doutor Destino: Triunfo e Tormento (1989) mostra a parceria mais famosa dos dois."
    },
    {
      id: "thors", name: "A Tropa Thor", conf: 20,
      tags: ["rumor", "hq"],
      seen: "Nada oficial. Aparece em listas de vazamentos que circularam em 2026.",
      how: "Seria uma polícia de variantes de Thor a serviço de Destino. Detalhe: no teaser, o Thor do MCU reza a Odin por força para uma última luta.",
      comics: "Em Guerras Secretas (2015), os Thors são a força policial do Deus Imperador Destino."
    },
    {
      id: "franklin", name: "Franklin Richards", conf: 70,
      tags: ["oficial", "teoria", "hq"],
      seen: "Na cena pós-créditos de Quarteto Fantástico: Primeiros Passos, Destino está diante do bebê. No Special Look, Johnny segura Franklin.",
      how: "Franklin não é aliado — é alvo. Nos quadrinhos ele cria universos inteiros. A teoria mais forte: Destino quer esse poder para reconstruir o multiverso do seu jeito.",
      comics: "Em várias fases (principalmente com Hickman), Destino protege, manipula e cobiça os filhos de Reed e Sue."
    },
    {
      id: "molecula", name: "Homem-Molécula", conf: 10,
      tags: ["hq", "teoria"],
      seen: "Nenhum anúncio para o filme.",
      how: "É a peça que transforma Destino em Deus em 2015: Owen Reece canaliza o poder dos Beyonders. Muita gente aposta que ele ou algo equivalente aparece em Guerras Secretas (2027).",
      comics: "Guerras Secretas (1984) e (2015)."
    }
  ],

  rumors: [
    { c: "A batalha final acontece na Latvéria, com o exército de Doombots", src: "Relatos sobre a arte promocional (out/2026)", cred: 65 },
    { c: "Doutor Estranho trabalha para Destino e ajuda a criar o Mundo Bélico", src: "Vazamento “kitchen sink” no X (set/2026)", cred: 30 },
    { c: "Namor e uma Tropa Thor seriam tenentes de Destino", src: "Mesmo vazamento (set/2026)", cred: 25 },
    { c: "Bucky Barnes morre pelas mãos de Destino", src: "Mesmo vazamento (set/2026)", cred: 20 },
    { c: "Destino usa três trajes, um para cada ato", src: "Reportagem após a vitrine da NYCC com 3 máscaras (out/2026)", cred: 55 },
    { c: "Tom Holland aparece como Homem-Aranha", src: "Relatos de imprensa; ele não está na lista oficial", cred: 30 },
    { c: "Deadpool e Wolverine estão no filme", src: "Ryan Reynolds e Hugh Jackman fizeram ações promocionais", cred: 40 },
    { c: "O filme tem cerca de 3 horas", src: "Rumor de bastidores; sem duração oficial", cred: 35 }
  ],

  /* ------------------------------------------------------ contra Destino */
  teams: [
    { id: "vingadores", name: "Vingadores", uni: "616", color: "#3d7bff",
      desc: "Sam Wilson tenta reerguer a equipe. Thor lidera o discurso de guerra; Steve Rogers volta do passado." },
    { id: "novos", name: "Novos Vingadores", uni: "616", color: "#d7dde0",
      desc: "Os ex-Thunderbolts*. Kevin Feige disse que o filme é “ancorado” em Yelena Belova." },
    { id: "wakanda", name: "Wakanda & Talokan", uni: "616", color: "#a072ff",
      desc: "Shuri, agora plenamente Pantera Negra, e M'Baku, rei de Wakanda — diante de um Namor de lealdade incerta." },
    { id: "quarteto", name: "Quarteto Fantástico", uni: "828", color: "#4fc3ff",
      desc: "Chegam de outro universo e são os únicos que conheciam Victor antes da máscara." },
    { id: "xmen", name: "X-Men", uni: "10005", color: "#ffc629",
      desc: "Os mutantes dos filmes da Fox, com o elenco original de volta — e uma escola destruída." },
    { id: "outros", name: "Linha do tempo & TVA", uni: "616", color: "#ff8a1f",
      desc: "Quem segura os fios do multiverso — e quem bateu à porta de Steve Rogers." }
  ],

  cast: [
    { id: "hemsworth", team: "vingadores", name: "Thor", actor: "Chris Hemsworth", status: "confirmado",
      last: "Thor: Amor e Trovão (2022)", role: "Faz o discurso que une os três universos e é o primeiro a enfrentar Destino — e a cair diante dele (trailer e Special Look).",
      why: "Volta ao modo guerreiro de Guerra Infinita. Reza a Odin para proteger a filha adotiva, Amor — e é o primeiro a cair diante de Destino." },
    { id: "evans", team: "vingadores", name: "Steve Rogers", actor: "Chris Evans", status: "confirmado",
      last: "Vingadores: Ultimato (2019)", role: "O grande retorno: volta do passado para a guerra, ergue o Mjölnir e pode assumir o manto de Nômade. Para Destino, vive uma “vida roubada”.",
      why: "Aparece com um bebê no colo, recebe Loki em casa (Encore) e ergue o Mjölnir: “E aí, parceiro?”. Evans e Mackie indicaram que ele pode virar Nômade." },
    { id: "mackie", team: "vingadores", name: "Sam Wilson / Capitão América", actor: "Anthony Mackie", status: "confirmado",
      last: "Capitão América: Admirável Mundo Novo (2025)", role: "O Capitão América atual: recebe Thor e o Quarteto na torre e comanda a resistência dos Vingadores.",
      why: "O Capitão atual. Recebe Thor e o Quarteto na torre dos Vingadores." },
    { id: "rudd", team: "vingadores", name: "Scott Lang / Homem-Formiga", actor: "Paul Rudd", status: "confirmado",
      last: "Homem-Formiga e a Vespa: Quantumania (2023)", role: "Um dos poucos Vingadores veteranos ainda na ativa; está na reunião da torre e no reencontro com Cassie.",
      why: "Está na reunião da torre e num reencontro com Cassie no apartamento de Kate Bishop." },
    { id: "newton", team: "vingadores", name: "Cassie Lang", actor: "Kathryn Newton", status: "confirmado",
      last: "Quantumania (2023)", role: "Aparece com o pai no apartamento de Kate Bishop (trailer ScreenX) — a família no meio do fim do mundo.",
      why: "Confirmou a volta num vídeo do set. Abraça o pai no trailer." },
    { id: "liu", team: "vingadores", name: "Shang-Chi", actor: "Simu Liu", status: "confirmado",
      last: "Shang-Chi e a Lenda dos Dez Anéis (2021)", role: "Mais experiente, à frente dos Dez Anéis; luta contra Gambit na escola dos X-Men (trailer).",
      why: "Mais velho e seguro dos Dez Anéis. Troca golpes com Gambit na escola dos X-Men." },
    { id: "ramirez", team: "vingadores", name: "Joaquin Torres / Falcão", actor: "Danny Ramirez", status: "confirmado",
      last: "Admirável Mundo Novo (2025)", role: "O Falcão de Sam; aparece numa nave com Shuri e Fantasma, em missão.",
      why: "O novo Falcão. Aparece numa nave com Shuri e Fantasma." },
    { id: "stan", team: "novos", name: "Bucky Barnes / Soldado Invernal", actor: "Sebastian Stan", status: "confirmado",
      last: "Thunderbolts* (2025)", role: "Líder de fato dos Novos Vingadores — e melhor amigo de um Steve Rogers que voltou do passado.",
      why: "Líder de fato dos Novos Vingadores. Melhor amigo de um Steve Rogers que voltou do passado." },
    { id: "pugh", team: "novos", name: "Yelena Belova / Viúva Negra", actor: "Florence Pugh", status: "confirmado",
      last: "Thunderbolts* (2025)", role: "A âncora emocional do filme, segundo Kevin Feige. Enfrenta Mística, que copia o rosto dela.",
      why: "A âncora emocional do filme, segundo Feige. Enfrenta Mística — que copia o rosto dela." },
    { id: "harbour", team: "novos", name: "Alexei / Guardião Vermelho", actor: "David Harbour", status: "confirmado",
      last: "Thunderbolts* (2025)", role: "O pai adotivo de Yelena; Harbour antecipou que a relação dos dois muda depois de Doomsday.",
      why: "Harbour adiantou que a relação dele com Yelena muda depois de Doomsday." },
    { id: "wrussell", team: "novos", name: "John Walker / Agente Americano", actor: "Wyatt Russell", status: "confirmado",
      last: "Thunderbolts* (2025)", role: "O supersoldado instável dos Novos Vingadores, agora lutando ao lado do Capitão que um dia tentou substituir.",
      why: "O ex-Capitão América, supersoldado e cabeça-quente da equipe." },
    { id: "johnkamen", team: "novos", name: "Ava Starr / Fantasma", actor: "Hannah John-Kamen", status: "confirmado",
      last: "Thunderbolts* (2025)", role: "A especialista em infiltração: atravessa paredes e está na missão com Shuri e o Falcão.",
      why: "Atravessa paredes — útil para invadir o castelo de um rei paranoico." },
    { id: "pullman", team: "novos", name: "Bob / Sentinela", actor: "Lewis Pullman", status: "confirmado",
      last: "Thunderbolts* (2025)", role: "Talvez o herói mais poderoso do MCU. Se o Vácuo voltar, pode ser trunfo — ou ameaça.",
      why: "Talvez o herói mais poderoso do MCU — com o Vácuo dentro dele. Não confundir com as Sentinelas, os robôs." },
    { id: "wright", team: "wakanda", name: "Shuri / Pantera Negra", actor: "Letitia Wright", status: "confirmado",
      last: "Pantera Negra: Wakanda para Sempre (2022)", role: "A Pantera Negra agora lidera de fato. Nos quadrinhos, Destino já invadiu Wakanda; no trailer, ela encara Namor em Talokan.",
      why: "Agora líder de fato. Nos quadrinhos, Destino já invadiu Wakanda para roubar vibranium (Doomwar, 2010)." },
    { id: "duke", team: "wakanda", name: "M'Baku", actor: "Winston Duke", status: "confirmado",
      last: "Wakanda para Sempre (2022)", role: "Rei de Wakanda; sela uma amizade com Ben Grimm no trailer — e negocia com Talokan.",
      why: "Rei de Wakanda. Aperta a mão de Ben Grimm no trailer — a cena mais “bonita amizade” do filme." },
    { id: "huerta", team: "wakanda", name: "Namor", actor: "Tenoch Huerta Mejía", status: "confirmado",
      last: "Wakanda para Sempre (2022)", role: "A grande incógnita: aliado ou ameaça? Nos quadrinhos, foi o primeiro parceiro de Destino.",
      why: "Rei de Talokan. Nos quadrinhos foi o primeiro aliado de Destino — e destruiu mundos durante as Incursões." },
    { id: "cadena", team: "wakanda", name: "Namora", actor: "Mabel Cadena", status: "confirmado",
      last: "Wakanda para Sempre (2022)", role: "Braço direito de Namor — sinal de que Talokan entra nessa guerra com força total.",
      why: "Prima e braço direito de Namor. Attuma (Alex Livinalli) também volta." },
    { id: "pascal", team: "quarteto", name: "Reed Richards / Sr. Fantástico", actor: "Pedro Pascal", status: "confirmado",
      last: "Quarteto Fantástico: Primeiros Passos (2025)", role: "O rival eterno, o único que entende como Destino pensa: “Victor, você fez isso?”",
      why: "O rival eterno. No meio da destruição, pergunta: “Victor, você fez isso?”" },
    { id: "kirby", team: "quarteto", name: "Sue Storm / Mulher Invisível", actor: "Vanessa Kirby", status: "confirmado",
      last: "Primeiros Passos (2025)", role: "Conheceu Victor antes da máscara e narra quem ele foi. É mãe de Franklin, o bebê que Destino quer.",
      why: "A narradora do Special Look. Conheceu Victor “quando ele ainda era gentil”." },
    { id: "quinn", team: "quarteto", name: "Johnny Storm / Tocha Humana", actor: "Joseph Quinn", status: "confirmado",
      last: "Primeiros Passos (2025)", role: "Aparece protegendo o sobrinho Franklin — o centro da disputa com Destino.",
      why: "Aparece segurando o sobrinho, Franklin — o bebê que Destino quer." },
    { id: "mossbachrach", team: "quarteto", name: "Ben Grimm / O Coisa", actor: "Ebon Moss-Bachrach", status: "confirmado",
      last: "Primeiros Passos (2025)", role: "Colega de faculdade de Victor nos quadrinhos; no filme, faz amizade com M'Baku.",
      why: "Colega de faculdade de Victor nos quadrinhos. Faz amizade com M'Baku." },
    { id: "stewart", team: "xmen", name: "Charles Xavier / Professor X", actor: "Patrick Stewart", status: "confirmado",
      last: "X-Men: Dias de um Futuro Esquecido (2014)", role: "Abre o trailer sentindo a Incursão chegar à escola. O universo dos X-Men pode ser o que está “sobrando”.",
      why: "Abre o trailer protegendo os olhos de uma luz no céu — a Incursão chegando à escola." },
    { id: "mckellen", team: "xmen", name: "Erik Lehnsherr / Magneto", actor: "Ian McKellen", status: "confirmado",
      last: "Dias de um Futuro Esquecido (2014)", role: "Aparece ferido e de mãos dadas com Xavier: os velhos rivais do mesmo lado — por enquanto.",
      why: "Aparece com o braço na tipoia e de mãos dadas com Xavier. O mestre do metal contra o homem de ferro." },
    { id: "marsden", team: "xmen", name: "Scott Summers / Ciclope", actor: "James Marsden", status: "confirmado",
      last: "Dias de um Futuro Esquecido (2014)", role: "Finalmente com destaque: lidera os X-Men nas ruínas da escola.",
      why: "Finalmente com destaque: vasculha as ruínas da escola e explode de fúria." },
    { id: "romijn", team: "xmen", name: "Mística", actor: "Rebecca Romijn", status: "confirmado",
      last: "X-Men: O Confronto Final (2006)", role: "A infiltrada: vira uma cópia perfeita de Yelena em pleno combate.",
      why: "Vira uma cópia perfeita de Yelena no meio da briga." },
    { id: "cumming", team: "xmen", name: "Kurt Wagner / Noturno", actor: "Alan Cumming", status: "confirmado",
      last: "X-Men 2 (2003)", role: "Teletransporte vale ouro numa guerra entre universos. Volta 23 anos depois de X-Men 2.",
      why: "A maquiagem caiu de 5h para 1h30. Cumming disse que voltar foi “terapêutico”." },
    { id: "grammer", team: "xmen", name: "Hank McCoy / Fera", actor: "Kelsey Grammer", status: "confirmado",
      last: "As Marvels (2023, pós-créditos)", role: "O cientista dos X-Men — e o elo com o MCU desde As Marvels.",
      why: "O Fera da Fox já tinha dado as caras no MCU — agora volta de vez." },
    { id: "tatum", team: "xmen", name: "Remy LeBeau / Gambit", actor: "Channing Tatum", status: "confirmado",
      last: "Deadpool & Wolverine (2024)", role: "Ganha enfim seu momento: enfrenta Shang-Chi e promete menos piada e mais drama.",
      why: "Promete menos sotaque cajun e mais drama. Luta com Shang-Chi." },
    { id: "hiddleston", team: "outros", name: "Loki", actor: "Tom Hiddleston", status: "confirmado",
      last: "Loki, 2ª temporada (2023)", role: "O guardião do multiverso. Bate à porta de Steve e Peggy no Encore — talvez seja quem recruta Steve.",
      why: "O Deus das Histórias sustenta o multiverso no fim dos tempos. Bate na porta de Steve e Peggy (Encore) e gira um crachá da TVA." },
    { id: "atwell", team: "outros", name: "Peggy Carter", actor: "Hayley Atwell", status: "confirmado",
      last: "Vingadores: Ultimato (2019)", role: "A vida dela com Steve pode ser uma das “vidas roubadas” que Destino veio cobrar.",
      why: "Esteve no palco da D23. A vida dela com Steve é uma linha do tempo “roubada”?" },
    { id: "ruffalo", team: "outros", name: "Bruce Banner / Hulk", actor: "Mark Ruffalo", status: "esperado",
      last: "Homem-Aranha: Um Novo Dia (2026)", role: "“Coletado” por Destino no Encore. Aliado forçado, prisioneiro ou bateria? Ninguém sabe.",
      why: "“Coletado” por Destino no Encore. Os Russo não confirmam a presença, mas dizem que ele está envolvido na trama." }
  ],

  reported: [
    "Benedict Cumberbatch (Doutor Estranho)",
    "Tom Holland (Homem-Aranha)",
    "Jeremy Renner (Gavião Arqueiro)",
    "Ryan Reynolds e Hugh Jackman (Deadpool e Wolverine)",
    "Owen Wilson, Ke Huy Quan e a TVA (vistos no Encore)"
  ],

  /* ---------------------------------------------------- roadmap de HQs */
  routes: [
    { id: 1, t: "A origem", s: "Quem é Victor antes da máscara" },
    { id: 2, t: "O vilão mais complexo da Marvel", s: "Magia, honra e Mefisto" },
    { id: 3, t: "O fim do multiverso", s: "As Incursões de Hickman — a base do filme" },
    { id: 4, t: "Destino hoje", s: "De Homem de Ferro a Imperador da Terra" }
  ],

  comics: [
    { route: 1, tier: "essencial", title: "Prisioneiros do Doutor Destino", cover: ["ff-5"], orig: "Fantastic Four #5", year: "1962",
      by: "Stan Lee & Jack Kirby",
      why: "A primeira aparição. Destino sequestra Sue e manda o Quarteto ao passado para roubar o tesouro do Barba Negra. Kirby desenha a armadura que você verá no cinema 64 anos depois.",
      br: "Republicada em coletâneas clássicas do Quarteto Fantástico. Também está no Marvel Unlimited (inglês).", ok: false },
    { route: 1, tier: "recomendado", title: "A origem do Doutor Destino", cover: ["ff-annual-2"], orig: "Fantastic Four Annual #2", year: "1964",
      by: "Stan Lee & Jack Kirby",
      why: "Latvéria, a mãe feiticeira, o pai na neve, a explosão, os monges, a máscara em brasa. Tudo o que o Special Look sugere quando Sue diz que tiraram dele tudo o que amava.",
      br: "Em coletâneas clássicas do Quarteto; procure por edições Marvel Vintage/Omnibus.", ok: false },
    { route: 1, tier: "essencial", title: "Os Livros de Destino", cover: ["livros-de-destino"], orig: "Books of Doom #1–6", year: "2005–06",
      by: "Ed Brubaker & Pablo Raimondi",
      why: "A melhor porta de entrada. O próprio Destino conta sua vida, da infância ao trono — com a rivalidade com Reed na faculdade que o filme cita.",
      br: "Os Livros de Destino (Marvel de Bolso) — Panini, nov/2026, 144 págs., R$ 39,90.", ok: true },
    { route: 2, tier: "bonus", title: "Destino e Namor: a primeira aliança", cover: ["ff-6"], orig: "Fantastic Four #6", year: "1962",
      by: "Stan Lee & Jack Kirby",
      why: "A primeira vez que dois vilões se unem na Marvel — exatamente a aliança que fãs especulam para o filme.",
      br: "Em coletâneas clássicas do Quarteto Fantástico.", ok: false },
    { route: 2, tier: "recomendado", title: "Doomquest & Legado de Destino", cover: ["legado-de-destino", "doomquest"], orig: "Iron Man #149–150 · Iron Man: Legacy of Doom", year: "1981 · 2008",
      by: "David Michelinie & Bob Layton",
      why: "Homem de Ferro contra Destino, presos na Camelot do Rei Arthur, com Morgana Le Fay. A rivalidade Stark × Destino que Downey carrega nas costas.",
      br: "Homem de Ferro: Legado de Destino — Panini, nov/2026, capa dura, R$ 72,90.", ok: true },
    { route: 2, tier: "essencial", title: "Doutor Estranho & Doutor Destino: Triunfo e Tormento", cover: ["triunfo-e-tormento"], orig: "Doctor Strange and Doctor Doom: Triumph and Torment", year: "1989",
      by: "Roger Stern & Mike Mignola",
      why: "Destino vence o torneio de Mago Supremo e cobra o prêmio: descer ao inferno para libertar a mãe de Mefisto. Leia antes de ouvir “O inferno me obedece”.",
      br: "Panini (Marvel Graphic Novels), mar/2023, 160 págs., capa dura.", ok: true },
    { route: 2, tier: "essencial", title: "Guerras Secretas", cover: ["guerras-secretas-1984", "guerras-secretas-10"], orig: "Marvel Super-Heroes Secret Wars #1–12", year: "1984–85",
      by: "Jim Shooter & Mike Zeck",
      why: "Heróis e vilões abduzidos para um planeta-arena. Destino rouba o poder do Beyonder e vira um deus. A matriz de tudo o que vem em 2026–2027.",
      br: "Guerras Secretas (Marvel Essenciais) — Panini, out/2025, 344 págs., capa dura.", ok: true },
    { route: 2, tier: "recomendado", title: "Impensável", cover: ["impensavel"], orig: "Fantastic Four #67–70, #500", year: "2003",
      by: "Mark Waid & Mike Wieringo",
      why: "Destino sacrifica o próprio primeiro amor para ganhar poder mágico absoluto. No trailer ele avisa: “teremos de tomar uma decisão impensável”.",
      br: "Sem edição em catálogo atual da Panini. Disponível no Marvel Unlimited (inglês).", ok: false },
    { route: 2, tier: "bonus", title: "Doomwar", cover: ["doomwar"], orig: "Doomwar #1–6", year: "2010",
      by: "Jonathan Maberry & Scot Eaton",
      why: "Destino invade Wakanda para roubar o vibranium — e quem lidera a defesa é Shuri como Pantera Negra. Exatamente a Shuri que está no filme.",
      br: "Sem edição em catálogo atual. Disponível no Marvel Unlimited (inglês).", ok: false },
    { route: 3, tier: "recomendado", title: "Quarteto Fantástico por Jonathan Hickman", cover: ["quarteto-hickman"], orig: "Fantastic Four #570–611 · FF #1–23", year: "2009–12",
      by: "Jonathan Hickman, Dale Eaglesham, Steve Epting e outros",
      why: "O Conselho dos Reeds, Valéria pedindo ajuda a Destino, Franklin e seus poderes. É aqui que Destino e a família Richards ficam inseparáveis.",
      br: "Quarteto Fantástico por Jonathan Hickman (Omnibus) — Panini; Vol. 2 em ago/2025, 832 págs.", ok: true },
    { route: 3, tier: "essencial", title: "Vingadores & Novos Vingadores por Hickman", cover: ["vingadores-hickman", "novos-vingadores"], orig: "Avengers (2012) · New Avengers (2013)", year: "2012–15",
      by: "Jonathan Hickman, Jerome Opeña, Steve Epting e outros",
      why: "“Tudo morre.” Os Illuminati descobrem as Incursões e Namor monta a Cabala para destruir outras Terras. É o problema central de Doomsday.",
      br: "Coleção Vingadores por Jonathan Hickman (Panini, 2026) — Vol. 1 em nov/2026, R$ 49,90.", ok: true },
    { route: 3, tier: "essencial", title: "Vingadores: Tempo Esgotado", cover: ["tempo-esgotado"], orig: "Avengers #35–44 · New Avengers #24–33", year: "2015",
      by: "Jonathan Hickman, Mike Deodato Jr., Stefano Caselli e outros",
      why: "Kevin Feige citou esta saga como inspiração direta de Doomsday e Guerras Secretas. Os últimos dias do multiverso — e o relógio que aparece em todos os teasers.",
      br: "Vingadores: Tempo Esgotado Vol. 1–4 — Panini, 2021, capa dura.", ok: true },
    { route: 3, tier: "essencial", title: "Guerras Secretas (2015)", cover: ["guerras-secretas-2015"], orig: "Secret Wars #0–9", year: "2015–16",
      by: "Jonathan Hickman & Esad Ribić",
      why: "O multiverso acaba. Destino salva o que resta, cria o Mundo Bélico e reina como Deus Imperador ao lado de Sue e Franklin. Leitura obrigatória para 2026 e 2027.",
      br: "Publicada pela Panini em 2016; procure a reedição na Coleção Vingadores por Hickman.", ok: false },
    { route: 4, tier: "recomendado", title: "Homem de Ferro Infame", cover: ["homem-de-ferro-infame"], orig: "Infamous Iron Man #1–12", year: "2016–17",
      by: "Brian Michael Bendis & Alex Maleev",
      why: "Destino veste a armadura do Homem de Ferro. Se você quer entender a ironia de Downey como Destino, comece aqui.",
      br: "Saiu no mensal Homem de Ferro da Panini (2017). Hoje, mais fácil em sebos e no Marvel Unlimited.", ok: false },
    { route: 4, tier: "bonus", title: "Doutor Destino", cover: ["doutor-destino-2019"], orig: "Doctor Doom (2019) #1–5", year: "2019",
      by: "Christopher Cantwell & Salvador Larroca",
      why: "Destino acusado de um crime que não cometeu, tentando salvar a Terra do jeito dele. Ótimo estudo de personagem.",
      br: "Doutor Destino Vol. 1 — Panini, fev/2021, capa dura.", ok: true },
    { route: 4, tier: "recomendado", title: "Caçada Sangrenta", cover: ["cacada-sangrenta"], orig: "Blood Hunt #1–5", year: "2024",
      by: "Jed MacKay & Pepe Larraz",
      why: "Vampiros cobrem o mundo de trevas — e o preço da vitória faz de Destino o novo Mago Supremo.",
      br: "Caçada Sangrenta 01–03 — Panini, 2025.", ok: true },
    { route: 4, tier: "recomendado", title: "Um Mundo Sob Destino", cover: ["um-mundo-sob-destino"], orig: "One World Under Doom", year: "2025",
      by: "Ryan North & R.B. Silva",
      why: "Destino se declara Imperador da Terra e acaba com guerras e fome. Os heróis precisam derrubar um tirano que está… melhorando o mundo.",
      br: "Um Mundo Sob Destino — Panini, mensal desde dez/2025, R$ 19,90 cada.", ok: true },
    { route: 4, tier: "bonus", title: "Destino 2099 · Masmorras de Destino", cover: ["destino-2099", "masmorras-de-destino"], orig: "Doom 2099 · Dungeons of Doom", year: "1993 · 2025",
      by: "John Francis Moore, Pat Broderick · Benjamin Percy e outros",
      why: "Para quem ficou viciado: um Destino do futuro cyberpunk e as masmorras do castelo de Doomstadt.",
      br: "Destino 2099 Vol. 01 (Panini, mai/2026) e Masmorras de Destino (Panini, nov/2026).", ok: true }
  ],

  // HQs de fã do leitor: roteiro e arte próprios, baseadas nas HQs do roteiro
  fanComics: [
    { id: "destino-1", num: "#1", t: "A origem", d: "Nossa HQ original: de Latvéria ao cinema, em 8 páginas.", ready: true },
    { id: "triunfo-e-tormento", num: "#2", t: "Triunfo e Tormento", d: "Destino e o Doutor Estranho descem ao inferno pela alma de Cynthia.", from: "Triumph and Torment (1989)", ready: false }
  ],

  readLegal: [
    { t: "Bibliotecas e gibitecas", free: true, d: "Muitas bibliotecas públicas emprestam encadernados da Panini — e o Brasil tem gibitecas inteiras, como a Gibiteca Henfil (Centro Cultural São Paulo) e a Gibiteca de Curitiba, a primeira do país." },
    { t: "Amigos e clubes de leitura", free: true, d: "Encadernado bom circula: troque com amigos, grupos de leitura e comic shops que fazem rodas de troca." },
    { t: "Marvel Unlimited", d: "Assinatura oficial da Marvel com mais de 30 mil HQs digitais — quase todo o roteiro acima, em inglês.", url: "https://www.marvel.com/unlimited" },
    { t: "Sebos", d: "O lugar das edições esgotadas e baratas, como Homem de Ferro Infame e os encadernados antigos de Guerras Secretas." }
  ],

  /* ---------------------------------------------- referências e easter eggs */
  references: [
    { cat: "trailer", seen: "Um relógio contando os dias aparece em todos os teasers.", ref: "Vingadores: Tempo Esgotado (2015)", x: "O título da saga de Hickman que Feige citou como inspiração é literalmente “o tempo está acabando”. Cada teaser é um tique-taque até o fim do multiverso." },
    { cat: "trailer", seen: "Destino: “Teremos de tomar uma decisão impensável.”", ref: "Impensável (2003)", x: "Na saga de Mark Waid, Destino sacrifica Valéria, seu primeiro amor, para ganhar poder mágico. “Impensável” é a palavra-assinatura dele." },
    { cat: "trailer", seen: "Destino a Thor: “O inferno me obedece.”", ref: "Triunfo e Tormento (1989)", x: "Ele enfrenta Mefisto todo ano pela alma da mãe — e um dia vence. Destino é dos poucos mortais que já fizeram o inferno recuar." },
    { cat: "trailer", seen: "Destino segura o Rompe-Tormentas com dois dedos.", ref: "Guerras Secretas (2015)", x: "Como Deus Imperador, Destino mata Thanos sem o menor esforço. Os Russo usam a mesma régua de poder — agora contra Thor." },
    { cat: "trailer", seen: "Steve Rogers chega com um “E aí, parceiro?” e chama o Mjölnir.", ref: "Vingadores: Ultimato (2019)", x: "Ele já provou ser digno. E nos quadrinhos, quando Steve largou o escudo em 1974, virou Nômade — o “homem sem país”." },
    { cat: "trailer", seen: "Mística vira uma cópia perfeita de Yelena.", ref: "X-Men: O Filme (2000)", x: "O mesmo truque que ela usava para enganar os X-Men nos filmes da Fox. Paranoia de identidade é tema clássico das Guerras Secretas." },
    { cat: "trailer", seen: "Destino toca o chão e ergue as Sentinelas.", ref: "Dias de um Futuro Esquecido (1981)", x: "Os caçadores de mutantes mais famosos da Marvel, agora sob as ordens de alguém que nem é do mundo dos X-Men." },
    { cat: "trailer", seen: "Sue: “Victor era o cara mais inteligente de qualquer sala.”", ref: "Os Livros de Destino (2005)", x: "Na faculdade ele só tinha um rival à altura: Reed Richards. A ferida de orgulho que gerou um vilão." },
    { cat: "encore", seen: "Destino martela a própria máscara, com o áudio de Tony construindo a Mark I.", ref: "Homem de Ferro (2008) + FF Annual #2 (1964)", x: "Duas origens na mesma forja: a caverna de Tony e o Tibete de Victor, que vestiu a máscara ainda em brasa." },
    { cat: "encore", seen: "A TVA vê as Terras 10005 e 1127 colidirem.", ref: "Novos Vingadores: Tudo Morre (2013)", x: "Incursões em cascata, de duas para milhares. A Terra-1127 nunca foi definida no MCU — muitos apostam no mundo do Homem-Aranha de Tobey Maguire." },
    { cat: "encore", seen: "Loki bate na porta de Steve e Peggy.", ref: "Loki, 2ª temporada (2023)", x: "Ao ficar no passado, Steve criou uma ramificação do tempo. Loki, que hoje sustenta a Árvore do Mundo, sabe o preço disso." },
    { cat: "mcu", seen: "Vitrine da NYCC: simbionte, prancha do Surfista Prateado, cabeça de Ultron, capacete de Thanos.", ref: "Sem Volta Para Casa · Primeiros Passos · Era de Ultron · Ultimato", x: "Destino coleciona relíquias de vários universos. Cada peça é uma pista de onde ele andou — e do que estudou." },
    { cat: "mcu", seen: "As três máscaras exibidas no laboratório.", ref: "A armadura de Kirby, de Hickman e do Deus Imperador", x: "Os quadrinhos mudam o visual de Destino a cada era. Relatos falam em um traje por ato do filme." },
    { cat: "bastidores", seen: "Terra-828, o universo do Quarteto.", ref: "Jack Kirby (28/08/1917)", x: "O número é o aniversário do cocriador do Quarteto Fantástico e do próprio Doutor Destino." },
    { cat: "bastidores", seen: "Downey como Destino.", ref: "Homem de Ferro Infame (2016)", x: "Feige: “Ele interpretou o herói mais icônico; vamos deixá-lo interpretar o vilão mais icônico.” Nos quadrinhos, Destino já foi o Homem de Ferro." },
    { cat: "bastidores", seen: "“Steve Rogers vai voltar.”", ref: "Os créditos finais da Marvel", x: "Os teasers usam a frase que fecha todo filme do estúdio (“… vai voltar”) como a própria revelação." },
    { cat: "quadrinhos", seen: "“Pois eu sou Destino.”", ref: "Fantastic Four #5 (1962)", x: "Falar de si na terceira pessoa é marca registrada desde a estreia. Destino não diz “eu”: diz “Destino”." },
    { cat: "quadrinhos", seen: "Namor do lado incerto da linha.", ref: "Fantastic Four #6 (1962)", x: "A primeira aliança de vilões da Marvel foi Destino + Namor — e em 2013 Namor destruiu mundos com a Cabala." }
  ],

  /* -------------------------------------------------------------- vídeos */
  channels: [
    { key: "einerd", name: "Ei Nerd", handle: "@einerdtv", url: "https://www.youtube.com/@einerdtv", img: "assets/img/channels/einerdtv.jpg",
      d: "O maior canal de cultura pop do Brasil, no ar desde 2013 com Peter Jordan. Análises de trailer completas e teorias." },
    { key: "nerdclub", name: "Nerd Club", handle: "@NerdClub_", url: "https://www.youtube.com/@NerdClub_", img: "assets/img/channels/nerdclub.jpg",
      d: "Notícias, vazamentos e teorias do universo nerd num ritmo diário — perfeito para acompanhar a reta final." },
    { key: "lokia", name: "Miguel Lokia", handle: "@miguellokia", url: "https://www.youtube.com/@miguellokia", img: "assets/img/channels/miguellokia.jpg",
      d: "Super-heróis, quadrinhos e cinema com profundidade. Apresenta a série Protocolo Doomsday." },
    { key: "nerdland", name: "Nerd Land", handle: "@NerdLand", url: "https://www.youtube.com/@NerdLand", img: "assets/img/channels/nerdland.jpg",
      d: "Os famosos “EXPLICADO!”: detalhes, referências e easter eggs quadro a quadro." },
    { key: "omelete", name: "Omelete", handle: "@omeleteve", url: "https://www.youtube.com/@omeleteve", img: "assets/img/channels/omelete.jpg",
      d: "Referência em cultura pop desde 2000. Série especial “Destino: Vingadores” sobre o filme." }
  ],

  officialVideos: {
    trailer: { dub: "TcBtFtkQFiU", leg: "TXi17U3iadY", t: "Trailer oficial", dur: "2:26" },
    special: { dub: "ntOtyJwxcsM", leg: "OytKtJPsrBE", t: "Special Look", dur: "2:11" },
    teasers: [
      { dub: "3g6WChxY14I", leg: "0gF6lT6qGkc", t: "Teaser oficial 1", dur: "1:19" },
      { dub: "3k9vXZ1A2O0", leg: "20sPlyrMbeY", t: "Teaser oficial 2", dur: "1:08" },
      { dub: "GMtQhGC38yI", leg: "wYq5buaOQnw", t: "Teaser oficial 3", dur: "1:04" },
      { dub: "ZAy7K91ZRgY", leg: "ZAy7K91ZRgY", t: "Teaser oficial (versão original)", dur: "1:22" }
    ],
    recap: { id: "ibczMiqvyBA", t: "Marvel Recap: a história completa de Destino (as 3 partes)", dur: "1:20:51" },
    encore: { id: "HiAzj9HZQnE", t: "Vingadores: Ultimato Encore | Trailer Dublado", dur: "1:36" }
  },

  videoCats: [
    { id: "comece", t: "Comece aqui" },
    { id: "trailers", t: "Trailers analisados" },
    { id: "encore", t: "Ultimato Encore" },
    { id: "teorias", t: "Teorias" },
    { id: "antes", t: "Antes de assistir" },
    { id: "rumores", t: "Rumores ⚠" }
  ],

  videos: [
    { id: "idMLln3Fs90", ch: "omelete", cat: "comece", dur: "26:35", t: "DOUTOR DESTINO: História COMPLETA de Vingadores DOOMSDAY a GUERRAS SECRETAS" },
    { id: "WWwQ07yPGqI", ch: "omelete", cat: "comece", dur: "10:35", t: "VINGADORES: DOOMSDAY | Quem é o DOUTOR DESTINO?" },
    { id: "r97P3W-KMak", ch: "einerd", cat: "comece", dur: "8:27", t: "O PRIMEIRO ENCONTRO ENTRE O QUARTETO FANTÁSTICO E DR DESTINO" },
    { id: "7p0wwpNXKG0", ch: "lokia", cat: "comece", dur: "16:08", t: "TONY STARK VILÃO?: Explicando o Novo Doutor Destino | Doomsday #08" },
    { id: "-WK3w0LzSZ8", ch: "nerdland", cat: "comece", dur: "11:29", t: "A ORIGEM SECRETA DO DOUTOR DESTINO REVELADA!" },
    { id: "V3LaCk3Qxbc", ch: "einerd", cat: "comece", dur: "7:02", t: "COMO O DR. DESTINO VAI TOMAR O CONTROLE ABSOLUTO DO MULTIVERSO NO UCM" },

    { id: "fUX_uDX0tJM", ch: "einerd", cat: "trailers", dur: "20:46", t: "VINGADORES DOOMSDAY: ANÁLISE COMPLETA DO TRAILER!" },
    { id: "OEg8kMS6UG4", ch: "nerdland", cat: "trailers", dur: "25:21", t: "EXPLICADO! VINGADORES DOOMSDAY TRAILER OFICIAL (DETALHES + REFERÊNCIAS + EASTER EGGS)" },
    { id: "iuvshXiEr8U", ch: "einerd", cat: "trailers", dur: "18:21", t: "ANÁLISE COMPLETA: VINGADORES DOOMSDAY [TRAILER 2]" },
    { id: "oM6F24pDRWY", ch: "nerdland", cat: "trailers", dur: "12:44", t: "EXPLICADO! VINGADORES DOOMSDAY TRAILER 2 OFICIAL (DETALHES + REFERÊNCIAS + EASTER EGGS)" },
    { id: "ETYYrOD2pho", ch: "lokia", cat: "trailers", dur: "27:00", t: "TRAILER OFICIAL D23 DE VINGADORES DOOMSDAY — ANÁLISE COMPLETA" },
    { id: "o1TH_gyko7k", ch: "lokia", cat: "trailers", dur: "16:16", t: "TRAILER OFICIAL DE VINGADORES DOOMSDAY — ANÁLISE COMPLETA" },
    { id: "q8mCVKzhTYA", ch: "nerdclub", cat: "trailers", dur: "8:15", t: "FOI ISSO QUE TRANSFORMOU VICTOR NO DOUTOR DESTINO! Análise do trailer" },
    { id: "CfTpYauKbKU", ch: "nerdland", cat: "trailers", dur: "13:54", t: "O SEGREDO ESCONDIDO DOS 4 TRAILERS DE VINGADORES DOOMSDAY: O FIM DO MULTIVERSO!" },
    { id: "clUSHqYWaBg", ch: "einerd", cat: "trailers", dur: "10:57", t: "JUNTEI OS 4 TEASERS DE VINGADORES DOOMSDAY E FIZ UMA DESCOBERTA" },
    { id: "fQ-Pxz4eHT0", ch: "einerd", cat: "trailers", dur: "9:12", t: "COMO O DOUTOR DESTINO PAROU O ROMPE-TORMENTAS DO THOR COM SÓ 2 DEDOS?" },
    { id: "6MaTCxZYFm8", ch: "lokia", cat: "trailers", dur: "22:16", t: "TEASERS OFICIAIS DE VINGADORES DOOMSDAY: HISTÓRIA E DR DESTINO REVELADOS" },

    { id: "xrqM2pY0PS8", ch: "nerdland", cat: "encore", dur: "21:47", t: "EXPLICADO! TODAS AS NOVAS CENAS DE VINGADORES ULTIMATO ENCORE!" },
    { id: "tpdzr-FXFqw", ch: "einerd", cat: "encore", dur: "12:00", t: "O DOUTOR DESTINO SEQUESTROU O HULK! VINGADORES: ENCORE ANÁLISE" },
    { id: "mg3_jPpaZ0E", ch: "lokia", cat: "encore", dur: "20:02", t: "DIRETOR FINALMENTE EXPLICA A NOVA CENA DO HULK PRA VINGADORES DOOMSDAY" },
    { id: "hJeZYs2HPZc", ch: "einerd", cat: "encore", dur: "11:33", t: "O DOUTOR DESTINO VAI DESTRUIR A TVA E EU POSSO PROVAR!" },

    { id: "ibTdjPALoDQ", ch: "omelete", cat: "teorias", dur: "12:10", t: "O verdadeiro porquê de Robert Downey Jr. como VICTOR VON DOOM" },
    { id: "yr5skntRRUA", ch: "lokia", cat: "teorias", dur: "16:58", t: "VINGADORES DOOMSDAY FINALMENTE EXPLICA COMO TONY SEMPRE FOI O DR DESTINO" },
    { id: "WaxibE1La8E", ch: "lokia", cat: "teorias", dur: "27:21", t: "DOOMSDAY: O ÚNICO MEDO DO VICTOR" },
    { id: "y5G_JNL7in4", ch: "omelete", cat: "teorias", dur: "18:09", t: "Time VINGADORES vs. Time DOUTOR DESTINO, qual o MELHOR? | Destino: Vingadores" },
    { id: "Ihj1NpLdWHA", ch: "omelete", cat: "teorias", dur: "10:12", t: "WANDA é uma BRUXA DA LATVÉRIA? | Destino: Vingadores" },
    { id: "izEPB4PWr3M", ch: "omelete", cat: "teorias", dur: "8:49", t: "Bruxas da Latvéria REVELADAS (?)" },
    { id: "q8Q5cBXcw_0", ch: "nerdland", cat: "teorias", dur: "12:26", t: "POR QUE DOUTOR DESTINO QUER FRANKLIN EM VINGADORES DOOMSDAY" },
    { id: "bisfRQyHxAA", ch: "nerdland", cat: "teorias", dur: "9:47", t: "O MOTIVO DE DOUTOR DESTINO QUERER MATAR OS X-MEN EM DOOMSDAY" },
    { id: "uqfITb_0efc", ch: "nerdclub", cat: "teorias", dur: "9:14", t: "Por que o Doutor Destino está atrás do Capitão América em Doomsday?" },
    { id: "DUyuGSDclJs", ch: "lokia", cat: "teorias", dur: "52:30", t: "DOOMSDAY É ASSIM" },

    { id: "gXW3IvbJjn4", ch: "omelete", cat: "antes", dur: "25:19", t: "O QUE ASSISTIR ANTES DE VINGADORES DOOMSDAY | Destino: Vingadores" },
    { id: "PGw735a9BZQ", ch: "lokia", cat: "antes", dur: "27:44", t: "MARATONA MARVEL: O QUE ASSISTIR e o que ignorar no MCU | Protocolo Doomsday #04" },
    { id: "ik5cZwsQ7Xs", ch: "lokia", cat: "antes", dur: "22:44", t: "LOKI VAI MORRER DE NOVO? Recap definitivo antes de Doomsday" },
    { id: "mU4HSokvMwM", ch: "omelete", cat: "antes", dur: "28:49", t: "LOKI: história e conexões | Destino: Vingadores" },
    { id: "mFDj6PkRUW8", ch: "omelete", cat: "antes", dur: "19:55", t: "AINDA É PÉSSIMO? Veredito X-MEN 3: O CONFRONTO FINAL | Destino: Vingadores" },
    { id: "lfEBseZt4HY", ch: "nerdland", cat: "antes", dur: "15:57", t: "A ORDEM CRONOLÓGICA CORRETA DOS FILMES DOS X-MEN" },
    { id: "FzF8PP7Iq_4", ch: "nerdland", cat: "antes", dur: "22:53", t: "EXPLICADO! 109 DETALHES EM THUNDERBOLTS*" },
    { id: "z9TMdEwf6Z8", ch: "nerdland", cat: "antes", dur: "24:05", t: "EXPLICADO! 117 DETALHES EM QUARTETO FANTÁSTICO" },
    { id: "5tpu0V4uPEA", ch: "nerdland", cat: "antes", dur: "27:10", t: "EXPLICADO! 150 DETALHES EM HOMEM-ARANHA: UM NOVO DIA" },
    { id: "IziEcjG9HYg", ch: "nerdland", cat: "antes", dur: "33:48", t: "EXPLICADO! 47 DETALHES EM LOKI — 2ª TEMPORADA" },
    { id: "3Rq9Ft25Bwo", ch: "omelete", cat: "antes", dur: "11:06", t: "QUARTETO FANTÁSTICO: A HISTÓRIA COMPLETA" },

    { id: "pZh7a5eMcp0", ch: "nerdclub", cat: "rumores", dur: "8:34", t: "VAZOU O TIME DO DOUTOR DESTINO EM VINGADORES: DOOMSDAY" },
    { id: "gZ4dFmknoIM", ch: "omelete", cat: "rumores", dur: "9:46", t: "Doombots de Victor Von Doom CONFIRMADOS" },
    { id: "E7xPqji5heU", ch: "omelete", cat: "rumores", dur: "9:48", t: "O QUE É ISSO, VON DOOM? Máscaras de Vingadores: Doutor Destino REVELADAS" },
    { id: "aKXjtBIjrdk", ch: "nerdclub", cat: "rumores", dur: "10:05", t: "A cena final de Vingadores: Doomsday e a conexão com Guerras Secretas" }
  ],

  /* ------------------------------------------------------- maratona */
  watch: [
    { id: "xmen", list: "oficial", t: "X-Men: O Filme", y: 2000, m: 104, why: "Apresenta Xavier, Magneto, Ciclope e Mística — o elenco que volta.", fast: false },
    { id: "x2", list: "oficial", t: "X-Men 2", y: 2003, m: 134, why: "A estreia de Noturno e o auge da relação Xavier × Magneto. O melhor resumo dos X-Men da Fox.", fast: true },
    { id: "cap1", list: "oficial", t: "Capitão América: O Primeiro Vingador", y: 2011, m: 124, why: "Steve e Peggy. Sem isso, a cena da porta não dói.", fast: false },
    { id: "av1", list: "oficial", t: "Os Vingadores", y: 2012, m: 143, why: "A equipe original e o primeiro “Vingadores, avante”.", fast: false },
    { id: "iw", list: "oficial", t: "Vingadores: Guerra Infinita", y: 2018, m: 149, why: "O Thor guerreiro que os Russo querem de volta.", fast: false },
    { id: "eg", list: "oficial", t: "Vingadores: Ultimato", y: 2019, m: 181, why: "O ponto de partida emocional. Doomsday “continua de onde Ultimato parou”. Se puder, veja a versão Encore, com 4 cenas novas.", fast: true },
    { id: "loki", list: "oficial", t: "Loki (temporadas 1 e 2)", y: 2021, m: 630, why: "TVA, variantes e o destino de Loki como guardião do multiverso.", fast: true },
    { id: "shang", list: "oficial", t: "Shang-Chi e a Lenda dos Dez Anéis", y: 2021, m: 132, why: "Os Dez Anéis e o Shang-Chi que hoje é veterano.", fast: false },
    { id: "nwh", list: "oficial", t: "Homem-Aranha: Sem Volta Para Casa", y: 2021, m: 148, why: "O multiverso vazando — e o simbionte que ficou para trás.", fast: false },
    { id: "mom", list: "oficial", t: "Doutor Estranho no Multiverso da Loucura", y: 2022, m: 126, why: "Os Illuminati explicam as Incursões: a regra do jogo de Doomsday.", fast: true },
    { id: "wf", list: "oficial", t: "Pantera Negra: Wakanda para Sempre", y: 2022, m: 161, why: "Shuri, M'Baku, Namor e Talokan.", fast: false },
    { id: "dw", list: "oficial", t: "Deadpool & Wolverine", y: 2024, m: 128, why: "A TVA, o Vazio, Gambit e a Terra-10005.", fast: false },
    { id: "bnw", list: "oficial", t: "Capitão América: Admirável Mundo Novo", y: 2025, m: 118, why: "Sam Wilson assume e começa a reconstruir os Vingadores.", fast: false },
    { id: "tb", list: "oficial", t: "Thunderbolts*", y: 2025, m: 127, why: "Nascem os Novos Vingadores. A cena pós-créditos é a ponte direta.", fast: true },
    { id: "ff", list: "oficial", t: "Quarteto Fantástico: Primeiros Passos", y: 2025, m: 115, why: "A Terra-828, Franklin e a primeira aparição de Destino.", fast: true },

    { id: "bnd", list: "extra", t: "Homem-Aranha: Um Novo Dia", y: 2026, m: null, why: "Mostra o que aconteceu com Bruce Banner antes de Destino aparecer.", where: "Cinemas / digital", fast: false },
    { id: "encore", list: "extra", t: "Vingadores: Ultimato Encore", y: 2026, m: 181, why: "O relançamento com as 4 cenas novas que preparam Doomsday.", where: "Cinemas (set/2026)", fast: false },
    { id: "vq", list: "extra", t: "VisionQuest", y: 2026, m: null, why: "A série de Visão, com Ultron de volta. Estreia 14/10/2026.", where: "Disney+", fast: false },
    { id: "tlr", list: "extra", t: "Thor: Amor e Trovão", y: 2022, m: 119, why: "Apresenta Amor, a filha adotiva por quem Thor reza no teaser.", fast: false },
    { id: "quant", list: "extra", t: "Homem-Formiga e a Vespa: Quantumania", y: 2023, m: 125, why: "Cassie adulta e o último filme de Scott.", fast: false },
    { id: "x3", list: "extra", t: "X-Men: O Confronto Final", y: 2006, m: 104, why: "O Fera de Kelsey Grammer e o fim (?) da Mística da Fox.", fast: false },
    { id: "dofp", list: "extra", t: "X-Men: Dias de um Futuro Esquecido", y: 2014, m: 132, why: "A última vez que vimos Xavier, Magneto e Ciclope originais — e Sentinelas.", fast: false },
    { id: "marvels", list: "extra", t: "As Marvels", y: 2023, m: 105, why: "A cena pós-créditos com o Fera da Fox no MCU.", fast: false }
  ],

  faq: [
    { q: "Quando estreia no Brasil?", a: "17 de dezembro de 2026 (quinta-feira). Nos EUA é 18/12 e no Reino Unido, 16/12. A pré-venda para salas Infinity Vision abriu em 28/09/2026." },
    { q: "Preciso ver todos os filmes da Marvel antes?", a: "Não. A própria Disney diz que não é obrigatório. Mas a coleção oficial de 15 títulos no Disney+ (e a nossa versão rápida, com 6) deixa tudo muito mais claro." },
    { q: "Robert Downey Jr. está interpretando o Tony Stark?", a: "Oficialmente, não: ele é Victor Von Doom. A cena do Encore que mistura a forja de Destino com o áudio de Tony alimentou teorias de ligação entre os dois, mas a Marvel trata isso como especulação." },
    { q: "Quais X-Men são esses?", a: "Os da Terra-10005, o universo dos filmes da Fox: Patrick Stewart, Ian McKellen, James Marsden, Rebecca Romijn, Alan Cumming e Kelsey Grammer, mais o Gambit de Channing Tatum." },
    { q: "Vai ter IMAX?", a: "Nos EUA, não nas três primeiras semanas (exclusividade de Duna: Parte Três). Em outros mercados há IMAX em salas selecionadas; no Brasil, confira a rede de cinema. A Disney aposta no selo Infinity Vision." },
    { q: "Qual a duração do filme?", a: "Ainda não foi divulgada oficialmente. Circulam rumores de cerca de 3 horas." },
    { q: "Tem cena pós-créditos?", a: "Não há confirmação — mas é tradição da Marvel, e o filme termina a ponte para Vingadores: Guerras Secretas (17/12/2027)." },
    { q: "E depois?", a: "Vingadores: Guerras Secretas encerra a Saga do Multiverso em 17 de dezembro de 2027, com os mesmos diretores e roteiristas." }
  ],

  sources: [
    { t: "Avengers: Doomsday — Wikipedia (inglês)", url: "https://en.wikipedia.org/wiki/Avengers:_Doomsday" },
    { t: "Omelete — contagem de 100 dias e data no Brasil", url: "https://www.omelete.com.br/filmes/vingadores-doutor-destino-contagem-100-dias-novo-teaser" },
    { t: "Times Brasil — pré-venda no Brasil", url: "https://timesbrasil.com.br/entretenimento/cinema-e-tv/ingressos-de-vingadores-doutor-destino-entram-em-pre-venda-em-data-definida-no-brasil-confira/" },
    { t: "Disney+ — guia oficial do filme", url: "https://www.disneyplus.com/explore/articles/avengers-doomsday" },
    { t: "Screen Realm — Special Look (D23 2026)", url: "https://screenrealm.com/avengers-doomsday-special-look-trailer-doctor-doom-d23/" },
    { t: "Gizmodo — análise do trailer", url: "https://gizmodo.com/avengers-doomsday-trailer-breakdown-easter-eggs-secrets-plot-2000787741" },
    { t: "The HoloFiles — cenas de Ultimato Encore", url: "https://theholofiles.com/2026/09/25/avengers-endgame-encore-doomsday-scenes/" },
    { t: "Yahoo — trailer ScreenX e as Bruxas da Latvéria", url: "https://www.yahoo.com/entertainment/movies/articles/avengers-doomsday-trailer-features-best-195048934.html" },
    { t: "Maxblizz — laboratório de Destino na NYCC 2026", url: "https://maxblizz.com/avengers-doomsday-doctor-doom-lab-artifacts/" },
    { t: "ComicBookMovie — Doombots na arte promocional", url: "https://comicbookmovie.com/avengers/avengers-doomsday/avengers-doomsday-reveals-first-look-at-doombots-doomstadt-tower-and-lord-doom-a230241" },
    { t: "Avengers Countdown — coleção oficial do Disney+", url: "https://avengerscountdown.com/articles/avengers-doomsday-disney-plus-essential-watchlist-15-titles" },
    { t: "Murphy's Multiverse — vazamentos (não confirmados)", url: "https://www.murphysmultiverse.com/leaked-avengers-doomsday-plot-points-tease-a-battle-of-heavy-hitters-a-major-legacy-death-and-a-shocking-steve-rogers-twist/" },
    { t: "Variety — pós-créditos de Homem-Aranha: Um Novo Dia", url: "https://variety.com/2026/film/news/spider-man-brand-new-day-credits-avengers-doomsday-secret-wars-1236821075/" },
    { t: "Catálogo Panini Brasil (edições e preços, out/2026)", url: "https://panini.com.br/" }
  ],

  photoCredits: {
    rdj: ["PhilipRomano", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:RobertDowneyJr-byPhilipRomano7_(cropped).jpg"],
    evans: ["Sara Komatsu", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Chris_Evans_at_the_2025_Toronto_International_Film_Festival_(cropped).jpg"],
    hemsworth: ["Kevin Paul", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Chris_Hemsworth_-_Crime_101.jpg"],
    pascal: ["Bryan Berlin", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Pedro_Pascal_at_the_2026_New_York_Film_Festival-042.jpg"],
    rudd: ["Bryan Berlin", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Paul_Rudd_at_the_2026_New_York_Film_Festival-003.jpg"],
    mackie: ["Quejaytee", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Anthony_Mackie_on_the_Green_Carpet_at_the_2025_Zurich_Film_Festival_03_(cropped).jpg"],
    pugh: ["Frank Sun", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_13_(cropped_2_%E2%80%93_color_adjusted).jpg"],
    kirby: ["Jay Dixit", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Vanessa_Kirby_at_the_2024_Toronto_International_Film_Festival_08_(Cropped).jpg"],
    mossbachrach: ["Amy Hecht", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Ebon_Moss-Bachrach_at_the_2026_New_York_Film_Festival_(2).jpg"],
    wrussell: ["JaceMerlyn", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Wyatt_Russell_at_Comic_Con_Connections_26_19_(cropped).jpg"],
    tatum: ["Harald Krichel", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Channing_Tatum_at_the_2026_Berlin_International_Film_Festival-69843.jpg"],
    liu: ["Gage Skidmore", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Simu_Liu_by_Gage_Skidmore_2.jpg"],
    mckellen: ["Gage Skidmore", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:SDCC13_-_Ian_McKellen.jpg"],
    atwell: ["Harald Krichel", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Hayley_Atwell_2025_(crop).jpg"],
    hiddleston: ["Kevin Payravi", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Tom_Hiddleston_at_the_2024_Toronto_International_Film_Festival_(cropped).jpg"],
    marsden: ["Gage Skidmore", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:James_Marsden_by_Gage_Skidmore.jpg"],
    stewart: ["Gage Skidmore", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Patrick_Stewart_by_Gage_Skidmore_2.jpg"],
    quinn: ["Gage Skidmore", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Joseph_Quinn_by_Gage_Skidmore.jpg"],
    stan: ["Harald Krichel", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Sebastian_Stan-64526.jpg"],
    harbour: ["PelucheEn ElEstuche", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:David_Harbour_2025.jpg"],
    wright: ["Duk3L1xon", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Letitia_Wright_at_2025_SXSW_London_(cropped).jpg"],
    pullman: ["Kevin Paul", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Lewis_Pullman_at_San_Diego_Comic_Con_2026-2.jpg"],
    grammer: ["Exchanges Photos", "CC0", "https://commons.wikimedia.org/wiki/File:Kelsey_Grammer_Young_Washington_Film_Screening_2026_(cropped).jpg"],
    newton: ["4DX", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Kathryn_Newton_4DX_2023.jpg"],
    ramirez: ["SWinxy", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Guests_at_the_2026_Met_Gala_416_(cropped_2).jpg"],
    duke: ["Zach Catanzareti Photo", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Winston_duke_(49562238976).jpg"],
    cumming: ["Scottish Government", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:FM_and_Alan_Cumming_in_NY-4_(cropped).jpg"],
    johnkamen: ["joyparris", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Hannah_John-Kamen_Ant-Man_%26_The_Wasp_premiere.jpg"],
    romijn: ["Gage Skidmore", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Rebecca_Romijn_by_Gage_Skidmore_2.jpg"],
    cadena: ["Ricardogarcia10", "CC0", "https://commons.wikimedia.org/wiki/File:Actriz_Mabel_Cadena_2024_(cropped).jpg"],
    huerta: ["Kevin Payravi", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Tenoch_Huerta_2024.jpg"],
    ruffalo: ["Gage Skidmore", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Mark_Ruffalo_(36201774756)_(cropped).jpg"]
  },

  licenseUrls: {
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br",
    "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/deed.pt-br",
    "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/deed.pt-br",
    "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/deed.pt-br",
    "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/deed.pt-br",
    "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/deed.pt-br",
    "CC0": "https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br"
  }
};
