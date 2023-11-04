import { Me, lichessHost } from "../auth";
import { Ctrl } from "../ctrl";
import { formData } from "../util";
import { confirmarSubida } from "../view/cortadora";

export interface Study {
    "id": string;
    "name": string;
    "createdAt": number;
    "updatedAt": number;
}

export interface ImportPngResponse {
    chapters: any
}

export const demoStudies: Study[] = [
    {
        "id": "mGzG3MYw",
        "name": "Estudio 54",
        "createdAt": 1682202346269,
        "updatedAt": 1699123422863
    },
    {
        "id": "V21VFYnL",
        "name": "Entrenando la V Liga",
        "createdAt": 1682279820745,
        "updatedAt": 1699123399113
    },
    {
        "id": "5mFkOKj8",
        "name": "Recordando viejas palizas",
        "createdAt": 1686765680082,
        "updatedAt": 1699123364359
    },
    {
        "id": "hCQomdWM",
        "name": "Estudio para La Cortadora",
        "createdAt": 1697306803369,
        "updatedAt": 1699121795208
    },
    {
        "id": "KNXmWDrX",
        "name": "santomeox's Study",
        "createdAt": 1670104419782,
        "updatedAt": 1670104426972
    }
];

export interface Chapter {
    name: string;
    pgn: any;
}

export class Studies {

    db: Study[] = [];

    async getStudies(root: Ctrl): Promise<any[]> {

        const url = `/api/study/by/${(root.auth.me as Me).id}`;

        let response ;
        try {
            this.db = ((await root.auth.fetchBodyParse(
                url,
                 { method: 'get' }
            )) as Study[])
            .filter(s => Object.keys(s).length > 0);

            console.log("Licheseador.initCortadora.Fetch.Studies", this.db)
            return this.db;
        } catch(ex) {
            console.log(response);
            console.log(ex)
            return [];
        }

    }

    async uploadStudies(root: Ctrl, s: Study, pngs: Chapter[]) {

        const subir = confirmarSubida(s, pngs);

        if (!subir) return;

        const datos = pngs;
        await this.subirStudio(root, s, datos[0]);

        return;


    }

    async subirStudio(root: Ctrl, s: Study, partida: Chapter) {

        const url = `/api/study/${s.id}/import-pgn`;
        console.log("Enviando a", url, "esto", partida);

        let response: ImportPngResponse = { chapters: [] };
        try {
            response = ((await root.auth.fetchBodyParse(
                url,
                {
                    method: 'post',
                    body: formData({
                        ...partida,
                        keepAliveStream: false,
                      })
                }
            )) as ImportPngResponse);

            console.log("Licheseador.initCortadora.Fetch.uploadStudies", response)
            return this.db;
        } catch(ex) {
            console.log(response);
            console.log(ex)
            return [];
        }
    }

    empty() {
        this.db.splice(0, this.db.length);
    }
}