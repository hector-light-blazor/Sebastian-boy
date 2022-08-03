import Worker from 'worker-loader!@/worker.js'

const worker = new Worker();


export const sendMessage = (message) => {
    worker.postMessage(message)
}