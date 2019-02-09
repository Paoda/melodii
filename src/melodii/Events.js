import EventEmitter from 'events';

class Emitter extends EventEmitter {};

let emitter = new Emitter();
emitter.setMaxListeners(Infinity);

export default emitter;