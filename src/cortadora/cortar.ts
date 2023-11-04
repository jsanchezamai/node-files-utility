import * as fs from "fs";
// TODO: Acordarse de bajar los 30GB de https://database.lichess.org/
export class Cortadora {

    cortar() {
        console.log("Cargando el archivo...");

        const marcas = {
            Evento: "[Event ",
            Blancas: "[White ",
            Negras: "[Black ",
            Fin:"]",
            Vacia: "  ",
            Diagrama: "Diag",
            Solucion: "Solucion",
            Seccion: "Seccion",
            Resumen: "Resumen",
            Final: "Final"
        }

        const salida = `${__dirname}/finalitos/`;
        const entrada = `${__dirname}/sample.pgn`;

        const los_100_finales = fs
            .readFileSync(entrada)
            .toString().split(marcas.Evento);

        marcas.Vacia = los_100_finales[0];
        console.log(
            "Procesando un total de líneas:", los_100_finales.length, "[", los_100_finales[0], "]",
            "Salida", salida
        );

        if (fs.existsSync(salida)) {
            fs.rmdirSync(salida, { recursive: true });
        }
        fs.mkdirSync(salida);

        los_100_finales.forEach(finalito => {

            if (!finalito || finalito == marcas.Vacia) return;

            const s: { subdir, nombre } = this.guardarFinalito(marcas, finalito, salida);

            finalito = marcas.Evento + finalito;
            fs.writeFileSync(`${salida}${s.subdir}${s.nombre}.pgn`, finalito);


        });
        console.log("¡Acabado!");

    }

    guardarFinalito(marcas: any, finalito: string, salida: string, log = false): {subdir: string, nombre: string} {
        finalito = marcas.Evento + finalito;
        // console.log("Creando finalito..."/*, finalito*/);

        let subdir = "";
        let nombre = this.extraer(finalito, marcas.Evento, marcas.Fin);

        [
            marcas.Diagrama,
            marcas.Solucion
        ]
        .forEach(
            m => subdir = this.comprobarSubdirectorio(subdir, nombre, m, salida, log)
        );

        nombre += subdir && nombre ? "-" : "";
        nombre += this.extraer(finalito, marcas.Blancas, marcas.Fin);

        [
            marcas.Diagrama,
            marcas.Solucion,
            marcas.Seccion,
            marcas.Resumen,
            marcas.Final,
        ]
        .forEach(
            m => subdir = this.comprobarSubdirectorio(subdir, nombre, m, salida, log)
        );

        nombre += nombre ? "-" : "";
        nombre += this.extraer(finalito, marcas.Negras, marcas.Fin);

        return { subdir, nombre };
    }

    extraer(finalito: string, m: string, f: string): string {

        const a = finalito.indexOf(m);
        const b = finalito.indexOf(f, a);

        const extracto = finalito
            .substring(a, b)
            .replace(m, "")
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u')
            .replace(/[/\\()?.%*:|"<>,-]/g, '')
            .replace(/ /g, '-');

        // console.log("Sus", extracto);
        return extracto;
    }

    acentos(finalito: string): string {

        const extracto = finalito
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u');

        // console.log("Sus", extracto);
        return extracto;
    }

    comprobarSubdirectorio(subdir: string, nombre: string, marca: string, salida: string, log = false): string {

        if (subdir) {

            if (log) {
                console.log("saliendo", subdir)
            }
            return subdir;
        };

        if (nombre.indexOf(marca) > -1) {
            subdir = marca.replace(/ ?/g, "");
        }


        if (log) {
            console.log("buscando", marca, nombre)
        }

        subdir = subdir ? `${subdir}/` : "";
        subdir = this.acentos(subdir);

        if (log) {
            console.log("quitando cosas raras", subdir)
        }

        if (subdir && !fs.existsSync(`${salida}/${subdir}`)) {
            fs.mkdirSync(`${salida}/${subdir}`);
        }

        if (log) {
            console.log("creando subdirectorio", `${salida}/${subdir}`)
        }

        return subdir;
    }
}

new Cortadora().cortar();

