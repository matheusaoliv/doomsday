# Vingadores: Doutor Destino — o guia definitivo do fã

**🌐 No ar:** https://matheusaoliv.github.io/doomsday/

Site de fã (não oficial) para a estreia de **Vingadores: Doutor Destino** (*Avengers: Doomsday*), que chega aos cinemas brasileiros em **17 de dezembro de 2026**. A pesquisa foi fechada em 12/10/2026.

A abertura segue a linguagem do site de GTA VI: a palavra **DOOM** funciona como uma janela para uma cena em WebGL. As duas Terras aparecem dentro dos “O”, a câmera atravessa a letra e o céu fica vermelho com a **Incursão**.

## O que tem no site

| Seção | O que faz |
|---|---|
| **Abertura** | Máscara “DOOM” com zoom ao rolar e shader WebGL feito à mão (duas Terras colidindo, nebulosa verde). No celular, as letras se reorganizam em “DO / OM”. |
| **Contagem** | Relógio com dígitos rolantes para Brasil (17/12), EUA (18/12) e Reino Unido (16/12). Também salva o evento na agenda (.ics) e compartilha a contagem. |
| **O essencial** | Premissa, os três universos (616, 828 e 10005), ficha técnica, glossário (Incursão, TVA, Mundo Bélico…) e linha do tempo do marketing. |
| **Quem é Destino** | Dez capítulos em rolagem horizontal, da Latvéria ao MCU, ilustrados com painéis da HQ original. |
| **O lado de Destino** | Possíveis aliados com o status de cada informação (**Oficial / Indício / Rumor / Teoria / HQ**), uma barra de chance e um radar de rumores com credibilidade estimada. |
| **Contra Destino** | 31 personagens separados por equipe e universo. Cada um abre um dossiê com onde apareceu pela última vez e por que importa. |
| **Roteiro de HQs** | 18 paradas em 4 rotas, com as edições brasileiras da Panini conferidas no catálogo (✔) e links para a loja. |
| **Leitor de HQ** | *DESTINO #1*, uma HQ original de 8 páginas em português, feita em SVG. Pode ser lida por página ou painel a painel, com zoom, miniaturas, teclado e gestos. Também abre arquivos **.cbz** ou imagens do próprio leitor, sem enviar nada a servidor algum. |
| **Referências** | 18 cartões que viram ao toque: “o que vimos” de um lado e “de onde vem” do outro. |
| **Vídeos** | Trailers oficiais (dublado e legendado) e 46 análises de **Ei Nerd, Nerd Club, Miguel Lokia, Nerd Land e Omelete**. Os vídeos tocam no site, com crédito, link e botão de inscrição para cada canal. |
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
assets/js/hero-gl.js    shader WebGL da abertura
assets/js/comic.js      a HQ DESTINO #1 (arte vetorial gerada em SVG)
assets/js/reader.js     leitor de quadrinhos (painel a painel, zoom, .cbz)
assets/vendor/          GSAP 3.15 e Lenis 1.3 (cópias locais)
assets/img/cast/        fotos do elenco (Wikimedia Commons, licenças livres)
assets/img/channels/    avatares dos canais creditados
```

Para atualizar uma informação, basta editar `assets/js/data.js`. Cada item tem o campo de status (oficial, indício, rumor…) usado no site.

## Acessibilidade e desempenho

- O site respeita `prefers-reduced-motion`: sem pin, sem rolagem suave e com o conteúdo já visível.
- Diálogos usam `<dialog>` nativo. Há navegação por teclado, foco visível e rótulos ARIA.
- O WebGL roda em resolução reduzida e pausa quando a abertura sai da tela. Sem suporte a WebGL, entra um fundo em CSS.
- Os vídeos usam `youtube-nocookie.com` e só carregam quando você clica.

## Créditos e direitos

- **Site de fã, sem fins lucrativos**, sem vínculo com Marvel Studios, Disney ou Panini. Marcas e personagens pertencem aos seus donos.
- **Vídeos**: incorporados pelo player oficial do YouTube. Todos os direitos são dos canais [Ei Nerd](https://www.youtube.com/@einerdtv), [Nerd Club](https://www.youtube.com/@NerdClub_), [Miguel Lokia](https://www.youtube.com/@miguellokia), [Nerd Land](https://www.youtube.com/@NerdLand), [Omelete](https://www.youtube.com/@omeleteve) e [Marvel Brasil](https://www.youtube.com/@MarvelBR).
- **Fotos do elenco**: Wikimedia Commons, licenças CC BY, CC BY-SA e CC0, com autor e licença listados no site. As imagens foram recortadas e redimensionadas.
- **HQ *DESTINO #1* e ilustrações**: obras originais de fã. O site não hospeda HQs da Marvel.
- **Bibliotecas**: [GSAP](https://gsap.com) (licença padrão gratuita da GreenSock) e [Lenis](https://github.com/darkroomengineering/lenis) (MIT).
