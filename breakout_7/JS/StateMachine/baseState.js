export class BaseState {
    constructor(sm) {
        this.sm = sm; // stateMachine
    }
  enter() {}   // se ejecuta al llegar
  exit()  {}   // se ejecuta al salir
  update(dt) {}
  draw(canvas, ctx) {}
  input(e) {}
}