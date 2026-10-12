# Vingadores: Doutor Destino — o guia definitivo do fã

**🌐 No ar:** https://matheusaoliv.github.io/doomsday/

Site de fã (não oficial) para a estreia de **Vingadores: Doutor Destino** (*Avengers: Doomsday*), que chega aos cinemas brasileiros em **17 de dezembro de 2026**. A pesquisa foi fechada em 12/10/2026.

A abertura segue a linguagem do site de GTA VI: a palavra **DOOM** funciona como uma janela para uma cena em WebGL. As duas Terras aparecem dentro dos “O”, a câmera atravessa a letra e o céu fica vermelho com a **Incursão**.

## O que tem no site

| Seção | O que faz |
|---|---|
| **Abertura** | Máscara “DOOM” com zoom ao rolar e shader WebGL feito à mão (duas Terras colidindo, nebulosa verde). No celular, as letras se reorganizam em “DO / OM”. |
| **Contagem** | Relógio com dígitos rolantes para Brasil (17/12), EUA (18/12) e Reino Unido (16/12). O botão de agenda abre o evento já preenchido no Google Agenda ou no Outlook, ou um `.ics` hospedado (Apple/iPhone e outros). Também compartilha a contagem. |
| **O essencial** | Premissa e os três universos, cada um com a sua direção de arte e os seus heróis (616 em lâminas de aço, 828 retrofuturista, 10005 em X azul e amarelo). Depois vem “Como funciona uma Incursão”, um explicador em 3 etapas com dois globos em canvas, o céu vermelho e o relógio de 8 horas de Hickman. Fecha com ficha técnica, glossário e linha do tempo do marketing. |
| **Quem é Destino** | Um comparador “duas faces”: arraste entre o Destino dos quadrinhos (pintura de Alex Ross) e o do cinema, sobre o vitral verde do pôster oficial. Depois, 12 capítulos em rolagem horizontal, da Latvéria ao MCU, cada um com a capa da HQ correspondente e um atalho para o trecho certo do **Marvel Recap** oficial (1h20). No fim, o Recap com os 10 capítulos clicáveis. |
| **O lado de Destino** | Possíveis aliados com o status de cada informação (**Oficial / Indício / Rumor / Teoria / HQ**), uma barra de chance e um radar de rumores com credibilidade estimada. |
| **Contra Destino** | 31 personagens separados por equipe e universo, mostrados como aparecem nos filmes. Ao passar o mouse, aparece o ator. O dossiê traz a imagem do filme, a foto do ator, o papel no filme, onde apareceu pela última vez e por que importa. |
| **Roteiro de HQs** | 18 paradas em 4 rotas com a capa de cada HQ, as edições brasileiras da Panini conferidas no catálogo (✔) e onde ler de forma legal, inclusive de graça (bibliotecas e gibitecas). Sem botões de loja. |
| **Leitor de HQ** | *DESTINO #1*, uma HQ original de 8 páginas em português, feita em SVG. Pode ser lida por página ou painel a painel, com zoom, miniaturas, teclado e gestos. Também abre arquivos **.cbz** ou imagens do próprio leitor, sem enviar nada a servidor algum. |
| **Referências** | 18 cartões que viram ao toque: “o que vimos” de um lado e “de onde vem” do outro. |
| **Vídeos** | Trailers oficiais (dublado e legendado), o Recap completo com capítulos e 46 análises de **Ei Nerd, Nerd Club, Miguel Lokia, Nerd Land e Omelete**. Filtros por tema e por canal com contagem, “ver mais” e sem combinações vazias. Os vídeos tocam no site, com crédito, link e botão de inscrição para cada canal. |
| **O que assistir** | Lista oficial do Disney+ (15 títulos), um modo “sem tempo” com 6 títulos e os extras. O progresso fica salvo no aparelho. |
| **FAQ / Fontes** | Todas as fontes, créditos das fotos e avisos legais. |

Também há um easter egg: digite ↑ ↑ ↓ ↓ ← → ← → B A.

## Como rodar

O site é estático: não precisa de build nem de dependências.

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Para publicar no **GitHub Pages**, vá em *Settings → Pages → Deploy from a branch*, escolha o branch e a pasta `/ (root)`.

## Estrutura

```
index.html              marcação de todas as seções
assets/css/main.css     sistema visual (tokens, seções, leitor, player, responsivo)
assets/js/data.js       TODO o conteúdo (datas, elenco, aliados, HQs, vídeos, maratona, fontes)
assets/js/main.js       montagem das seções + animações (GSAP, ScrollTrigger, SplitText, Lenis)
assets/js/hero-gl.js    shader WebGL da abertura (máscara “DOOM” em SDF na GPU, resolução adaptativa)
assets/js/comic.js      a HQ DESTINO #1 (arte vetorial gerada em SVG)
assets/js/reader.js     leitor de quadrinhos (painel a painel, zoom, .cbz)
assets/vendor/          GSAP 3.15 e Lenis 1.3 (cópias locais)
assets/img/cast/        fotos dos atores (Wikimedia Commons, licenças livres)
assets/img/film/        os personagens como aparecem nos filmes (material promocional © Marvel Studios)
assets/img/covers/      capas das HQs do roteiro (© Marvel Comics / Panini Comics)
assets/img/doom/        Destino: imagem do filme, pôsteres oficiais e a pintura de Alex Ross (comparador)
assets/img/blur/        miniaturas de 24 px usadas como fundo desfocado (sem custo de filtro CSS)
assets/img/channels/    avatares dos canais creditados
assets/cal/             eventos .ics da estreia (Brasil, EUA e Reino Unido)
```

Para atualizar uma informação, basta editar `assets/js/data.js`. Cada item tem o campo de status (oficial, indício, rumor…) usado no site.

## Acessibilidade e desempenho

- O site respeita `prefers-reduced-motion`: sem pin, sem rolagem suave e com o conteúdo já visível.
- Diálogos usam `<dialog>` nativo. Há navegação por teclado, foco visível e rótulos ARIA.
- O WebGL ajusta a própria resolução conforme o desempenho do aparelho, pausa quando a abertura sai da tela e se reajusta quando a janela muda de tamanho. Sem suporte a WebGL, entra um fundo em CSS.
- A Incursão e o selo do Destino só animam enquanto estão na tela.
- Os vídeos usam `youtube-nocookie.com` e só carregam quando você clica.

## Créditos e direitos

- **Site de fã, sem fins lucrativos**, sem vínculo com Marvel Studios, Disney ou Panini. Marcas e personagens pertencem aos seus donos.
- **Vídeos**: incorporados pelo player oficial do YouTube. Todos os direitos são dos canais [Ei Nerd](https://www.youtube.com/@einerdtv), [Nerd Club](https://www.youtube.com/@NerdClub_), [Miguel Lokia](https://www.youtube.com/@miguellokia), [Nerd Land](https://www.youtube.com/@NerdLand), [Omelete](https://www.youtube.com/@omeleteve) e [Marvel Brasil](https://www.youtube.com/@MarvelBR).
- **Fotos dos atores**: Wikimedia Commons, licenças CC BY, CC BY-SA e CC0, com autor e licença listados no site. As imagens foram recortadas e redimensionadas.
- **Imagens dos personagens**: material promocional oficial © Marvel Studios/Disney (via MCU Wiki), usado só para identificação, sem fins comerciais. **Capas**: © Marvel Comics e Panini Comics, usadas só para identificar cada edição. Se algum titular pedir, a imagem sai do ar.
- **HQ *DESTINO #1* e ilustrações**: obras originais de fã. O site não hospeda HQs da Marvel.
- **Bibliotecas**: [GSAP](https://gsap.com) (licença padrão gratuita da GreenSock) e [Lenis](https://github.com/darkroomengineering/lenis) (MIT).
