
class MaSocket {
    #url;
    #args;

    constructor(url, args) {
        this.#url = url;
        this.#args = args;
    }

    parseo() {
        // Ejemplo: system.syncscorpion.syncventas.syncventasService.function
        // return: ../../../../thundercloud/system/syncscorpion/syncventas/syncventasService.php/function
        let urlArray = this.#url.split('.');
        let url = "../../../../thundercloud";
        let func = urlArray[urlArray.length-1];
        for(let i = 0; i < urlArray.length-1; i++) {
            url += "/" + urlArray[i];
        }
        return [url, func];
    }

    socket() {
        const socket = new WebSocket("ws://localhost:8080");
        const [url, func] = this.parseo();

        socket.onopen = () => {
            const message = JSON.stringify({
                action: url,
                data: {
                    args: this.#args,
                }
            });
            socket.send(message);
        }

        socket.onmessage = (e) => {
            console.log(`[message] Data received from server: ${e.data}`);
        }
    }

}