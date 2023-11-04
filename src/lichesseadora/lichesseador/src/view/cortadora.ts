import { h } from 'snabbdom';
import { Chapter, Studies, Study as Studio } from '../chanels/studio';
import { Ctrl } from '../ctrl';
import { MOCK_PNG, MOCK_PNG_2 } from '../chanels/mock-png';
import { lichessHost } from '../auth';

export const finalitos: Chapter[] = [
    {
        name: '12. Finales dos peones',
        pgn: MOCK_PNG // fs.readFileSync("/Users/morente/Desktop/DRIVE/taller_tc/cortadora-chess/src/cortadora/finalitos/Final/12-Finales-dos-peones-.pgn")
    },
    {
        name: 'F13. Torre contra Alfil',
        pgn: MOCK_PNG_2 // fs.readFileSync("/Users/morente/Desktop/DRIVE/taller_tc/cortadora-chess/src/cortadora/finalitos/F13-Torre-contra-Alfil.pgn")
    }
];

const li =  (titulo: string, enlace: string) =>
    h(
        'li',
        h(
            'a',
            {
                attrs: { href: enlace },
            },
            titulo
        )
    );

const li2 =  (follow: any) =>
    h(
        'li',
        follow
    );

const estudioButtons = (ctrl: Ctrl, s: Studio) => {

    const link = `${lichessHost}/study/${s.id}`;
    return [
        h(
            'button.btn.btn-outline-primary.btn-sm',
            {
              attrs: { type: 'button' },
              on: { click: () => ctrl.studies.uploadStudies(ctrl, s, finalitos) },
            },
            `(subir)`
        ),
        h(
          'a',
          {
            attrs: { href: link },
          },
          `    ${s.name}`
        )
    ];
}
const estudioLink = (ctrl: Ctrl, s: Studio) => {

    const text = estudioButtons(ctrl, s);
    
    return li2(text);
}
//    https://lichess.org/study/mine/hot

export const renderCortadora = (s: Ctrl) =>
    h('div.cortadora', [
    h('p', h('a', {attrs: { href: `${lichessHost}/study/mine/hot` }}, 'Estudios:')),    ,
    h('ul', s.studies.db.map(f => estudioLink(s, f))),
    h('p', 'PNGs:'),
    h('ul', finalitos.map(f => li(f.name, f.name))),
    h('p', [
        'Esto que tienes arriba está listo para ser exportado a Estudio',
        h('code', '<Ctrl+Shift+j+palabra_mágica>'),
        ' para subir 1000 puntos de ELO.',
        h('br'),
        'Si algo se rompe es tu cuenta de lichess es culpa tuya por no revisar el código y darle click sin saber.',
    ])
]);

export function confirmarSubida(s: Studio, pngs: Chapter[]) {

    if (confirm(`¿Subo al estudio [${s.name}], ${pngs.length} partidas?`)) {
        console.log("Subir");
        return true;
    }
    return false;
}

